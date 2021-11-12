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
  D3TimeseriesGraphErrorHandler,
  D3TimeseriesSimpleGraphErrorHandler,
  DatasetChild,
  DatasetEntry,
  DatasetStyle,
  GraphDataEntry,
  LineStyle,
} from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import { Duration, duration, unitOfTime } from 'moment';

import { DatasetsService } from './graph-datasets.service';

const TIMESERIES_STATE = 'timeseries-state';

interface SaveState {
  style: DatasetStyle,
  yaxis: AxisSettings,
  selected: boolean,
  visible: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService {

  private state: {
    [key: string]: SaveState
  } = {}
  private datasetMap: Map<string, HelgolandTimeseries> = new Map();

  private presenterOptions = {
    sendDataRequestOnlyIfDatasetTimespanCovered: true,
    requestBeforeAfterValues: false,
    showReferenceValues: true,
    generalizeAllways: true,
    timespanBufferFactor: 0.2
  }

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected localStorage: LocalStorage,
    protected timeSrvc: Time,
    protected sumValues: SumValuesService,
    protected colorService: ColorService,
    protected translate: TranslateService,
    protected graphDatasetsSrvc: DatasetsService,
    @Optional() protected errorHandler: D3TimeseriesGraphErrorHandler = new D3TimeseriesSimpleGraphErrorHandler(),
  ) {
    this.loadState();
    this.graphDatasetsSrvc.timespanChanged.subscribe(() => this.datasetMap.forEach((dataset) => this.loadDatasetData(dataset.internalId)))
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
    this.graphDatasetsSrvc.deleteDataset(id);
  }

  protected loadState(): void {
    this.state = this.localStorage.load(TIMESERIES_STATE) || {};
    for (const key in this.state) {
      this.addDatasetbyId(key);
    }
  }

  protected saveState(): void {
    this.localStorage.save(TIMESERIES_STATE, this.state)
  }

  protected addDatasetbyId(id: string): void {
    this.servicesConnector.getDataset(id, { locale: this.translate.currentLang, type: DatasetType.Timeseries }).subscribe(
      res => this.loadAddedDataset(res),
      error => this.errorHandler.handleDatasetLoadError(error)
    );
  }

