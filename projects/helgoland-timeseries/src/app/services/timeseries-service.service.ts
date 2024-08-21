import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable, Optional } from '@angular/core';
import {
  BarRenderingHints,
  ColorService,
  DatasetType,
  HelgolandDataset,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  LineRenderingHints,
  LocalStorage,
  SumValuesService,
  Time,
} from '@helgoland/core';
import {
  AxisSettings,
  BarStyle,
  D3SeriesGraphErrorHandler,
  D3SeriesSimpleGraphErrorHandler,
  DatasetChild,
  DatasetStyle,
  GraphDataEntry,
  LineStyle,
  SeriesGraphDataset,
} from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import { Duration, duration, unitOfTime } from 'moment';

import { Favorite } from './favorite.service';
import { DatasetsService } from './graph-datasets.service';
import { NotifierService } from './notifier.service';
import {
  DatasetFavoriteService,
  DatasetStateService,
} from './service-interfaces';

const TIMESERIES_STATE_LOCALSTORAGE = 'timeseries-state';
const TIMESERIES_FAVORITES_LOCALSTORAGE = 'timeseries-favorites';

const FAVORITE_PREFIX = 'ts_fav_';
interface SaveState {
  style: DatasetStyle;
  yaxis: AxisSettings;
  selected: boolean;
  visible: boolean;
}

interface FavoriteSaveState {
  favorite: Favorite;
  style: DatasetStyle;
  yAxis: AxisSettings;
}

