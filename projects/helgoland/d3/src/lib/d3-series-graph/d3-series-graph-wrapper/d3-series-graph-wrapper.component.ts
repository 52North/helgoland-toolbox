import { Component, Input, IterableDiffers, OnChanges, Optional, SimpleChanges, ViewChild } from '@angular/core';
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
import { D3PlotOptions, HoveringStyle } from '../../model/d3-plot-options';
import {
  BarStyle,
  D3SeriesGraphComponent,
  D3SeriesGraphOptions,
  DatasetStyle,
  GraphDataset,
} from '../d3-series-graph.component';
import { AxisSettings, LineStyle } from './../d3-series-graph.component';

interface DatasetEntry extends HelgolandTimeseries {
  dataLoading?: boolean;
}

@Component({
  selector: 'n52-d3-series-graph-wrapper',
  templateUrl: './d3-series-graph-wrapper.component.html',
  styleUrls: ['./d3-series-graph-wrapper.component.scss']
})
export class D3SeriesGraphWrapperComponent extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions> implements OnChanges {

  @Input() public yaxisModifier: boolean;

  public graphDatasets: GraphDataset[] = [];
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

  protected datasetMap: Map<string, DatasetEntry> = new Map();

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected servicesConnector: HelgolandServicesConnector,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected translateService: TranslateService,
    protected timezoneSrvc: TimezoneService,
    protected sumValues: SumValuesService,
    protected colorService: ColorService,
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
    dataset.referenceValues.forEach(refVal => {
      const refValIdx = this.graphDatasets.findIndex(e => e.id === this.createRefValueId(id, refVal.referenceValueId));
      if (refValIdx >= 0) {
        this.graphDatasets.splice(refValIdx, 1);
      }  
    })
    // now delete dataset
    this.datasetMap.delete(id);
    const spliceIdx = this.graphDatasets.findIndex((e) => e.id === id);
    if (spliceIdx >= 0) {
      this.graphDatasets.splice(spliceIdx, 1);
    }
  }

  protected setSelectedId(id: string): void {
    const dataset = this.graphDatasets.find((e) => e.id === id);
    if (dataset) {
      dataset.selected = true;
    }
    this.drawGraph();
  }

  protected removeSelectedId(id: string): void {
    const dataset = this.graphDatasets.find((e) => e.id === id);
    if (dataset) {
      dataset.selected = false;
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
      const dataset = this.graphDatasets.find((e) => e.id === id);
      dataset.yaxis = this.getAxisSettings(dataset.yaxis.label, options);
      dataset.style = this.getGraphStyle(options);
      dataset.visible = options.visible;
      this.graphDatasets.forEach(e => {
        if (e.id.startsWith(id+'ref')) {
          e.visible = false;
        }
      })
      options.showReferenceValues.forEach(refVal => {
        const refValDs = this.graphDatasets.find(e => e.id === this.createRefValueId(id, refVal.id))
        refValDs.visible = true && options.visible;
        refValDs.style.baseColor = refVal.color;
      })
      this.drawGraph();
    }
  }

  protected onResize(): void { }

  private loadAddedDataset(dataset: HelgolandDataset): void {
    if (dataset instanceof HelgolandTimeseries) {
      this.datasetMap.set(dataset.internalId, dataset);
      this.loadDatasetData(dataset.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private loadDatasetData(id: string) {
    const datasetOptions = this.datasetOptions.get(id);
    const dataset = this.datasetMap.get(id);
    if (this.timespan) {
      if (this.presenterOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareData(dataset, new HelgolandTimeseriesData([]));
        this.onCompleteLoadingData(dataset);
      } else {
        const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, this.presenterOptions.timespanBufferFactor, duration(1, 'day').asMilliseconds());
        this.onContentLoading.emit(true);
        dataset.dataLoading = true;
        this.informDatasetLoading(this.getLoadedDatasets());
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

  private onCompleteLoadingData(dataset: DatasetEntry): void {
    dataset.dataLoading = false;
    // this.runningDataRequests.delete(dataset.internalId);
    const loadedIds = this.getLoadedDatasets();
    this.informDatasetLoading(loadedIds);
    if (loadedIds.length === 0) { this.onContentLoading.emit(false); }
  }

  private getLoadedDatasets(): string[] {
    const loadedIds = [];
    this.datasetMap.forEach((ds, id) => {
      if (ds.dataLoading) {
        loadedIds.push(id);
      }
    });
    return loadedIds;
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

  private prepareData(dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      const datasetIdx = this.graphDatasets.findIndex((e) => e.id === dataset.internalId);
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

      const graphDataset: GraphDataset = {
        id: dataset.internalId,
        yaxis: this.getAxisSettings(dataset.uom, options),
        selected: this.selectedDatasetIds.indexOf(dataset.internalId) >= 0,
        visible: options.visible,
        style: this.getGraphStyle(options),
        data
      }

      if (datasetIdx >= 0) {
        this.graphDatasets[datasetIdx] = graphDataset;
      } else {
        this.graphDatasets.push(graphDataset);
      }

      this.addReferenceValueDatasets(dataset, options, rawdata);
    }
  }

  private addReferenceValueDatasets(dataset: HelgolandTimeseries, options: DatasetOptions, rawdata: HelgolandTimeseriesData) {
    if (dataset.referenceValues && dataset.referenceValues.length) {
      dataset.referenceValues.forEach(refVal => {
        const refConf = options.showReferenceValues.find(e => e.id === refVal.referenceValueId);
        const refValDataset: GraphDataset = {
          id: this.createRefValueId(dataset.internalId, refVal.referenceValueId),
          yaxis: new AxisSettings(dataset.uom, false),
          selected: false,
          visible: refConf && options.visible ? true : false,
          style: new LineStyle(refConf ? refConf.color : ''),
          data: this.createReferenceValueData(rawdata, refVal.referenceValueId)
        };
        const refValIdx = this.graphDatasets.findIndex((e) => e.id === refValDataset.id);
        if (refValIdx >= 0) {
          this.graphDatasets[refValIdx] = refValDataset;
        } else {
          this.graphDatasets.push(refValDataset);
        }
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
    if (options.type === 'line') {
      return new LineStyle(color, options.pointRadius, options.lineWidth, options.pointSymbol, options.lineDashArray);
    }
    if (options.type === 'bar') {
      const startOf = options.barStartOf as unitOfTime.StartOf;
      const period = duration(options.barPeriod);
      return new BarStyle(color, startOf, period, options.lineWidth, options.lineDashArray);
    }
  }

  private getAxisSettings(uom: string, options: DatasetOptions): AxisSettings {
    return new AxisSettings(uom, true, options.separateYAxis, options.zeroBasedYAxis, options.autoRangeSelection, options.yAxisRange);
  }

  private drawGraph() {
    if (this.d3Graph) {
      this.d3Graph.redrawCompleteGraph();
    }
  }

}
