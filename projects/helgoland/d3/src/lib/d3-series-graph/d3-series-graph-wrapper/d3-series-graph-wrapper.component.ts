import { Component, EventEmitter, Input, IterableDiffers, OnChanges, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  ColorService,
  Data,
  DatasetOptions,
  DatasetPresenterComponent,
  DatasetType,
  HelgolandDataset,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  InternalIdHandler,
  SumValuesService,
  Time,
  Timespan,
  TimeValueTuple,
  TimezoneService,
} from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { duration, unitOfTime } from 'moment';

import {
  D3TimeseriesGraphErrorHandler,
  D3TimeseriesSimpleGraphErrorHandler,
} from '../../d3-timeseries-graph/d3-timeseries-graph-error-handler.service';
import { D3GraphHelperService } from '../../helper/d3-graph-helper.service';
import { D3HoveringService } from '../../helper/hovering/d3-hovering-service';
import { HighlightOutput } from '../../model/d3-highlight';
import { D3PlotOptions, HoveringStyle } from '../../model/d3-plot-options';
import {
  D3SeriesGraphComponent,
  D3SeriesGraphOptions,
  DatasetDescription,
  DatasetEntry,
  DatasetStyle,
} from '../d3-series-graph.component';
import { AxisSettings } from './../d3-series-graph.component';

@Component({
  selector: 'n52-d3-series-graph-wrapper',
  templateUrl: './d3-series-graph-wrapper.component.html',
  styleUrls: ['./d3-series-graph-wrapper.component.scss']
})
export class D3SeriesGraphWrapperComponent extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions> implements OnChanges {

  @Input() public yaxisModifier: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

  @Input() public hoveringService: D3HoveringService;

  public datasets: DatasetEntry[] = [];
  public timespan: Timespan;

  public graphOptions: D3SeriesGraphOptions = {
    grid: true,
    showTimeLabel: false,
    hoverStyle: HoveringStyle.point,
    timeRangeLabel: {
      show: false
    },
    yaxis: true,
    yaxisModifier: true
  }

  @ViewChild(D3SeriesGraphComponent)
  private d3Graph!: D3SeriesGraphComponent;