  private loadAddedDataset(ts: HelgolandDataset): void {
    if (ts instanceof HelgolandTimeseries) {
      this.datasetMap.set(ts.internalId, ts);
      const visible = this.state[ts.internalId] ? this.state[ts.internalId].visible : true;
      const selected = this.state[ts.internalId] ? this.state[ts.internalId].selected : false;
      const style = this.getStyle(ts);
      const yaxis = this.getYAxis(ts);
      const dataset = new DatasetEntry(
        ts.internalId,
        style,
        yaxis,
        visible,
        selected,
        {
          uom: ts.uom,
          phenomenonLabel: ts.parameters.phenomenon.label,
          platformLabel: ts.platform.label,
          procedureLabel: ts.parameters.procedure.label,
          categoryLabel: ts.parameters.category.label,
          firstValue: ts.firstValue,
          lastValue: ts.lastValue
        }
      )
      this.setState(dataset.id, style, yaxis, selected, visible);
      this.saveState();
      this.graphDatasetsSrvc.addOrUpdateDataset(dataset);
      dataset.deleteEvent.subscribe(ds => {
        delete this.state[ds.id];
        this.saveState();
      });
      dataset.stateChangeEvent.subscribe(ds => {
        this.setState(ds.id, ds.getStyle(), ds.getYAxis(), ds.getSelected(), ds.visible);
        this.saveState();
      });
      ts.referenceValues.forEach(ref => {
        const child = new DatasetChild(ref.referenceValueId, ref.label, ref.visible || false, [], this.colorService.getColor());
        dataset.addChild(child);
      });
      this.loadDatasetData(ts.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private getYAxis(ds: HelgolandTimeseries): AxisSettings {
    if (this.state[ds.internalId] && this.state[ds.internalId].yaxis) {
      const yaxis = this.state[ds.internalId].yaxis;
      return new AxisSettings(yaxis.showSymbolOnAxis, yaxis.separate, yaxis.zeroBased, yaxis.autoRangeSelection, yaxis.range);
    } else {
      const axisSettings = new AxisSettings();
      if (ds.renderingHints.chartType === 'bar') {
        axisSettings.range = { min: 0 };
      }
      return axisSettings;
    }
  }

  private getStyle(ds: HelgolandTimeseries): DatasetStyle {
    if (this.state[ds.internalId] && this.state[ds.internalId].style) {
      const style = this.state[ds.internalId].style as any;
      if (style.period) {
        return new BarStyle(style.baseColor, style.startOf, duration(style.period), style.lineWidth, style.lineDashArray);
      } else {
        return new LineStyle(style.baseColor, style.pointRadius, style.lineWidth, style.pointSymbol, style.lineDashArray);
      }
    } else {
      if (ds.renderingHints && ds.renderingHints.chartType) {
        switch (ds.renderingHints.chartType) {
          case 'line':
            return this.handleLineRenderingHints(ds.renderingHints as LineRenderingHints);
          case 'bar':
            return this.handleBarRenderingHints(ds.renderingHints as BarRenderingHints);
        }
      }
      return new LineStyle(this.colorService.getColor(), 2, 2);
    }
  }

  protected handleLineRenderingHints(lineHints: LineRenderingHints): DatasetStyle {
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

  private setState(id: string, style: DatasetStyle, yaxis: AxisSettings, selected: boolean, visible: boolean) {
    const dsState: SaveState = {
      style: style,
      yaxis: yaxis,
      selected: selected,
      visible: visible
    }
    this.state[id] = dsState;
  }

  private loadDatasetData(id: string) {
    this.loadOverviewData(id);
    const dataset = this.datasetMap.get(id);
    if (this.graphDatasetsSrvc.timespan) {
      this.graphDatasetsSrvc.setDataLoading(id, true);
      if (this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.graphDatasetsSrvc.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareData(dataset, new HelgolandTimeseriesData([]));
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(this.graphDatasetsSrvc.timespan, this.presenterOptions.timespanBufferFactor, duration(1, 'day').asMilliseconds());
        this.servicesConnector.getDatasetData(dataset, buffer, {
          expanded: this.presenterOptions.showReferenceValues || this.presenterOptions.requestBeforeAfterValues,
          generalize: this.presenterOptions.generalizeAllways
        }).subscribe(
          (result) => this.prepareData(dataset, result),
          (error) => this.errorHandler.handleDataLoadError(error, dataset)
        );
      }
    }
  }

  private loadOverviewData(id: string) {
    if (this.graphDatasetsSrvc.overviewTimespan) {
      const dataset = this.datasetMap.get(id);
      this.graphDatasetsSrvc.setOverviewDataLoading(id, true);
      if (this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.graphDatasetsSrvc.overviewTimespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareOverviewData(dataset, new HelgolandTimeseriesData([]));
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(this.graphDatasetsSrvc.overviewTimespan, this.presenterOptions.timespanBufferFactor, duration(1, 'day').asMilliseconds());
        this.servicesConnector.getDatasetData(dataset, buffer, {
          expanded: this.presenterOptions.showReferenceValues || this.presenterOptions.requestBeforeAfterValues,
          generalize: true
        }).subscribe(
          (result) => this.prepareOverviewData(dataset, result),
          (error) => this.errorHandler.handleDataLoadError(error, dataset)
        );
      }
    }
  }

  private prepareData(dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      // sum values for bar chart visualization
      if (this.state[dataset.internalId].style instanceof BarStyle) {
        const style = this.state[dataset.internalId].style as BarStyle;
        const startOf = style.startOf as unitOfTime.StartOf;
        const period = duration(style.period);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map(e => ({ timestamp: e[0], value: e[1] }));

      const ds = this.graphDatasetsSrvc.getDatasetEntry(dataset.internalId);
      this.addReferenceValueDatasets(ds, dataset, rawdata);
      ds.setData(data);
      ds.dataLoading = false;
    }
  }

  private addReferenceValueDatasets(ds: DatasetEntry, dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData) {
    if (ds.getChildren() && ds.getChildren().length) {
      ds.getChildren().forEach(child => {
        const refVals = rawdata.referenceValues[child.id];
        if (refVals) {
          child.data = this.createReferenceValueData(rawdata, child.id);
        }
      });
    }
  }

  private createReferenceValueData(data: HelgolandTimeseriesData, refId: string): GraphDataEntry[] {
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
    return refValues.map(d => ({ timestamp: d[0], value: d[1] }));
  }

  private prepareOverviewData(dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      // sum values for bar chart visualization
      if (this.state[dataset.internalId].style instanceof BarStyle) {
        const style = this.state[dataset.internalId].style as BarStyle;
        const startOf = style.startOf as unitOfTime.StartOf;
        const period = duration(style.period);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map(e => ({ timestamp: e[0], value: e[1] }));

      const ds = this.graphDatasetsSrvc.getDatasetEntry(dataset.internalId);
      ds.setOverviewData(data);
      ds.overviewDataLoading = false;

      // this.addReferenceValueDatasets(dataset, options, rawdata);
    }
  }

}
