import { Injectable, Optional } from '@angular/core';
import {
  ColorService,
  DatasetType,
  HelgolandDataset,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  LocalStorage,
  SumValuesService,
  Time,
} from '@helgoland/core';
import {
  AxisSettings,
  BarStyle,
  D3TimeseriesGraphErrorHandler,
  D3TimeseriesSimpleGraphErrorHandler,
  DatasetEntry,
  DatasetStyle,
  LineStyle,
} from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import { duration, unitOfTime } from 'moment';

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
    showReferenceValues: false,
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
    this.state = this.localStorage.load(TIMESERIES_STATE);
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

  private loadAddedDataset(dataset: HelgolandDataset): void {
    if (dataset instanceof HelgolandTimeseries) {
      this.datasetMap.set(dataset.internalId, dataset);
      const visible = this.state[dataset.internalId] ? this.state[dataset.internalId].visible : true;
      const selected = this.state[dataset.internalId] ? this.state[dataset.internalId].selected : false;
      const style = this.getStyle(dataset);
      const yaxis = this.getYAxis(dataset);
      const datasetEntry = new DatasetEntry(
        dataset.internalId,
        style,
        yaxis,
        visible,
        selected,
        {
          uom: dataset.uom,
          phenomenonLabel: dataset.parameters.phenomenon.label,
          platformLabel: dataset.platform.label,
          procedureLabel: dataset.parameters.procedure.label,
          categoryLabel: dataset.parameters.category.label,
          firstValue: dataset.firstValue,
          lastValue: dataset.lastValue
        }
      )
      this.setState(datasetEntry.id, style, yaxis, selected, visible);
      this.saveState();
      this.graphDatasetsSrvc.addOrUpdateDataset(datasetEntry);
      datasetEntry.deleteEvent.subscribe(ds => {
        delete this.state[ds.id];
        this.saveState();
      });
      datasetEntry.stateChangeEvent.subscribe(ds => {
        this.setState(ds.id, ds.getStyle(), ds.getYAxis(), ds.selected, ds.visible);
        this.saveState();
      })
      this.loadDatasetData(dataset.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private getYAxis(ds: HelgolandTimeseries): AxisSettings {
    if (this.state[ds.internalId] && this.state[ds.internalId].yaxis) {
      const yaxis = this.state[ds.internalId].yaxis;
      return new AxisSettings(yaxis.showSymbolOnAxis, yaxis.separate, yaxis.zeroBased, yaxis.autoRangeSelection, yaxis.range);
    } else {
      return new AxisSettings()
    }
  }

  private getStyle(ds: HelgolandTimeseries): DatasetStyle {
    if (this.state[ds.internalId] && this.state[ds.internalId].style) {
      const style = this.state[ds.internalId].style as LineStyle;
      return new LineStyle(style.baseColor, style.pointRadius, style.lineWidth, style.pointSymbol, style.lineDashArray);
    } else {
      return new LineStyle(this.colorService.getColor(), 2, 2);
    }
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
      ds.setData(data);
      ds.dataLoading = false;

      // this.addReferenceValueDatasets(dataset, options, rawdata);
    }
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