  protected datasetMap: Map<string, HelgolandTimeseries> = new Map();

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected servicesConnector: HelgolandServicesConnector,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected translateService: TranslateService,
    protected timezoneSrvc: TimezoneService,
    protected sumValues: SumValuesService,
    protected colorService: ColorService,
    protected graphHelper: D3GraphHelperService,
    @Optional() protected errorHandler: D3TimeseriesGraphErrorHandler = new D3TimeseriesSimpleGraphErrorHandler(),
  ) {
    super(
      iterableDiffers,
      servicesConnector,
      datasetIdResolver,
      timeSrvc,
      translateService,
      timezoneSrvc
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.yaxisModifier) {
      this.graphOptions.yaxisModifier = this.yaxisModifier !== undefined ? this.yaxisModifier : this.graphOptions.yaxisModifier;
      this.drawGraph();
    }
  }

  public reloadDataForDatasets(datasetIds: string[]): void {
    datasetIds.forEach(id => {
      if (this.datasetMap.has(id)) {
        this.loadDatasetData(id);
      }
    });
  }

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void { }

  protected onTimezoneChanged(timezone: string): void {
    throw new Error('Method not implemented.');
  }

  protected timeIntervalChanges(): void {
    this.datasetMap.forEach((dataset) => this.loadDatasetData(dataset.internalId));
  }

  protected addDataset(id: string, url: string): void {
    this.servicesConnector.getDataset({ id, url }, { locale: this.translateService.currentLang, type: DatasetType.Timeseries }).subscribe(
      res => this.loadAddedDataset(res),
      error => this.errorHandler.handleDatasetLoadError(error)
    );
  }

  protected removeDataset(id: string): void {
    const dataset = this.datasetMap.get(id);
    // first remove all reference values
    // dataset.referenceValues.forEach(refVal => {
    //   const refValIdx = this.graphDatasets.findIndex(e => e.id === this.createRefValueId(id, refVal.referenceValueId));
    //   if (refValIdx >= 0) {
    //     this.graphDatasets.splice(refValIdx, 1);
    //   }
    // })
    // now delete dataset
    this.datasetMap.delete(id);
    const spliceIdx = this.datasets.findIndex((e) => e.id === id);
    if (spliceIdx >= 0) {
      this.datasets.splice(spliceIdx, 1);
    }
  }

  protected setSelectedId(id: string): void {
    const dataset = this.datasets.find((e) => e.id === id);
    if (dataset) {
      dataset.setSelected(true);
    }
    this.drawGraph();
  }

  protected removeSelectedId(id: string): void {
    const dataset = this.datasets.find((e) => e.id === id);
    if (dataset) {
      dataset.setSelected(false);
    }
    this.drawGraph();
  }

  protected presenterOptionsChanged(options: D3PlotOptions): void {
    this.graphOptions.grid = options.grid !== undefined ? options.grid : this.graphOptions.grid;
    this.graphOptions.hoverStyle = options.hoverStyle !== undefined ? options.hoverStyle : this.graphOptions.hoverStyle;
    this.graphOptions.showTimeLabel = options.showTimeLabel !== undefined ? options.showTimeLabel : this.graphOptions.showTimeLabel;
    this.graphOptions.timeRangeLabel = options.timeRangeLabel !== undefined ? options.timeRangeLabel : this.graphOptions.timeRangeLabel;
    this.graphOptions.togglePanZoom = options.togglePanZoom !== undefined ? options.togglePanZoom : this.graphOptions.togglePanZoom;
    this.graphOptions.yaxis = options.yaxis !== undefined ? options.yaxis : this.graphOptions.yaxis;
    this.graphOptions.yaxisModifier = this.yaxisModifier !== undefined ? this.yaxisModifier : this.graphOptions.yaxisModifier;
    this.presenterOptions.timespanBufferFactor = this.presenterOptions.timespanBufferFactor !== undefined ? this.presenterOptions.timespanBufferFactor : 0.2;
    this.presenterOptions.requestBeforeAfterValues = this.presenterOptions.requestBeforeAfterValues !== undefined ? this.presenterOptions.requestBeforeAfterValues : false;
    this.drawGraph();
  }

  protected datasetOptionsChanged(id: string, options: DatasetOptions, firstChange: boolean): void {
    if (!firstChange) {
      const dataset = this.datasets.find((e) => e.id === id);
      dataset.setYAxis(this.getAxisSettings(options));
      dataset.setStyle(this.getGraphStyle(options));
      dataset.visible = options.visible;
      // this.datasets.forEach(e => {
      //   if (e.id.startsWith(id + 'ref')) {
      //     e.visible = false;
      //   }
      // })
      // options.showReferenceValues.forEach(refVal => {
      //   const refValDs = this.graphDatasets.find(e => e.id === this.createRefValueId(id, refVal.id))
      //   refValDs.visible = true && options.visible;
      //   refValDs.style.baseColor = refVal.color;
      // })
      this.drawGraph();
    }
  }

  protected onResize(): void { }

  private loadAddedDataset(dataset: HelgolandDataset): void {
    if (dataset instanceof HelgolandTimeseries) {
      let dsEntry = this.datasets.find((e) => e.id === dataset.internalId);
      if (dsEntry === undefined) {
        const options = this.datasetOptions.get(dataset.internalId);
        const style = this.getGraphStyle(options);
        const yaxis = this.getAxisSettings(options);
        const selected = this.selectedDatasetIds.indexOf(dataset.internalId) >= 0;
        const description: DatasetDescription = {
          categoryLabel: dataset.parameters.category.label,
          phenomenonLabel: dataset.parameters.phenomenon.label,
          platformLabel: dataset.platform.label,
          procedureLabel: dataset.parameters.procedure.label,
          uom: dataset.uom,
          firstValue: dataset.firstValue,
          lastValue: dataset.lastValue
        }
        dsEntry = new DatasetEntry(dataset.internalId, style, yaxis, options.visible, selected, description);
        this.datasets.push(dsEntry);
      }
      this.datasetMap.set(dataset.internalId, dataset);
      this.loadDatasetData(dataset.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private loadDatasetData(id: string) {
    const datasetOptions = this.datasetOptions.get(id);
    const dataset = this.datasetMap.get(id);
    const dsEntry = this.datasets.find((e) => e.id === dataset.internalId);
    if (this.timespan) {
      dsEntry.dataLoading = true;
      this.informDatasetLoading(this.getLoadedDatasets());
      if (this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareData(dsEntry, new HelgolandTimeseriesData([]));
        this.onCompleteLoadingData(dsEntry);
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, this.presenterOptions.timespanBufferFactor, duration(1, 'day').asMilliseconds());
        this.onContentLoading.emit(true);
        // if (this.runningDataRequests.has(dataset.internalId)) {
        //   this.runningDataRequests.get(dataset.internalId).unsubscribe();
        //   this.onCompleteLoadingData(dataset);
        // }
        const request = this.servicesConnector.getDatasetData(dataset, buffer, {
          expanded: this.presenterOptions.showReferenceValues || this.presenterOptions.requestBeforeAfterValues,
          generalize: this.presenterOptions.generalizeAllways || datasetOptions.generalize
        }).subscribe(
          (result) => {
            this.prepareData(dsEntry, result);
            this.onCompleteLoadingData(dsEntry);
          },
          (error) => {
            this.errorHandler.handleDataLoadError(error, dataset);
            this.onCompleteLoadingData(dsEntry);
          }
        );
        // if (!request.closed) {
        //   this.runningDataRequests.set(dataset.internalId, request);
        // }
      }
    }
  }

  private onCompleteLoadingData(dataset: DatasetEntry): void {
    // this.runningDataRequests.delete(dataset.internalId);
    dataset.dataLoading = false;
    const loadedIds = this.getLoadedDatasets();
    this.informDatasetLoading(loadedIds);
    if (loadedIds.length === 0) { this.onContentLoading.emit(false); }
  }

  private getLoadedDatasets(): string[] {
    return this.datasets.filter(e => e.dataLoading).map(e => e.id);
  }

  private informDatasetLoading(ids: string[]) {
    this.dataLoaded.emit(new Set(ids));
  }

  public updateTimespan(timespan: Timespan) {
    this.onTimespanChanged.emit(timespan);
  }

  public datasetSelected(selectedIds: string[]) {
    this.onDatasetSelected.emit(selectedIds);
  }

  private prepareData(dsEntry: DatasetEntry, rawdata: HelgolandTimeseriesData): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      const datasetIdx = this.datasets.findIndex((e) => e.id === dsEntry.id);
      const options = this.datasetOptions.get(dsEntry.id);

      // sum values for bar chart visualization
      if (options.type === 'bar') {
        const startOf = options.barStartOf as unitOfTime.StartOf;
        const period = duration(options.barPeriod);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dsEntry.id} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map(e => ({ timestamp: e[0], value: e[1] }));

      dsEntry.setData(data);

      // this.addReferenceValueDatasets(dataset, options, rawdata);
    }
  }

  private addReferenceValueDatasets(dataset: HelgolandTimeseries, options: DatasetOptions, rawdata: HelgolandTimeseriesData) {
    if (dataset.referenceValues && dataset.referenceValues.length) {
      dataset.referenceValues.forEach(refVal => {
        const refConf = options.showReferenceValues.find(e => e.id === refVal.referenceValueId);
        // const refValDataset: GraphDataset = {
        //   id: this.createRefValueId(dataset.internalId, refVal.referenceValueId),
        //   yaxis: new AxisSettings(dataset.uom, false),
        //   selected: false,
        //   visible: refConf && options.visible ? true : false,
        //   style: new LineStyle(refConf ? refConf.color : ''),
        //   data: this.createReferenceValueData(rawdata, refVal.referenceValueId),
        //   loading: false
        // };
        // const refValIdx = this.graphDatasets.findIndex((e) => e.id === refValDataset.id);
        // if (refValIdx >= 0) {
        //   this.graphDatasets[refValIdx] = refValDataset;
        // } else {
        //   this.graphDatasets.push(refValDataset);
        // }
      });
    }
  }

  private createRefValueId(dsId: string, refValId: string): string {
    return dsId + 'ref' + refValId;
  }

  private createReferenceValueData(data: Data<TimeValueTuple>, refId: string): { timestamp: number; value: number; }[] {
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

  private getGraphStyle(options: DatasetOptions): DatasetStyle {
    const color = options.color ? options.color : this.colorService.getColor();
    return this.graphHelper.convertDatasetOptions(options);
  }

  private getAxisSettings(options: DatasetOptions): AxisSettings {
    return new AxisSettings(true, options.separateYAxis, options.zeroBasedYAxis, options.autoRangeSelection, options.yAxisRange);
  }

  private drawGraph() {
    if (this.d3Graph) {
      this.d3Graph.redrawCompleteGraph();
    }
  }

}