export abstract class TimeseriesService {
  abstract addDataset(internalId: string): void;
  abstract hasDataset(id: string): boolean;
  abstract getDataset(internalId: string): HelgolandTimeseries | undefined;
  abstract removeDataset(id: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class TimeseriesServiceImpl
  implements TimeseriesService, DatasetStateService, DatasetFavoriteService
{
  private state = new Map<string, SaveState>();
  private favorites: {
    [key: string]: FavoriteSaveState;
  } = {};
  private datasetMap: Map<string, HelgolandTimeseries> = new Map();

  private presenterOptions = {
    sendDataRequestOnlyIfDatasetTimespanCovered: true,
    requestBeforeAfterValues: false,
    showReferenceValues: true,
    generalizeAllways: true,
    timespanBufferFactor: 0.2,
  };

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected localStorage: LocalStorage,
    protected timeSrvc: Time,
    protected sumValues: SumValuesService,
    protected colorService: ColorService,
    protected translate: TranslateService,
    protected graphDatasetsSrvc: DatasetsService,
    @Optional()
    protected errorHandler: D3SeriesGraphErrorHandler,
    protected notifier: NotifierService,
    protected la: LiveAnnouncer,
  ) {
    this.graphDatasetsSrvc.timespanChanged.subscribe(() =>
      this.datasetMap.forEach((dataset) =>
        this.loadDatasetData(dataset.internalId),
      ),
    );
    if (!errorHandler) {
      this.errorHandler = new D3SeriesSimpleGraphErrorHandler();
    }
    this.loadFavorites();
  }

  getDataset(internalId: string): HelgolandTimeseries | undefined {
    return this.datasetMap.get(internalId);
  }

  public async addDataset(internalId: string) {
    this.addDatasetbyId(internalId);
  }

  public getDatasets(): string[] {
    return [];
  }

  public hasDataset(id: string): boolean {
    return this.graphDatasetsSrvc.hasDataset(id);
  }

  public removeDataset(id: string) {
    this.graphDatasetsSrvc.deleteDataset(id, true);
  }

  getPermaId(ds: SeriesGraphDataset): string | undefined {
    const match = this.datasetMap.get(ds.id);
    if (match) {
      return this.encodeState(ds);
    } else {
      return undefined;
    }
  }

  private encodeState(ds: SeriesGraphDataset): string {
    const selected = ds.selected ? 't' : 'f';
    const visible = ds.visible ? 't' : 'f';
    const seperateYAxis = ds.yAxis.separate ? 't' : 'f';
    let style;
    if (ds.style instanceof LineStyle) {
      const styleArr = [
        ds.style.baseColor,
        ds.style.lineWidth,
        ds.style.pointRadius,
        ds.style.pointSymbol,
      ];
      style = JSON.stringify(styleArr);
    }
    return `ts_${ds.id}|${selected}|${visible}|${seperateYAxis}|${style}`;
  }

  private decodeState(str: string) {
    if (str.startsWith('ts_')) {
      str = str.substring(3);
      const [idStr, selectedStr, visibleStr, seperateYaxisStr, styleArrayStr] =
        str.split('|');
      let selected = undefined;
      if (selectedStr === 'f' || selectedStr === 't') {
        selected = selectedStr === 't';
      }
      let visible = undefined;
      if (visibleStr === 'f' || visibleStr === 't') {
        visible = visibleStr === 't';
      }
      let axis = undefined;
      if (seperateYaxisStr === 'f' || seperateYaxisStr === 't') {
        axis = new AxisSettings();
        axis.separate = seperateYaxisStr === 't';
      }
      let style = undefined;
      if (styleArrayStr) {
        const styleArr = JSON.parse(styleArrayStr);
        if (styleArr instanceof Array) {
          const [baseColor, lineWidth, pointRadius, pointSymbol] = styleArr;
          style = new LineStyle(baseColor, pointRadius, lineWidth, pointSymbol);
        }
      }
      this.addDatasetbyId(idStr, style, axis, visible, selected);
      return true;
    }
    return false;
  }

  validatePermaId(id: string): boolean {
    return this.decodeState(id);
  }

  canHandleDatasetAsFavorite(id: string): boolean {
    return id.startsWith(FAVORITE_PREFIX) || this.datasetMap.has(id);
  }

  isFavorite(id: string): boolean {
    return this.favorites[this.createFavoriteID(id)] !== undefined;
  }

  getFavorites(): Favorite[] {
    const favorites: Favorite[] = [];
    for (const key in this.favorites) {
      favorites.push(this.favorites[key].favorite);
    }
    return favorites;
  }

  getFavorite(id: string): Favorite {
    return this.favorites[this.createFavoriteID(id)].favorite;
  }

  createFavorite(ds: SeriesGraphDataset): Favorite {
    const favState: FavoriteSaveState = {
      favorite: {
        id: this.createFavoriteID(ds.id),
        label: `${ds.description.phenomenonLabel} @ ${ds.description.platformLabel} (${ds.description.procedureLabel})`,
        description: ds.description,
      },
      style: ds.style,
      yAxis: ds.yAxis,
    };
    this.favorites[this.createFavoriteID(ds.id)] = favState;
    this.saveFavorites();
    return favState.favorite;
  }

  private createFavoriteID(dsId: string): string {
    return `${FAVORITE_PREFIX}${dsId}`;
  }

  updateFavoriteLabel(fav: Favorite, label: string) {
    if (this.favorites[fav.id]) {
      this.favorites[fav.id].favorite.label = label;
    }
    this.saveFavorites();
  }

  addFavoriteToDiagram(fav: Favorite) {
    const dsId = fav.id.substring(FAVORITE_PREFIX.length);
    const entry = this.favorites[fav.id];
    const style = this.getStyleOfObject(entry.style);
    const yaxis = this.getYAxisOfObject(entry.yAxis);
    this.addDatasetbyId(dsId, style, yaxis);
  }

  removeFavorite(id: string) {
    delete this.favorites[id];
    this.saveFavorites();
  }

  private loadFavorites(): void {
    this.favorites =
      this.localStorage.load(TIMESERIES_FAVORITES_LOCALSTORAGE) || {};
  }

  private saveFavorites(): void {
    this.localStorage.save(TIMESERIES_FAVORITES_LOCALSTORAGE, this.favorites);
  }

  protected saveState(): void {
    this.localStorage.save(
      TIMESERIES_STATE_LOCALSTORAGE,
      Array.from(this.state),
    );
  }

  handleStoredDs(dsId: string): boolean {
    const state: Array<[id: string, state: any]> =
      this.localStorage.load(TIMESERIES_STATE_LOCALSTORAGE) || [];
    const match = state.find((e) => e[0] === dsId);
    if (match && match[1]) {
      try {
        const visible = match[1].visible;
        const selected = match[1].selected;
        const style = this.getStyleOfObject(match[1].style);
        const axis = this.getYAxisOfObject(match[1].yaxis);
        this.addDatasetbyId(dsId, style, axis, visible, selected);
        return true;
      } catch (error) {
        console.warn(`Could not parse styles for entry with id ${dsId}`);
        return false;
      }
    }
    return false;
  }

  protected addDatasetbyId(
    id: string,
    style?: DatasetStyle,
    axis?: AxisSettings,
    visible?: boolean,
    selected?: boolean,
  ): void {
    this.graphDatasetsSrvc.startLoadingDataset(id);
    this.servicesConnector
      .getDataset(id, {
        locale: this.translate.currentLang,
        type: DatasetType.Timeseries,
      })
      .subscribe({
        next: (res) =>
          this.loadAddedDataset(res, style, axis, visible, selected),
        error: (error) => {
          this.graphDatasetsSrvc.stopLoadingDatasetOnError(id);
          return this.errorHandler.handleDatasetLoadError(error);
        },
      });
  }

  protected loadAddedDataset(
    ts: HelgolandDataset,
    dsStyle?: DatasetStyle,
    dsAxis?: AxisSettings,
    visible = true,
    selected = false,
  ): void {
    if (ts instanceof HelgolandTimeseries) {
      const message = `${this.translate.instant('events.add-timeseries')}: ${
        ts.label
      }`;
      this.la.announce(message);
      this.notifier.notify(message);
      this.datasetMap.set(ts.internalId, ts);
      const style = dsStyle ? dsStyle : this.createStyle(ts);
      const yaxis = dsAxis ? dsAxis : this.createYAxis(ts);
      const dataset = new SeriesGraphDataset(
        ts.internalId,
        style,
        yaxis,
        visible,
        selected,
        {
          uom: ts.uom,
          phenomenonLabel: ts.parameters.phenomenon?.label,
          platformLabel: ts.platform.label,
          procedureLabel: ts.parameters.procedure?.label,
          categoryLabel: ts.parameters.category?.map((e) => e.label),
          featureLabel: ts.parameters.feature?.label,
          firstValue: ts.firstValue,
          lastValue: ts.lastValue,
        },
      );
      this.setState(dataset.id, style, yaxis, selected, visible);
      this.saveState();
      this.graphDatasetsSrvc.addOrUpdateDataset(dataset);
      dataset.deleteEvent.subscribe((ds) => {
        this.datasetMap.delete(ds.id);
        this.state.delete(ds.id);
        this.saveState();
      });
      dataset.stateChangeEvent.subscribe((ds) => {
        this.setState(ds.id, ds.style, ds.yAxis, ds.selected, ds.visible);
        this.saveState();
      });
      ts.referenceValues?.forEach((ref) => {
        const child = new DatasetChild(
          ref.referenceValueId,
          ref.label,
          ref.visible || false,
          [],
          this.colorService.getColor(),
        );
        dataset.addChild(child);
      });
      this.loadDatasetData(ts.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private createYAxis(ds: HelgolandTimeseries): AxisSettings {
    const axisSettings = new AxisSettings();
    if (ds.renderingHints?.chartType === 'bar') {
      axisSettings.range = { min: 0 };
    }
    return axisSettings;
  }

  private createStyle(ds: HelgolandTimeseries): DatasetStyle {
    if (ds.renderingHints && ds.renderingHints.chartType) {
      switch (ds.renderingHints.chartType) {
        case 'line':
          return this.handleLineRenderingHints(
            ds.renderingHints as LineRenderingHints,
          );
        case 'bar':
          return this.handleBarRenderingHints(
            ds.renderingHints as BarRenderingHints,
          );
      }
    }
    return new LineStyle(this.colorService.getColor(), 2, 2);
  }

  private getStyleOfObject(style: any): DatasetStyle {
    if (style.period) {
      return new BarStyle(
        style.baseColor,
        style.startOf,
        duration(style.period),
        style.lineWidth,
        style.lineDashArray,
      );
    } else {
      return new LineStyle(
        style.baseColor,
        style.pointRadius,
        style.lineWidth,
        style.pointSymbol,
        style.lineDashArray,
      );
    }
  }

  private getYAxisOfObject(yaxis: AxisSettings): AxisSettings {
    return new AxisSettings(
      yaxis.showSymbolOnAxis,
      yaxis.separate,
      yaxis.zeroBased,
      yaxis.autoRangeSelection,
      yaxis.range,
    );
  }

  protected handleLineRenderingHints(
    lineHints: LineRenderingHints,
  ): DatasetStyle {
    const color = lineHints.properties?.color || this.colorService.getColor();
    let lineWidth = 2;
    if (lineHints && lineHints.properties.width) {
      lineWidth = Math.round(parseFloat(lineHints.properties.width));
    }
    return new LineStyle(color, lineWidth, lineWidth);
  }

  protected handleBarRenderingHints(barHints: BarRenderingHints): DatasetStyle {
    let lineWidth = 2;
    let startOf: unitOfTime.StartOf = 'day';
    let period: Duration = duration('P1D');
    if (barHints && barHints.properties.width) {
      lineWidth = Math.round(parseFloat(barHints.properties.width));
    }
    const color = barHints.properties?.color || this.colorService.getColor();
    if (barHints && barHints.properties.interval) {
      if (barHints.properties.interval === 'byDay') {
        period = duration('P1D');
        startOf = 'day';
      }
      if (barHints.properties.interval === 'byHour') {
        period = duration('PT1H');
        startOf = 'hour';
      }
    }
    return new BarStyle(color, startOf, period, lineWidth);
  }

  private setState(
    id: string,
    style: DatasetStyle,
    yaxis: AxisSettings,
    selected: boolean,
    visible: boolean,
  ) {
    const dsState: SaveState = {
      style: style,
      yaxis: yaxis,
      selected: selected,
      visible: visible,
    };
    this.state.set(id, dsState);
  }

  private loadDatasetData(id: string) {
    this.loadOverviewData(id);
    const graphDS = this.graphDatasetsSrvc.getDatasetEntry(id);
    const dataset = this.datasetMap.get(id);
    if (this.graphDatasetsSrvc.timespan && dataset && graphDS) {
      this.graphDatasetsSrvc.setDataLoading(id, true);
      if (
        this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered &&
        graphDS.description.firstValue &&
        graphDS.description.lastValue &&
        !this.timeSrvc.overlaps(
          this.graphDatasetsSrvc.timespan,
          graphDS.description.firstValue.timestamp,
          graphDS.description.lastValue.timestamp,
        )
      ) {
        this.prepareData(dataset, new HelgolandTimeseriesData([]));
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(
          this.graphDatasetsSrvc.timespan,
          this.presenterOptions.timespanBufferFactor,
          duration(1, 'day').asMilliseconds(),
        );
        this.servicesConnector
          .getDatasetData(dataset, buffer, {
            expanded:
              this.presenterOptions.showReferenceValues ||
              this.presenterOptions.requestBeforeAfterValues,
            generalize: this.presenterOptions.generalizeAllways,
          })
          .subscribe({
            next: (result) => this.prepareData(dataset, result),
            error: (error) =>
              this.errorHandler.handleDataLoadError(error, dataset),
          });
      }
    }
  }

  private loadOverviewData(id: string) {
    if (this.graphDatasetsSrvc.overviewTimespan) {
      const graphDS = this.graphDatasetsSrvc.getDatasetEntry(id);
      const dataset = this.datasetMap.get(id);
      if (!dataset || !graphDS) return;
      this.graphDatasetsSrvc.setOverviewDataLoading(id, true);
      if (
        this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered &&
        graphDS.description.firstValue &&
        graphDS.description.lastValue &&
        !this.timeSrvc.overlaps(
          this.graphDatasetsSrvc.overviewTimespan,
          graphDS.description.firstValue.timestamp,
          graphDS.description.lastValue.timestamp,
        )
      ) {
        this.prepareOverviewData(dataset, new HelgolandTimeseriesData([]));
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(
          this.graphDatasetsSrvc.overviewTimespan,
          this.presenterOptions.timespanBufferFactor,
          duration(1, 'day').asMilliseconds(),
        );
        this.servicesConnector
          .getDatasetData(dataset, buffer, {
            expanded:
              this.presenterOptions.showReferenceValues ||
              this.presenterOptions.requestBeforeAfterValues,
            generalize: true,
          })
          .subscribe({
            next: (result) => this.prepareOverviewData(dataset, result),
            error: (error) =>
              this.errorHandler.handleDataLoadError(error, dataset),
          });
      }
    }
  }

  private prepareData(
    dataset: HelgolandTimeseries,
    rawdata: HelgolandTimeseriesData,
  ): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) {
        rawdata.values.unshift(rawdata.valueBeforeTimespan);
      }
      if (rawdata.valueAfterTimespan) {
        rawdata.values.push(rawdata.valueAfterTimespan);
      }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      // sum values for bar chart visualization
      const style = this.state.get(dataset.internalId)?.style;
      if (style && style instanceof BarStyle) {
        const startOf = style.startOf as unitOfTime.StartOf;
        const period = duration(style.period);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map((e) => ({
        timestamp: e[0],
        value: e[1],
      }));

      const ds = this.graphDatasetsSrvc.getDatasetEntry(dataset.internalId);
      this.addReferenceValueDatasets(ds, rawdata);
      ds.setData(data);
      this.graphDatasetsSrvc.setDataLoading(ds.id, false);
    }
  }

  private addReferenceValueDatasets(
    ds: SeriesGraphDataset,
    rawdata: HelgolandTimeseriesData,
  ) {
    if (ds.children && ds.children.length) {
      ds.children.forEach((child) => {
        const refVals = rawdata.referenceValues[child.id];
        if (refVals) {
          child.setData(this.createReferenceValueData(rawdata, child.id));
        }
      });
    }
  }

  private createReferenceValueData(
    data: HelgolandTimeseriesData,
    refId: string,
  ): GraphDataEntry[] {
    let refValues = data.referenceValues[refId] as any;
    if (!(refValues instanceof Array)) {
      if (refValues.valueBeforeTimespan) {
        refValues.values.unshift(refValues.valueBeforeTimespan);
      }
      if (refValues.valueAfterTimespan) {
        refValues.values.push(refValues.valueAfterTimespan);
      }
      refValues = refValues.values;
    }
    return refValues.map((d: any) => ({ timestamp: d[0], value: d[1] }));
  }

  private prepareOverviewData(
    dataset: HelgolandTimeseries,
    rawdata: HelgolandTimeseriesData,
  ): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) {
        rawdata.values.unshift(rawdata.valueBeforeTimespan);
      }
      if (rawdata.valueAfterTimespan) {
        rawdata.values.push(rawdata.valueAfterTimespan);
      }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      // sum values for bar chart visualization
      const style = this.state.get(dataset.internalId);
      if (style instanceof BarStyle) {
        const startOf = style.startOf as unitOfTime.StartOf;
        const period = duration(style.period);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map((e) => ({
        timestamp: e[0],
        value: e[1],
      }));

      const ds = this.graphDatasetsSrvc.getOverviewDatasetEntry(
        dataset.internalId,
      );
      ds.setData(data);
      this.graphDatasetsSrvc.setOverviewDataLoading(ds.id, false);
    }
  }
}
