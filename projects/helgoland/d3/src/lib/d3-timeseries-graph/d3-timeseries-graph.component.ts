import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  IterableDiffers,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  ColorService,
  Data,
  DatasetOptions,
  DatasetPresenterComponent,
  DatasetType,
  filterUndefined,
  HelgolandDataset,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  InternalIdHandler,
  Required,
  SumValuesService,
  Time,
  Timespan,
  TimeValueTuple,
  TimezoneService,
} from "@helgoland/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import * as d3 from "d3";
import moment, { unitOfTime } from "moment";
import { Subscription } from "rxjs";

import { D3AssistantService, EmptyAssistantService } from "../helper/d3-assistant.service";
import { D3GraphHelperService } from "../helper/d3-graph-helper.service";
import { D3PointSymbolDrawerService } from "../helper/d3-point-symbol-drawer.service";
import { D3TimeFormatLocaleService } from "../helper/d3-time-format-locale.service";
import { D3DataGeneralizer } from "../helper/generalizing/d3-data-generalizer";
import { D3HoveringService } from "../helper/hovering/d3-hovering-service";
import { D3SimpleHoveringService } from "../helper/hovering/d3-simple-hovering.service";
import { DataConst, DataEntry, InternalDataEntry, YAxis, YAxisSettings } from "../model/d3-general";
import { HighlightOutput } from "../model/d3-highlight";
import { D3PlotOptions, HoveringStyle } from "../model/d3-plot-options";
import { D3GraphId } from "./../helper/d3-graph-id.service";
import { D3Graphs } from "./../helper/d3-graphs.service";
import { D3DataSimpleGeneralizer } from "./../helper/generalizing/d3-data-simple-generalizer.service";
import { RangeCalculationsService } from "./../helper/range-calculations.service";
import { D3GraphCopyrightComponent } from "./controls/d3-graph-copyright/d3-graph-copyright.component";
import { D3GraphHoverLineComponent } from "./controls/d3-graph-hover-line/d3-graph-hover-line.component";
import { D3GraphHoverPointComponent } from "./controls/d3-graph-hover-point/d3-graph-hover-point.component";
import {
  D3GraphOverviewSelectionComponent,
} from "./controls/d3-graph-overview-selection/d3-graph-overview-selection.component";
import {
  D3GraphPanZoomInteractionComponent,
} from "./controls/d3-graph-pan-zoom-interaction/d3-graph-pan-zoom-interaction.component";
import { D3GraphExtent, D3GraphObserver } from "./d3-timeseries-graph-control";
import {
  D3TimeseriesGraphErrorHandler,
  D3TimeseriesSimpleGraphErrorHandler,
} from "./d3-timeseries-graph-error-handler.service";
import { D3TimeseriesGraphInterface } from "./d3-timeseries-graph.interface";


interface HighlightDataset {
  id: string;
  change: boolean;
}

const TICKS_COUNT_YAXIS = 5;

