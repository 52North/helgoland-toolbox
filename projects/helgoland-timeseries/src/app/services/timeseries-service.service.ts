import { Injectable, Optional } from '@angular/core';
import {
  ColorService,
  DatasetOptions,
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
  DatasetStyle,
  LineStyle,
} from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import { duration, unitOfTime } from 'moment';

import { DatasetEntry, DatasetHandler, DatasetsService } from './graph-datasets.service';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService implements DatasetHandler {

  private datasetIds: string[] = [];
  private datasetOptions: Map<string, DatasetOptions> = new Map();
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

  public async addDataset(internalId: string, options?: any) {
    if (!options) {
      const options = new DatasetOptions(internalId, new ColorService().getColor());
      options.generalize = false;
      options.lineWidth = 2;
      options.pointRadius = 2;
      this.datasetOptions.set(internalId, options);
      this.datasetIds.push(internalId);
      this.saveState();
    }
    this.addDatasetbyId(internalId);
  }

  public getDatasets(): string[] {
    return this.datasetIds;
  }

  public hasDataset(id: string): boolean {
    return this.graphDatasetsSrvc.hasDataset(id);
  }

  public removedDataset(id: string) {
    const datasetIdx = this.datasetIds.indexOf(id);
    if (datasetIdx > -1) {
      this.datasetIds.splice(datasetIdx, 1);
      this.datasetOptions.delete(id);
    }
    this.saveState();
  }

  public removeDataset(id: string) {
    this.graphDatasetsSrvc.deleteDataset(id);
  }

  protected loadState(): void {
    const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM);
    if (options && options.length) { options.forEach(e => this.datasetOptions.set(e.internalId, e)); }
    this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
    this.datasetIds.forEach(e => this.addDatasetbyId(e));
  }

  protected saveState(): void {
    this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
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
      const options = this.datasetOptions.get(dataset.internalId)
      const datasetEntry: DatasetEntry = {
        id: dataset.internalId,
        graphDataset: {
          id: dataset.internalId,
          selected: false,
          visible: options.visible,
          data: [],
          loading: true,
          style: this.getGraphStyle(options),
          yaxis: this.getAxisSettings(dataset.uom, options)
        },
        overviewGraphDataset: {
          id: dataset.internalId,
          selected: false,
          visible: options.visible,
          data: [],
          loading: true,
          style: this.getGraphStyle(options),
          yaxis: this.getAxisSettings(dataset.uom, options)
        },
        handler: this,
        description: {
          id: dataset.internalId,
          uom: dataset.uom,
          phenomenonLabel: dataset.parameters.phenomenon.label,
          platformLabel: dataset.platform.label,
          procedureLabel: dataset.parameters.procedure.label,
          categoryLabel: dataset.parameters.category.label,
          firstValue: dataset.firstValue,
          lastValue: dataset.lastValue
        }
      }
      this.graphDatasetsSrvc.addOrUpdateDataset(datasetEntry);
      this.loadDatasetData(dataset.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private loadDatasetData(id: string) {
    this.loadOverviewData(id);
    const datasetOptions = this.datasetOptions.get(id);
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
          generalize: this.presenterOptions.generalizeAllways || datasetOptions.generalize
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

      const options = this.datasetOptions.get(dataset.internalId);

      // sum values for bar chart visualization
      if (options.type === 'bar') {
        const startOf = options.barStartOf as unitOfTime.StartOf;
        const period = duration(options.barPeriod);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map(e => ({ timestamp: e[0], value: e[1] }));

      this.graphDatasetsSrvc.updateData(dataset.internalId, data);

      // this.addReferenceValueDatasets(dataset, options, rawdata);
    }
  }

  private prepareOverviewData(dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      const options = this.datasetOptions.get(dataset.internalId);

      // sum values for bar chart visualization
      if (options.type === 'bar') {
        const startOf = options.barStartOf as unitOfTime.StartOf;
        const period = duration(options.barPeriod);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map(e => ({ timestamp: e[0], value: e[1] }));

      this.graphDatasetsSrvc.updateOverviewData(dataset.internalId, data);

      // this.addReferenceValueDatasets(dataset, options, rawdata);
    }
  }

  private getAxisSettings(uom: string, options: DatasetOptions): AxisSettings {
    return new AxisSettings(uom, true, options.separateYAxis, options.zeroBasedYAxis, options.autoRangeSelection, options.yAxisRange);
  }

  private getGraphStyle(options: DatasetOptions): DatasetStyle {
    const color = options.color ? options.color : this.colorService.getColor();
    if (options.type === 'line') {
      return new LineStyle(color, options.pointRadius, options.lineWidth, options.pointSymbol, options.lineDashArray);
    }
    if (options.type === 'bar') {
      const startOf = options.barStartOf as unitOfTime.StartOf;
      const period = duration(options.barPeriod);
      return new BarStyle(color, startOf, period, options.lineWidth, options.lineDashArray);
    }
  }

}
