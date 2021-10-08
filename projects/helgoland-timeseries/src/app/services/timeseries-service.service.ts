import { EventEmitter, Injectable, Optional } from '@angular/core';
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

import { DatasetEntry, DatasetsService } from './graph-datasets.service';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';

/**
 * // TODO: 
 * - ersetze Service mit neuem Service
 * - Service hat ein haupt Timespan
 * - Service hat overview Timespan
 * - Liste von GraphDatasets für normales Diagram
 * - Liste von GraphDatasets für Overview Diagram
 * - EventEmitter für TimespanChange
 * - EventEmitter für DatasetChange
 */

interface TimeseriesExtended extends HelgolandTimeseries {
  dataLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService {

  // TODO: remove later: 
  public datasetIds: string[] = [];
  public datasetOptions: Map<string, DatasetOptions> = new Map();
  public datasetIdsChanged: EventEmitter<string[]> = new EventEmitter();
  public updateDatasetOptions(options: any, internalId: string) { }
  public removeDataset(internalId: string) { }
  public removeAllDatasets() { }
  public hasDatasets() { return true }
  public hasDataset(id: string): boolean { return false }
  // bis hierher

  protected datasetMap: Map<string, TimeseriesExtended> = new Map();

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
    //   protected timezoneSrvc: TimezoneService,
    protected translate: TranslateService,
    //   protected la: LiveAnnouncer,
    protected graphDatasetsSrvc: DatasetsService,
    @Optional() protected errorHandler: D3TimeseriesGraphErrorHandler = new D3TimeseriesSimpleGraphErrorHandler(),
  ) {
    this.loadState();

    this.graphDatasetsSrvc.timespanChanged.subscribe(() => {
      this.datasetMap.forEach((dataset) => this.loadDatasetData(dataset.internalId));
    })
  }

  // public removeAllDatasets() {
  //   super.removeAllDatasets();
  //   this.la.announce(this.translate.instant('events.all-timeseries-removed'));
  // }

  // protected async addLoadedDataset(timeseries: HelgolandTimeseries, resolve: (value?: boolean | PromiseLike<boolean>) => void) {
  //   super.addLoadedDataset(timeseries, resolve);
  //   const message = `${this.translate.instant('events.add-timeseries')}: ${timeseries.label}`;
  //   this.la.announce(message);
  // }

  // protected createStyles(internalId: string): DatasetOptions {
  //   const options = new DatasetOptions(internalId, new ColorService().getColor());
  //   options.generalize = false;
  //   options.lineWidth = 2;
  //   options.pointRadius = 2;
  //   return options;
  // }

  // protected handleBarRenderingHints(barHints: BarRenderingHints, options: DatasetOptions) {
  //   super.handleBarRenderingHints(barHints, options);
  //   options.yAxisRange = { min: 0 };
  // }

  public async addDataset(internalId: string, options?: any) {
    if (!options) {
      const options = new DatasetOptions(internalId, new ColorService().getColor());
      options.generalize = false;
      options.lineWidth = 2;
      options.pointRadius = 2;
      this.datasetOptions.set(internalId, options);
    }
    this.addDatasetbyId(internalId);
  }

  protected loadState(): void {
    const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM);
    if (options && options.length) { options.forEach(e => this.datasetOptions.set(e.internalId, e)); }
    this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
    this.datasetIds.forEach(e => this.addDatasetbyId(e));
  }

  // protected saveState(): void {
  //   this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
  //   this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  // }

  protected addDatasetbyId(id: string): void {
    this.servicesConnector.getDataset(id, { locale: this.translate.currentLang, type: DatasetType.Timeseries }).subscribe(
      res => this.loadAddedDataset(res),
      // error => this.errorHandler.handleDatasetLoadError(error)
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
    const datasetOptions = this.datasetOptions.get(id);
    const dataset = this.datasetMap.get(id);
    if (this.graphDatasetsSrvc.timespan) {
      this.graphDatasetsSrvc.setDataLoading(id, true);
      if (this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.graphDatasetsSrvc.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareData(dataset, new HelgolandTimeseriesData([]));
        this.onCompleteLoadingData(dataset);
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(this.graphDatasetsSrvc.timespan, this.presenterOptions.timespanBufferFactor, duration(1, 'day').asMilliseconds());
        // this.onContentLoading.emit(true);
        dataset.dataLoading = true;
        // this.informDatasetLoading(this.getLoadedDatasets());
        // if (this.runningDataRequests.has(dataset.internalId)) {
        //   this.runningDataRequests.get(dataset.internalId).unsubscribe();
        //   this.onCompleteLoadingData(dataset);
        // }
        const request = this.servicesConnector.getDatasetData(dataset, buffer, {
          expanded: this.presenterOptions.showReferenceValues || this.presenterOptions.requestBeforeAfterValues,
          generalize: this.presenterOptions.generalizeAllways || datasetOptions.generalize
        }).subscribe(
          (result) => {
            this.prepareData(dataset, result);
            this.onCompleteLoadingData(dataset);
          },
          (error) => {
            this.errorHandler.handleDataLoadError(error, dataset);
            this.onCompleteLoadingData(dataset);
          }
        );
        // if (!request.closed) {
        //   this.runningDataRequests.set(dataset.internalId, request);
        // }
      }
    }
  }

  private onCompleteLoadingData(dataset: TimeseriesExtended): void {
    dataset.dataLoading = false;
    // this.runningDataRequests.delete(dataset.internalId);
    // const loadedIds = this.getLoadedDatasets();
    // this.informDatasetLoading(loadedIds);
    // if (loadedIds.length === 0) { this.onContentLoading.emit(false); }
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