@Component({
  selector: "n52-d3-timeseries-graph",
  templateUrl: "./d3-timeseries-graph.component.html",
  styleUrls: ["./d3-timeseries-graph.component.scss"],
  providers: [D3GraphId],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [D3GraphPanZoomInteractionComponent, D3GraphCopyrightComponent, D3GraphHoverLineComponent, D3GraphHoverPointComponent, D3GraphOverviewSelectionComponent]
})
export class D3TimeseriesGraphComponent
  extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions>
  implements AfterViewInit, OnDestroy, D3TimeseriesGraphInterface {

  @Input()
  @Required
  // difference to timespan/timeInterval --> if brush, then this is the timespan of the main-diagram
  public mainTimeInterval!: Timespan;

  @Input()
  public yaxisModifier: boolean = false;

  @Input() public hoveringService: D3HoveringService = new D3SimpleHoveringService(this.timezoneSrvc, this.pointSymbolDrawer);

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onClickDataPoint: EventEmitter<{ timeseries: HelgolandTimeseries, data: HelgolandTimeseriesData }> = new EventEmitter();

  @ViewChild("d3timeseries", { static: true })
  public d3Elem: ElementRef | undefined;

  // DOM elements
  protected rawSvg!: d3.Selection<SVGSVGElement, any, any, any>;
  protected graph!: d3.Selection<SVGGElement, any, any, any>;
  protected graphBody: any;
  private graphInteraction!: d3.Selection<SVGSVGElement, any, any, any>;
  private background!: d3.Selection<SVGSVGElement, any, any, any>;

  // data types
  protected preparedData: InternalDataEntry[] = [];
  protected preparedAxes: Map<string, YAxisSettings> = new Map();
  protected datasetMap: Map<string, DataConst> = new Map();
  protected listOfUoms: string[] = [];
  /** calculated y axes for the diagram */
  private yAxes: YAxis[] = [];
  private listOfSeparation = Array();

  private xScaleBase: d3.ScaleTime<number, number> | undefined; // calculate diagram coord of x value
  private yScaleBase: d3.ScaleLinear<number, number> | undefined; // calculate diagram coord of y value
  private leftOffset: number = 0;

  private height: number = 0;
  private width: number = 0;
  private margin = {
    top: 10,
    right: 0,
    bottom: 45,
    left: 40
  };
  private maxLabelwidth = 0;
  private addLineWidth = 2; // value added to linewidth
  private loadingData: Set<string> = new Set();
  private graphId = this.uuidv4();

  private observer: Set<D3GraphObserver> = new Set();

  private runningDataRequests: Map<string, Subscription> = new Map();

  // default plot options
  public plotOptions: D3PlotOptions = {
    showReferenceValues: false,
    generalizeAllways: true,
    togglePanZoom: true,
    hoverable: true,
    hoverStyle: HoveringStyle.point,
    grid: true,
    yaxis: true,
    overview: false,
    showTimeLabel: true,
    timeRangeLabel: {
      show: false
    },
    requestBeforeAfterValues: false,
    timespanBufferFactor: 0.2,
    sendDataRequestOnlyIfDatasetTimespanCovered: true
  };

  private resizeObserver: ResizeObserver | undefined;

  constructor(
    protected override iterableDiffers: IterableDiffers,
    protected override datasetIdResolver: InternalIdHandler,
    protected override timeSrvc: Time,
    protected timeFormatLocaleService: D3TimeFormatLocaleService,
    protected colorService: ColorService,
    protected override translateService: TranslateService,
    protected override timezoneSrvc: TimezoneService,
    protected sumValues: SumValuesService,
    protected rangeCalc: RangeCalculationsService,
    protected graphHelper: D3GraphHelperService,
    protected graphService: D3Graphs,
    protected graphIdService: D3GraphId,
    protected override servicesConnector: HelgolandServicesConnector,
    protected pointSymbolDrawer: D3PointSymbolDrawerService,
    protected zone: NgZone,
    @Optional() protected errorHandler: D3TimeseriesGraphErrorHandler = new D3TimeseriesSimpleGraphErrorHandler(),
    @Optional() protected generalizer: D3DataGeneralizer = new D3DataSimpleGeneralizer(),
    @Optional() protected yAxisLabelSrvc: D3AssistantService = new EmptyAssistantService(),
  ) {
    super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateService, timezoneSrvc);
  }

  public ngAfterViewInit(): void {

    this.graphIdService.setId(this.graphId);
    this.graphService.setGraph(this.graphId, this);

    this.rawSvg = d3.select<SVGSVGElement, any>(this.d3Elem?.nativeElement)
      .append<SVGSVGElement>("svg")
      .style("width", "100%")
      .style("height", "100%")
      .style("position", "absolute");

    this.graph = this.rawSvg
      .append<SVGGElement>("g")
      .attr("id", `graph-${this.graphId}`)
      .attr("transform", "translate(" + (this.margin.left + this.maxLabelwidth) + "," + this.margin.top + ")");

    this.graphInteraction = this.rawSvg
      .append<SVGSVGElement>("g")
      .attr("id", `interaction-layer-${this.graphId}`)
      .attr("transform", "translate(" + (this.margin.left + this.maxLabelwidth) + "," + this.margin.top + ")");

    this.addResizeObserver();
  }

  private addResizeObserver() {
    this.resizeObserver = new ResizeObserver(entries => this.zone.run(() => this.redrawCompleteGraph()));
    this.resizeObserver.observe(this.d3Elem?.nativeElement);
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
    this.resizeObserver?.unobserve(this.d3Elem?.nativeElement);
    this.graphService.removeGraph(this.graphId);
  }

  public registerObserver(obs: D3GraphObserver) {
    this.observer.add(obs);
  }

  public unregisterObserver(obs: D3GraphObserver) {
    this.observer.delete(obs);
  }

  public getGraphElem() {
    return this.graph;
  }

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void {
    this.redrawCompleteGraph();
  }

  protected onTimezoneChanged(): void {
    this.redrawCompleteGraph();
  }

  public reloadDataForDatasets(datasetIds: string[]): void {
    datasetIds.forEach(id => {
      const dataset = this.datasetMap.get(id);
      dataset && this.loadDatasetData(dataset, true);
    });
  }

  protected addDataset(id: string, url: string): void {
    this.servicesConnector.getDataset({ id, url }, { locale: this.translateService.currentLang, type: DatasetType.Timeseries }).subscribe(
      res => this.loadAddedDataset(res),
      error => this.errorHandler.handleDatasetLoadError(error)
    );
  }

  protected removeDataset(internalId: string): void {
    this.datasetMap.delete(internalId);
    this.preparedAxes.delete(internalId);
    const spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
    if (spliceIdx >= 0) {
      this.preparedData.splice(spliceIdx, 1);
      if (this.preparedData.length <= 0) {
      } else {
        this.preparedData.forEach((entry) => this.processData(entry));
      }
      this.redrawCompleteGraph();
    }
  }

  protected setSelectedId(internalId: string): void {
    const internalEntry = this.preparedData.find((e) => e.internalId === internalId);
    if (internalEntry) { internalEntry.selected = true; }
    this.redrawCompleteGraph();
  }

  protected removeSelectedId(internalId: string): void {
    const internalEntry = this.preparedData.find((e) => e.internalId === internalId);
    if (internalEntry) { internalEntry.selected = false; }
    this.redrawCompleteGraph();
  }

  protected presenterOptionsChanged(options: D3PlotOptions): void {
    if (this.plotOptions.hoverStyle !== HoveringStyle.point && options.hoverStyle === HoveringStyle.point) {
      d3.select("g.d3line").attr("visibility", "visible");
    }
    Object.assign(this.plotOptions, options);
    this.redrawCompleteGraph();
  }

  protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
    const dataset = this.datasetMap.get(internalId);
    if (!firstChange && dataset) {
      this.loadDatasetData(dataset, false);
    }
  }

  protected timeIntervalChanges(): void {
    this.datasetMap.forEach((dataset) => this.loadDatasetData(dataset, false));
  }

  protected onResize(): void {
  }

  public centerTime(timestamp: number): void {
    if (this.timespan) {
      const centeredTimespan = this.timeSrvc.centerTimespan(this.timespan, new Date(timestamp));
      this.onTimespanChanged.emit(centeredTimespan);
    }
  }

  public changeTime(from: number, to: number): void {
    this.onTimespanChanged.emit(new Timespan(from, to));
  }

  public getDataset(internalId: string): DataConst | undefined {
    return this.datasetMap.get(internalId);
  }

  private loadAddedDataset(dataset: HelgolandDataset): void {
    if (dataset instanceof HelgolandTimeseries) {
      this.datasetMap.set(dataset.internalId, dataset);
      this.loadDatasetData(dataset, false);
    } else {
      console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  // load data of dataset
  private loadDatasetData(dataset: HelgolandTimeseries, force: boolean): void {
    const datasetOptions = this.datasetOptions?.get(dataset.internalId);

    if (this.timespan && datasetOptions) {
      if (this.plotOptions.sendDataRequestOnlyIfDatasetTimespanCovered
        && dataset.firstValue
        && dataset.lastValue
        && !this.timeSrvc.overlaps(this.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
        this.prepareData(dataset, new HelgolandTimeseriesData([]));
        this.onCompleteLoadingData(dataset);
      } else {
        if (this.loadingData.size === 0) { this.onContentLoading.emit(true); }
        const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, this.plotOptions.timespanBufferFactor!, moment.duration(1, "day").asMilliseconds());
        this.loadingData.add(dataset.internalId);
        this.dataLoaded.emit(this.loadingData);
        const runningRequest = this.runningDataRequests.get(dataset.internalId);
        if (runningRequest) {
          runningRequest.unsubscribe();
          this.onCompleteLoadingData(dataset);
        }
        const request = this.servicesConnector.getDatasetData(dataset, buffer, {
          expanded: this.plotOptions.showReferenceValues || this.plotOptions.requestBeforeAfterValues,
          generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
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
        if (!request.closed) {
          this.runningDataRequests.set(dataset.internalId, request);
        }
      }
    } else {
      this.graphIdService.getId().subscribe(id => console.warn(`No timespan is configured for graph with ID: ${id}`));
    }
  }

  private onCompleteLoadingData(dataset: HelgolandTimeseries): void {
    this.runningDataRequests.delete(dataset.internalId);
    this.loadingData.delete(dataset.internalId);
    this.dataLoaded.emit(this.loadingData);
    if (this.loadingData.size === 0) { this.onContentLoading.emit(false); }
  }

  /**
   * Function to prepare each dataset for the graph and adding it to an array of datasets.
   * @param dataset {IDataset} Object of the whole dataset
   */
  private prepareData(dataset: HelgolandTimeseries, rawdata: HelgolandTimeseriesData): void {
    const options = this.datasetOptions?.get(dataset.internalId);
    const constellation = this.datasetMap.get(dataset.internalId);

    if (rawdata instanceof HelgolandTimeseriesData && options && constellation && this.timespan) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
      if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

      const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan);

      constellation.data = data;
      const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);

      let barConfig: { startOf: unitOfTime.StartOf; period: moment.Duration; } | undefined = undefined;
      // sum values for bar chart visualization
      if (options.type === "bar") {
        barConfig = {
          startOf: options.barStartOf as unitOfTime.StartOf,
          period: moment.duration(options.barPeriod)
        };
        if (barConfig.period.asMilliseconds() === 0) {
          throw new Error(`${dataset.internalId} needs a valid barPeriod`);
        }
        data.values = this.sumValues.sum(barConfig.startOf, barConfig.period, data.values);
      }

      // generate random color, if color is not defined
      if (options.color === undefined) {
        options.color = this.colorService.getColor();
      }

      // end of check for datasets
      const dataEntry: InternalDataEntry = {
        internalId: dataset.internalId,
        hoverId: `hov-${(datasetIdx >= 0 ? datasetIdx : this.preparedData.length)}`,
        options,
        selected: this.selectedDatasetIds.indexOf(dataset.internalId) >= 0,
        data: options.visible ? data.values.map(d => ({ timestamp: d[0], value: d[1] })) : [],
        axisOptions: {
          uom: dataset.uom,
          label: dataset.label,
          zeroBased: options.zeroBasedYAxis,
          yAxisRange: options.yAxisRange,
          autoRangeSelection: options.autoRangeSelection,
          separateYAxis: options.separateYAxis,
          parameters: {
            feature: dataset.parameters.feature,
            phenomenon: dataset.parameters.phenomenon,
            offering: dataset.parameters.offering
          }
        },
        referenceValueData: [],
        visible: options.visible,
        bar: barConfig
      };

      const separationIdx: number = this.listOfSeparation.findIndex((id) => id === dataset.internalId);
      if (options.separateYAxis) {
        if (separationIdx < 0) {
          this.listOfSeparation.push(dataset.internalId);
        }
      } else {
        this.listOfSeparation = this.listOfSeparation.filter(entry => entry !== dataset.internalId);
      }

      if (datasetIdx >= 0) {
        this.preparedData[datasetIdx] = dataEntry;
      } else {
        this.preparedData.push(dataEntry);
      }
      this.addReferenceValueData(dataEntry, options, data, dataset.uom);
      this.processData(dataEntry);
      this.redrawCompleteGraph();
    }

  }

  /**
   * Function to add referencevaluedata to the dataset (e.g. mean).
   * @param internalId {String} String with the id of a dataset
   * @param styles {DatasetOptions} Object containing information for dataset styling
   * @param data {Data} Array of Arrays containing the measurement-data of the dataset
   * @param uom {String} String with the uom of a dataset
   */
  private addReferenceValueData(dataEntry: InternalDataEntry, styles: DatasetOptions, data: Data<TimeValueTuple>, uom: string): void {
    if (this.plotOptions.showReferenceValues && dataEntry.visible) {
      dataEntry.referenceValueData = styles.showReferenceValues
        .filter(refValue => data.referenceValues && data.referenceValues[refValue.id])
        .map((refValue) => ({
          id: refValue.id,
          color: refValue.color,
          data: this.createReferenceValueData(data, refValue.id)
        }));
    }
  }

  // adjust reference values with new structure to old one
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
    return refValues.map((d: number[]) => ({ timestamp: d[0], value: d[1] }));
  }

  /**
   * Function that processes the data to calculate y axis range of each dataset.
   * @param entry {DataEntry} Object containing dataset related data.
   */
  protected processData(entry: InternalDataEntry): void {
    let visualMin: number | undefined = undefined;
    let visualMax: number | undefined = undefined;
    let fixedMin = false;
    let fixedMax = false;

    // set out of yAxisRange
    if (entry.axisOptions.yAxisRange?.min && entry.axisOptions.yAxisRange.max) {

      if (!isNaN(entry.axisOptions.yAxisRange.min)) {
        visualMin = entry.axisOptions.yAxisRange.min;
        fixedMin = true;
      }

      if (!isNaN(entry.axisOptions.yAxisRange.max)) {
        visualMax = entry.axisOptions.yAxisRange.max;
        fixedMax = true;
      }

      if (visualMin && visualMax && visualMin > visualMax) {
        const temp = visualMin;
        visualMin = visualMax;
        visualMax = temp;
      }
    }

    // set variable extend bounds
    if (visualMin === undefined || visualMax === undefined) {
      const baseDataExtent = d3.extent<DataEntry, number>(entry.data, (d) => {
        // if (typeof d.value === 'number') {
        if (!isNaN(d.value)) {
          // with timespan restriction, it only selects values inside the selected timespan
          // if (this.timespan.from <= d.timestamp && this.timespan.to >= d.timestamp) { return d.value; }
          return d.value;
        } else {
          return null;
        }
      });

      const dataExtentRafValues = entry.referenceValueData.map(e => d3.extent<DataEntry, number>(e.data, (d) => (typeof d.value === "number") ? d.value : null));

      if (visualMin === undefined) {
        visualMin = d3.min(filterUndefined([baseDataExtent[0], ...dataExtentRafValues.map(e => e[0])]));
      }

      if (visualMax === undefined) {
        visualMax = d3.max(filterUndefined([baseDataExtent[1], ...dataExtentRafValues.map(e => e[1])]));
      }
    }

    // set out of zeroBasedAxis
    if (entry.axisOptions.zeroBased && visualMin && visualMin > 0) {
      visualMin = 0;
    }
    if (entry.axisOptions.zeroBased && visualMax && visualMax < 0) {
      visualMax = 0;
    }

    this.preparedAxes.set(entry.internalId, {
      visualMin: visualMin!,
      visualMax: visualMax!,
      fixedMin,
      fixedMax,
      entry
    });
  }

  /**
   * Function that returns the height of the graph diagram.
   */
  private calculateHeight(): number {
    return (this.d3Elem?.nativeElement as HTMLElement).clientHeight
      - this.margin.top
      - this.margin.bottom
      + (this.plotOptions.showTimeLabel || (this.plotOptions.timeRangeLabel && this.plotOptions.timeRangeLabel.show) ? 0 : 20);
  }

  /**
   * Function that returns the width of the graph diagram.
   */
  private calculateWidth(): number {
    return (this.rawSvg.node()?.width.baseVal.value || 100) - this.margin.left - this.margin.right - this.maxLabelwidth;
  }

  /**
   * Just sets the timespan, which is used for the diagram visualisation
   */
  public setTimespan(timespan: Timespan) {
    this.timespan = timespan;
  }

  public drawBaseGraph(): void {
    this.drawYGridLines();
    this.drawXaxis(this.leftOffset);
    this.drawAllCharts();
  }

  private drawYGridLines() {
    this.graph.selectAll(".grid.y-grid").remove();
    if (this.plotOptions.grid) {
      const idx = this.yAxes.reverse().findIndex(yAxe => yAxe.ids.find(id => this.datasetOptions?.get(id)?.visible));
      if (idx >= 0 && this.yAxes[idx] && this.yAxes[idx].yScale) {
        this.graph.append("svg:g")
          .attr("class", "grid y-grid")
          .attr("transform", "translate(" + this.leftOffset + ", 0)")
          .call(d3.axisLeft(this.yAxes[idx].yScale!)
            .ticks(TICKS_COUNT_YAXIS)
            .tickSize(-this.width + this.leftOffset)
            .tickFormat(() => "") as any);
      }
    }
  }

  public getDrawingLayer(id: string, front?: boolean): d3.Selection<SVGGElement, any, any, any> {
    return this.rawSvg
      .insert("g", !front ? `#interaction-layer-${this.graphId}` : undefined)
      .attr("id", id)
      .attr("transform", "translate(" + (this.margin.left + this.maxLabelwidth) + "," + this.margin.top + ")");
  }

  /**
   * Function to plot the whole graph and its dependencies
   * (graph line, graph axes, event handlers)
   */
  public redrawCompleteGraph(): void {
    if (this.isNotDrawable()) { return; }

    this.preparedData.forEach((entry) => {
      const idx: number = this.listOfUoms.findIndex((uom) => uom === entry.axisOptions.uom);
      if (idx < 0) { this.listOfUoms.push(entry.axisOptions.uom); }
    });

    this.height = this.calculateHeight();
    this.width = this.calculateWidth() - 20; // add buffer to the left to garantee visualization of last date (tick x-axis)
    this.graph.selectAll("*").remove();
    this.graphInteraction.selectAll("*").remove();
    this.observer.forEach(e => e.cleanUp && e.cleanUp());

    this.leftOffset = 0;
    this.yScaleBase = undefined;

    // reset y axes
    this.yAxes = [];
    this.prepareYAxes();

    this.yAxes.forEach(axis => {
      axis.first = (this.yScaleBase === undefined);
      axis.offset = this.leftOffset;

      const yAxisResult = this.drawYaxis(axis);
      if (this.yScaleBase === undefined) {
        this.yScaleBase = yAxisResult.yScale;
        this.leftOffset = yAxisResult.buffer;
      } else {
        this.leftOffset = yAxisResult.buffer;
      }
      axis.yScale = yAxisResult.yScale;
    });

    // cancel drawing, without enough space
    if ((this.width - this.leftOffset) <= 0 || this.height <= 0) { return; }

    if (!this.yScaleBase) { return; }

    this.drawBaseGraph();

    this.drawTimeRangeLabels();

    // create background as rectangle providing panning
    this.background = this.graphInteraction.append<SVGSVGElement>("svg:rect")
      .attr("width", this.width - this.leftOffset)
      .attr("height", this.height)
      .attr("id", "backgroundRect")
      .attr("fill", "none")
      .attr("stroke", "none")
      .attr("pointer-events", "all")
      .attr("transform", "translate(" + this.leftOffset + ", 0)");

    this.addTimespanJumpButtons();

    this.background.on("mousemove", (event: MouseEvent) => this.observer.forEach(e => e.mousemoveBackground && e.mousemoveBackground(event)));

    this.background.on("mouseover", (event: MouseEvent) => this.observer.forEach(e => e.mouseoverBackground && e.mouseoverBackground(event)));

    this.background.on("mouseout", (event: MouseEvent) => this.observer.forEach(e => e.mouseoutBackground && e.mouseoutBackground(event)));

    if (this.plotOptions.togglePanZoom === false) {
      const zoomHandler: any = d3.zoom()
        .on("start", (event: MouseEvent) => this.observer.forEach(e => e.zoomStartBackground && e.zoomStartBackground(event)))
        .on("zoom", (event: MouseEvent) => this.observer.forEach(e => e.zoomMoveBackground && e.zoomMoveBackground(event)))
        .on("end", (event: MouseEvent) => this.observer.forEach(e => e.zoomEndBackground && e.zoomEndBackground(event)));
      this.background.call(zoomHandler);
    } else {
      const dragHandler: any = d3.drag()
        .on("start", (event: MouseEvent) => this.observer.forEach(e => e.dragStartBackground && e.dragStartBackground(event)))
        .on("drag", (event: MouseEvent) => this.observer.forEach(e => e.dragMoveBackground && e.dragMoveBackground(event)))
        .on("end", (event: MouseEvent) => this.observer.forEach(e => e.dragEndBackground && e.dragEndBackground(event)));
      this.background.call(dragHandler);
    }

    this.observer.forEach(e => {

      if (e.adjustBackground && this.xScaleBase) {
        const graphExtent: D3GraphExtent = {
          width: this.width,
          height: this.height,
          leftOffset: this.leftOffset,
          margin: this.margin,
          xScale: this.xScaleBase
        };
        e.adjustBackground(this.background, graphExtent, this.preparedData, this.graph, this.timespan!);
      }
    });
    this.drawBackground();
  }

  protected drawTimeRangeLabels() {
    if (this.plotOptions.timeRangeLabel && this.plotOptions.timeRangeLabel.show && this.timespan) {
      this.graph.append("text")
        .attr("class", "x axis time-range from")
        .attr("x", this.leftOffset)
        .attr("y", this.height + this.margin.bottom - 5)
        .style("text-anchor", "start")
        .text(this.timezoneSrvc.formatTzDate(this.timespan.from, this.plotOptions.timeRangeLabel.format));
      this.graph.append("text")
        .attr("class", "x axis time-range to")
        .attr("x", this.width)
        .attr("y", this.height + this.margin.bottom - 5)
        .style("text-anchor", "end")
        .text(this.timezoneSrvc.formatTzDate(this.timespan.to, this.plotOptions.timeRangeLabel.format));
    }
  }

  private isNotDrawable() {
    try {
      return this.rawSvg.node()?.width.baseVal.value === undefined
        || this.rawSvg.node()?.width.baseVal.value === 0
        || this.rawSvg.node()?.height.baseVal.value === undefined
        || this.rawSvg.node()?.height.baseVal.value === 0
        || !this.graph
        || !this.rawSvg
        || !this.datasetIds;
    } catch (error) {
      return true;
    }
  }

  protected prepareYAxes() {
    this.datasetIds.forEach(key => this.createYAxisForId(key));
  }

  protected createYAxisForId(id: string) {
    const axisSettings = this.preparedAxes.get(id);
    if (axisSettings) {
      if (axisSettings.entry.options.separateYAxis) {
        // create sepearte axis
        this.yAxes.push({
          uom: axisSettings.entry.axisOptions.uom,
          range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
          fixedMin: axisSettings.fixedMin,
          fixedMax: axisSettings.fixedMax,
          selected: !!axisSettings.entry.selected,
          seperate: true,
          ids: [id],
          label: axisSettings.entry.axisOptions.parameters?.feature?.label
        });
      } else {
        // find matching axis or add new
        const axis = this.yAxes.find(e => e.uom.includes(axisSettings.entry.axisOptions.uom) && !e.seperate);
        if (axis) {
          // add id to axis
          axis.ids.push(id);
          // update range for axis
          if (!axis.fixedMin && axis.range.min !== undefined) {
            axis.range.min = d3.min([axis.range.min, axisSettings.visualMin]);
          }
          if (!axis.fixedMax && axis.range.max !== undefined) {
            axis.range.max = d3.max([axis.range.max, axisSettings.visualMax]);
          }
          axis.fixedMin = axis.fixedMin || axisSettings.fixedMin;
          axis.fixedMax = axis.fixedMax || axisSettings.fixedMax;
          // update selection
          if (axis.selected) {
            axis.selected = !!axisSettings.entry.selected;
          }
        } else {
          this.yAxes.push({
            uom: axisSettings.entry.axisOptions.uom,
            range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
            fixedMin: axisSettings.fixedMin,
            fixedMax: axisSettings.fixedMax,
            seperate: false,
            selected: !!axisSettings.entry.selected,
            ids: [id]
          });
        }
      }
    }
  }

  private addTimespanJumpButtons(): void {
    let dataVisible = false;
    let formerTimestamp: number | undefined = undefined;
    let laterTimestamp: number | undefined = undefined;
    if (this.plotOptions.requestBeforeAfterValues && this.timespan) {
      this.preparedData.forEach((entry: InternalDataEntry) => {
        const firstIdxInTimespan = entry.data.findIndex(e => (this.timespan!.from < e.timestamp && this.timespan!.to > e.timestamp) && typeof e.value === "number");
        if (firstIdxInTimespan < 0) {
          const lastIdxInTimespan = entry.data.findIndex(e => (e.timestamp > this.timespan!.from && e.timestamp > this.timespan!.to) && typeof e.value === "number");
          if (lastIdxInTimespan >= 0) {
            laterTimestamp = entry.data[entry.data.length - 1].timestamp;
          }
          const idx = entry.data.findIndex(e => (e.timestamp < this.timespan!.from && e.timestamp < this.timespan!.to) && typeof e.value === "number");
          if (idx >= 0) {
            formerTimestamp = entry.data[entry.data.length - 1].timestamp;
          }
        } else {
          dataVisible = true;
        }
      });
    }
    if (!dataVisible) {
      const buttonWidth = 50;
      const leftRight = 15;
      if (formerTimestamp !== undefined) {
        const g = this.background.append("g");
        g.append("svg:rect")
          .attr("class", "formerButton")
          .attr("width", buttonWidth + "px")
          .attr("height", this.height + "px")
          .attr("transform", "translate(" + this.leftOffset + ", 0)")
          .on("click", () => this.centerTime(formerTimestamp!));
        g.append("line")
          .attr("class", "arrow")
          .attr("x1", 0 + this.leftOffset + leftRight + "px")
          .attr("y1", this.height / 2 + "px")
          .attr("x2", 0 + this.leftOffset + (buttonWidth - leftRight) + "px")
          .attr("y2", this.height / 2 - (buttonWidth - leftRight) / 2 + "px");
        g.append("line")
          .attr("class", "arrow")
          .attr("x1", 0 + this.leftOffset + leftRight + "px")
          .attr("y1", this.height / 2 + "px")
          .attr("x2", 0 + this.leftOffset + (buttonWidth - leftRight) + "px")
          .attr("y2", this.height / 2 + (buttonWidth - leftRight) / 2 + "px");
      }
      if (laterTimestamp !== undefined) {
        const g = this.background.append("g");
        g.append("svg:rect")
          .attr("class", "laterButton")
          .attr("width", "50px")
          .attr("height", this.height)
          .attr("transform", "translate(" + (this.width - 50) + ", 0)")
          .on("click", () => this.centerTime(laterTimestamp!));
        g.append("line")
          .attr("class", "arrow")
          .attr("x1", this.width - leftRight + "px")
          .attr("y1", this.height / 2 + "px")
          .attr("x2", this.width - (buttonWidth - leftRight) + "px")
          .attr("y2", this.height / 2 - (buttonWidth - leftRight) / 2 + "px");
        g.append("line")
          .attr("class", "arrow")
          .attr("x1", this.width - leftRight + "px")
          .attr("y1", this.height / 2 + "px")
          .attr("x2", this.width - (buttonWidth - leftRight) + "px")
          .attr("y2", this.height / 2 + (buttonWidth - leftRight) / 2 + "px");
      }
    }
  }

  /**
   * Draws for every preprared data entry the chart.
   */
  protected drawAllCharts(): void {
    this.graph.selectAll(".diagram-path").remove();
    this.preparedData.forEach((entry) => this.drawChart(entry));
  }

  /**
   * Function that draws the x axis to the svg element.
   * @param bufferXrange {Number} Number with the distance between left edge and the beginning of the graph.
   */
  private drawXaxis(bufferXrange: number): void {
    // range for x axis scale
    this.xScaleBase = d3.scaleTime()
      .domain([new Date(this.timespan!.from), new Date(this.timespan!.to)])
      .range([bufferXrange, this.width]);

    const ticks = this.calcTicks();

    const xAxis = d3.axisBottom(this.xScaleBase)
      .tickFormat(d => this.timeFormatLocaleService.formatTime(d.valueOf()))
      .tickValues(ticks);

    // update x axis
    this.graph.selectAll(".x.axis.bottom").remove();
    this.graph.append("g")
      .attr("class", "x axis bottom")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle");

    // draw x grid lines
    this.graph.selectAll(".grid.x-grid").remove();
    if (this.plotOptions.grid) {
      // draw the x grid lines
      this.graph.append("svg:g")
        .attr("class", "grid x-grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis.tickSize(-this.height).tickFormat(() => "") as any);
    }

    // draw upper axis as border
    this.graph.selectAll(".x.axis.top").remove();
    this.graph.append("svg:g")
      .attr("class", "x axis top")
      .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0) as any);

    // draw right axis as border
    this.graph.selectAll(".y.axis.right").remove();
    if (this.yScaleBase) {
      this.graph.append("svg:g")
        .attr("class", "y axis right")
        .attr("transform", "translate(" + this.width + ",0)")
        .call(d3.axisRight(this.yScaleBase).tickFormat(() => "").tickSize(0) as any);
    }

    // text label for the x axis
    this.graph.selectAll(".x.axis.label").remove();
    if (this.plotOptions.showTimeLabel) {
      this.graph.append("text")
        .attr("class", "x axis label")
        .attr("x", (this.width + bufferXrange) / 2)
        .attr("y", this.height + this.margin.bottom - 5)
        .style("text-anchor", "middle")
        .text(this.plotOptions.showTimeLabel === true ? "time" : this.plotOptions.showTimeLabel);
    }
  }

  private calcTicks() {
    const tickCount = (this.width - this.leftOffset) / 120;
    return this.ticks(this.timespan!, tickCount);
  }

  private ticks(ts: Timespan, interval: number) {
    const start = this.timezoneSrvc.createTzDate(ts.from);
    const end = this.timezoneSrvc.createTzDate(ts.to);
    const t = this.tickInterval(interval, ts.from, ts.to);
    const next = this.getFirstTick(start, t);
    const ticks: Date[] = [];
    while (next.isSameOrBefore(end)) {
      const date = next.clone();
      ticks.push(date.toDate());
      next.add(t.step, t.interval);
    }
    return ticks;
  }

  private getFirstTick(start: moment.Moment, t: { interval: unitOfTime.DurationConstructor; step: number; }) {
    return this.round(start, t);
  }

  private round(date: moment.Moment, t: { interval: unitOfTime.DurationConstructor; step: number; }) {
    const duration = moment.duration(t.step, t.interval);
    const offset = date.utcOffset() * 60 * 1000;
    const part = (+date + offset) / (+duration);
    const round = moment(Math.ceil(part) * (+duration) - offset).startOf(t.interval);
    return date > round ? round.add(t.step, t.interval) : round;
  }

  private tickInterval(interval: number, start: number, stop: number): { interval: unitOfTime.DurationConstructor, step: number } {
    const durationSecond = 1000,
      durationMinute = durationSecond * 60,
      durationHour = durationMinute * 60,
      durationDay = durationHour * 24,
      durationWeek = durationDay * 7,
      durationMonth = durationDay * 30,
      durationYear = durationDay * 365;
    const tickIntervals: any[] = [
      ["second", 1, durationSecond],
      ["second", 5, 5 * durationSecond],
      ["second", 15, 15 * durationSecond],
      ["second", 30, 30 * durationSecond],
      ["minute", 1, durationMinute],
      ["minute", 5, 5 * durationMinute],
      ["minute", 15, 15 * durationMinute],
      ["minute", 30, 30 * durationMinute],
      ["hour", 1, durationHour],
      ["hour", 3, 3 * durationHour],
      ["hour", 6, 6 * durationHour],
      ["hour", 12, 12 * durationHour],
      ["day", 1, durationDay],
      ["day", 2, 2 * durationDay],
      ["week", 1, durationWeek],
      ["month", 1, durationMonth],
      ["month", 3, 3 * durationMonth],
      ["month", 6, 6 * durationMonth],
      ["year", 1, durationYear]
    ];
    let step;
    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    let detectedInterval: unitOfTime.DurationConstructor;
    const target = Math.abs(stop - start) / interval;
    const i: number = d3.bisector((j: any) => j[2]).right(tickIntervals, target);
    if (i === tickIntervals.length) {
      step = d3.tickStep(start / durationYear, stop / durationYear, interval);
      detectedInterval = "year";
    } else if (i) {
      const index = target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i;
      const entry = tickIntervals[index];
      step = entry[1];
      detectedInterval = entry[0];
    } else {
      step = Math.max(d3.tickStep(start, stop, interval), 1);
      detectedInterval = "millisecond";
    }
    return {
      interval: detectedInterval,
      step: step
    };
  }

  /**
   * Function to draw the y axis for each dataset.
   * Each uom has its own axis.
   * @param axis {DataEntry} Object containing a dataset.
   */
  private drawYaxis(axis: YAxis) {
    const showAxis = (this.plotOptions.overview ? false : (this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis));

    // adjust to default extend
    this.rangeCalc.setDefaultExtendIfUndefined(axis);

    this.rangeCalc.bufferUnfixedRange(axis);

    this.observer.forEach(e => { if (e.adjustYAxis) { e.adjustYAxis(axis); } });

    // range for y axis scale
    const yScale = d3.scaleLinear().domain([axis.range.min!, axis.range.max!]).range([this.height, 0]);

    const yAxisGen = d3.axisLeft(yScale).ticks(TICKS_COUNT_YAXIS);
    let buffer = 0;

    // only if yAxis should not be visible
    if (!showAxis) {
      yAxisGen
        .tickFormat(() => "")
        .tickSize(0);
    }

    // draw y axis
    const axisElem = this.graph.append<SVGSVGElement>("svg:g")
      .attr("class", "y axis")
      .call(yAxisGen)
    const axisElemNode = axisElem.node()

    // only if yAxis should be visible
    if (showAxis && axisElemNode) {
      const diagramHeight = this.height;
      let axisHeight = axisElemNode.getBBox().height;
      if (this.yaxisModifier) {
        axisHeight -= 180;
      }

      // draw y axis label
      const text = this.graph.append<SVGSVGElement>("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em")
        .attr("class", `yaxisTextLabel ${axis.selected ? "selected" : ""}`)
        .text(this.getYAxisLabel(axis))
        .call((res) => this.wrapText(res, axisHeight - 10, diagramHeight / 2, this.yaxisModifier, axis.label))

      const axisWidth = axisElemNode.getBBox().width + 10 + this.graphHelper.getDimensions(text.node()).h;

      // if yAxis should not be visible, buffer will be set to 0
      const offset = axis.offset ? axis.offset : 0;
      buffer = (showAxis ? offset + (axisWidth < this.margin.left ? this.margin.left : axisWidth) : 0);

      const axisWidthDiv = (axisWidth < this.margin.left ? this.margin.left : axisWidth);

      if (!axis.first) {
        axisElem.attr("transform", "translate(" + buffer + ", 0)");
      } else {
        buffer = axisWidthDiv - this.margin.left;
        axisElem.attr("transform", "translate(" + buffer + ", 0)");
      }

      let textOff = - (this.leftOffset);
      if (axis.first) {
        textOff = this.margin.left;
      }
      text.attr("y", 0 - textOff);
      const textNode = text.node();

      if (text && textNode) {
        const textWidth = textNode.getBBox().width;
        const textHeight = textNode.getBBox().height;
        const textPosition = {
          x: textNode.getBBox().x,
          y: textNode.getBBox().y
        };
        const axisradius = 4;
        const startOfPoints = {
          x: textPosition.y + textHeight / 2 + axisradius / 2, // + 2 because radius === 4
          y: Math.abs(textPosition.x + textWidth) - axisradius * 2
        };
        let pointOffset = 0;

        axis.ids.forEach((entryID) => {
          const dataentry = this.preparedData.find(el => el.internalId === entryID);
          if (dataentry) {
            if (dataentry.options.type) {
              this.graphHelper.drawDatasetSign(this.graph, dataentry.options, startOfPoints.x, startOfPoints.y - pointOffset, !!dataentry.selected);
            }
            pointOffset += axisradius * 3 + (dataentry.selected ? 2 : 0);
          }
        });

        const axisDiv = this.graph.append("rect")
          .attr("class", `y axisDiv ${axis.selected ? "selected" : ""}`)
          .attr("width", axisWidthDiv)
          .attr("height", this.height)
          .on("mouseup", () => this.highlightLine(axis.ids));

        if (!axis.first) {
          axisDiv.attr("x", offset).attr("y", 0);
        } else {
          axisDiv.attr("x", 0 - this.margin.left - this.maxLabelwidth).attr("y", 0);
        }

        this.observer.forEach(e => { if (e.afterYAxisDrawn) { e.afterYAxisDrawn(axis, buffer - axisWidth, axisHeight, axisWidth); } });
      }
    }

    return {
      buffer,
      yScale
    };
  }

  private getYAxisLabel(axis: YAxis): string {
    if (this.yAxisLabelSrvc.getLabel) {
      const datasets = filterUndefined(axis.ids.map(id => this.datasetMap.get(id)));
      return this.yAxisLabelSrvc.getLabel(axis, datasets);
    }
    return axis.label ? (axis.uom + " @ " + axis.label) : axis.uom;
  }

  private drawBackground() {
    this.background = this.graph.insert<SVGSVGElement>("svg:rect", ":first-child")
      .attr("width", this.width - this.leftOffset)
      .attr("height", this.height)
      .attr("class", "graph-background")
      .attr("fill", "none")
      .attr("transform", "translate(" + this.leftOffset + ", 0)");
  }

  /**
   * Function to set selected Ids that should be highlighted.
   * @param ids {Array} Array of Strings containing the Ids.
   */
  private highlightLine(ids: string[]): void {
    const changeFalse: HighlightDataset[] = [];
    const changeTrue: HighlightDataset[] = [];
    ids.forEach((ID) => {
      if (this.selectedDatasetIds.indexOf(ID) >= 0) {
        changeFalse.push({ id: ID, change: false });
      }
      changeTrue.push({ id: ID, change: true });
    });

    if (ids.length === changeFalse.length) {
      this.changeSelectedIds(changeFalse, true);
    } else {
      this.changeSelectedIds(changeTrue, false);
    }
  }

  /**
   * Function that changes state of selected Ids.
   */
  private changeSelectedIds(toHighlightDataset: HighlightDataset[], change: boolean): void {
    if (change) {
      toHighlightDataset.forEach((obj) => {
        this.removeSelectedId(obj.id);
        this.selectedDatasetIds.splice(this.selectedDatasetIds.findIndex((entry) => entry === obj.id), 1);
      });
    } else {
      toHighlightDataset.forEach((obj) => {
        if (this.selectedDatasetIds.indexOf(obj.id) < 0) {
          this.setSelectedId(obj.id);
          this.selectedDatasetIds.push(obj.id);
        }
      });
    }

    this.onDatasetSelected.emit(this.selectedDatasetIds);
    this.redrawCompleteGraph();
  }

  /**
   * Function to draw the graph line for each dataset.
   * @param entry {DataEntry} Object containing a dataset.
   */
  protected drawChart(entry: InternalDataEntry): void {
    if (entry.data.length > 0) {
      const yaxis = this.yAxes.find(e => e.ids.indexOf(entry.internalId) >= 0);
      if (yaxis) {
        // create body to clip graph
        // unique ID generated through the current time (current time when initialized)
        const querySelectorClip = "clip" + this.graphId;
        this.graph
          .append("svg:clipPath")
          .attr("class", "diagram-path")
          .attr("id", querySelectorClip)
          .append("svg:rect")
          .attr("x", this.leftOffset)
          .attr("y", 0)
          .attr("width", this.width - this.leftOffset)
          .attr("height", this.height);
        // draw graph line
        this.graphBody = this.graph
          .append("g")
          .attr("class", "diagram-path")
          .attr("clip-path", "url(#" + querySelectorClip + ")");

        if (entry.options.type === "bar") {
          this.drawBarChart(entry, yaxis.yScale!);
        } else {
          // draw ref value line
          entry.referenceValueData.forEach(e => this.drawRefLineChart(e.data, e.color, entry.options.lineWidth || 1, yaxis.yScale!));
          this.drawLineChart(entry, yaxis.yScale!);
        }
      }
    }
  }

  private drawRefLineChart(data: DataEntry[], color: string, width: number, yScaleBase: d3.ScaleLinear<number, number>): void {
    const line = this.createLine(this.xScaleBase!, yScaleBase);

    this.graphBody
      .append("svg:path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", width)
      .attr("d", line);
  }

  private drawLineChart(entry: InternalDataEntry, yScaleBase: d3.ScaleLinear<number, number>) {
    const pointRadius = this.calculatePointRadius(entry); 0

    // create graph line
    const line = this.createLine(this.xScaleBase!, yScaleBase);
    // draw line
    this.graphBody
      .append("svg:path")
      .datum(entry.data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke-dasharray", entry.options.lineDashArray)
      .attr("stroke", entry.options.color)
      .attr("stroke-width", this.calculateLineWidth(entry))
      .attr("d", line);

    // draw line dots
    if (entry.options.pointSymbol) {
      this.pointSymbolDrawer.drawSymboleLine(entry, this.graphBody, this.addLineWidth);
    } else {
      this.graphBody.selectAll(".graphDots")
        .data(entry.data.filter((d) => !isNaN(d.value)))
        .enter().append("circle")
        .attr("class", "graphDots")
        .attr("id", (d: DataEntry) => "dot-" + d.timestamp + "-" + entry.hoverId)
        .attr("stroke", entry.options.pointBorderColor)
        .attr("stroke-width", entry.options.pointBorderWidth)
        .attr("fill", entry.options.color)
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("r", pointRadius);
    }

  }

  private drawBarChart(entry: InternalDataEntry, yScaleBase: d3.ScaleLinear<number, number>) {
    const paddingBefore = 0;
    const paddingAfter = 1;
    const periodInMs = entry.bar?.period.asMilliseconds() || 0;

    this.graphBody.selectAll(".bar")
      .data(entry.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("id", (d: DataEntry) => "bar-" + d.timestamp + "-" + entry.hoverId)
      .style("fill", entry.options.color)
      .style("stroke-dasharray", entry.options.lineDashArray)
      .style("stroke", entry.options.color)
      .style("stroke-width", this.calculateLineWidth(entry))
      .style("fill-opacity", 0.5)
      .attr("x", (d: DataEntry) => (this.xScaleBase!(d.timestamp) || 0) + paddingBefore)
      .attr("width", (d: DataEntry) => {
        let width = 10;
        if (typeof d.value === "number") {
          width = (this.xScaleBase!(d.timestamp + periodInMs) || 0) - (this.xScaleBase!(d.timestamp) || 0);
        }
        const barWidth = width - paddingBefore - paddingAfter;
        return barWidth < 1 ? 1 : barWidth;
      })
      .attr("y", (d: DataEntry) => !isNaN(d.value) ? yScaleBase(d.value) : 0)
      .attr("height", (d: DataEntry) => !isNaN(d.value) ? this.height - (yScaleBase(d.value) || 0) : 0);
  }

  private createLine(xScaleBase: d3.ScaleTime<number, number>, yScaleBase: d3.ScaleLinear<number, number>) {
    return d3.line<DataEntry>()
      .defined((d) => {
        return (!isNaN(d.timestamp)) && (!isNaN(d.value));
      })
      .x((d) => {
        d.xDiagCoord = xScaleBase(d.timestamp) as number;
        return d.xDiagCoord;
      })
      .y((d) => {
        d.yDiagCoord = yScaleBase(d.value) as number;
        return d.yDiagCoord;
      })
      .curve(d3.curveLinear);
  }

  /**
   * Function to wrap the text for the y axis label.
   * @param text {any} y axis label
   * @param width {Number} width of the axis which must not be crossed
   * @param xposition {Number} position to center the label in the middle
   */
  private wrapText(textObj: any, width: number, xposition: number, yaxisModifier: boolean, axisLabel: string | undefined): void {
    textObj.each((u: any, i: number, d: any) => {
      const bla = d[i];
      const bufferYaxisModifier = (yaxisModifier ? (axisLabel ? 0 : 30) : 0); // add buffer to avoid colored circles intersect with yaxismodifier symbols
      let word;
      const text = d3.select(d[i]);
      const words = text.text().split(/\s+/).reverse();
      let line: string[] = [];
      const lineHeight = (i === d.length - 1 ? 0.3 : 1.1); // ems
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      let tspan = text.text(null).append("tspan").attr("x", 0 - xposition).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        const node: SVGTSpanElement = <SVGTSpanElement>tspan.node();
        const hasGreaterWidth: boolean = node.getComputedTextLength() > width;
        const xyposition = xposition + (node.getComputedTextLength() / 2);
        node.setAttribute("x", "-" + "" + (xyposition + bufferYaxisModifier));
        if (hasGreaterWidth) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0 - xposition).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
          const nodeGreater: SVGTSpanElement = <SVGTSpanElement>tspan.node();
          const xpositionGreater = xposition + (nodeGreater.getComputedTextLength());
          nodeGreater.setAttribute("x", "-" + "" + (xpositionGreater + bufferYaxisModifier));
        }
      }
    });
  }

  /**
   * Function to generate uuid for a diagram
   */
  private uuidv4(): string {
    return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
  }

  /**
   * Function to generate components of the uuid for a diagram
   */
  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  private calculateLineWidth(entry: InternalDataEntry): number {
    if (entry.selected) {
      return entry.options.lineWidth + this.addLineWidth;
    } else {
      return entry.options.lineWidth;
    }
  }

  private calculatePointRadius(entry: InternalDataEntry) {
    if (entry.selected) {
      return entry.options.pointRadius > 0 ? entry.options.pointRadius + this.addLineWidth : entry.options.pointRadius;
    } else {
      return entry.options.pointRadius;
    }
  }
}

