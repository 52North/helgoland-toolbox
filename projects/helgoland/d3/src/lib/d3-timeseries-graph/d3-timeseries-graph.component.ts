import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    IterableDiffers,
    OnDestroy,
    Optional,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
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
import * as d3 from 'd3';
import moment, { unitOfTime } from 'moment';
import { Subscription } from 'rxjs';

import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { D3DataGeneralizer } from '../helper/generalizing/d3-data-generalizer';
import { D3HoveringService } from '../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../helper/hovering/d3-simple-hovering.service';
import { DataConst, DataEntry, InternalDataEntry, YAxis, YAxisSettings } from '../model/d3-general';
import { HighlightOutput } from '../model/d3-highlight';
import { D3PlotOptions, HoveringStyle } from '../model/d3-plot-options';
import { PointSymbolType } from './../../../../core/src/lib/model/internal/options';
import { D3GraphId } from './../helper/d3-graph-id.service';
import { D3Graphs } from './../helper/d3-graphs.service';
import { D3DataSimpleGeneralizer } from './../helper/generalizing/d3-data-simple-generalizer.service';
import { RangeCalculationsService } from './../helper/range-calculations.service';
import { D3GraphExtent, D3GraphObserver } from './d3-timeseries-graph-control';
import {
    D3TimeseriesGraphErrorHandler,
    D3TimeseriesSimpleGraphErrorHandler,
} from './d3-timeseries-graph-error-handler.service';

interface HighlightDataset {
    id: string;
    change: boolean;
}

const TICKS_COUNT_YAXIS = 5;

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    providers: [D3GraphId],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent
    extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions>
    implements AfterViewInit, OnDestroy {

    @Input()
    // difference to timespan/timeInterval --> if brush, then this is the timespan of the main-diagram
    public mainTimeInterval: Timespan;

    @Input()
    public yaxisModifier: boolean;

    @Input() public hoveringService: D3HoveringService = new D3SimpleHoveringService(this.timezoneSrvc);

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onClickDataPoint: EventEmitter<{ timeseries: HelgolandTimeseries, data: HelgolandTimeseriesData }> = new EventEmitter();

    @ViewChild('d3timeseries', { static: true })
    public d3Elem: ElementRef;

    public highlightOutput: HighlightOutput;

    // DOM elements
    protected rawSvg: d3.Selection<SVGSVGElement, any, any, any>;
    protected graph: d3.Selection<SVGSVGElement, any, any, any>;
    protected graphBody: any;
    private background: d3.Selection<SVGSVGElement, any, any, any>;

    // data types
    protected preparedData: InternalDataEntry[] = [];
    protected preparedAxes: Map<string, YAxisSettings> = new Map();
    protected datasetMap: Map<string, DataConst> = new Map();
    protected listOfUoms: string[] = [];
    /** calculated y axes for the diagram */
    private yAxes: YAxis[] = [];
    private listOfSeparation = Array();

    private xScaleBase: d3.ScaleTime<number, number>; // calculate diagram coord of x value
    private yScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of y value
    private leftOffset: number;

    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    private maxLabelwidth = 0;
    private addLineWidth = 2; // value added to linewidth
    private loadingData: Set<string> = new Set();
    private currentTimeId: string;

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

    private lastHoverPositioning: number;
    private graphInteraction: d3.Selection<SVGSVGElement, any, any, any>;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected timeFormatLocaleService: D3TimeFormatLocaleService,
        protected colorService: ColorService,
        protected translateService: TranslateService,
        protected timezoneSrvc: TimezoneService,
        protected sumValues: SumValuesService,
        protected rangeCalc: RangeCalculationsService,
        protected graphHelper: D3GraphHelperService,
        protected graphService: D3Graphs,
        protected graphId: D3GraphId,
        protected servicesConnector: HelgolandServicesConnector,
        @Optional() protected errorHandler: D3TimeseriesGraphErrorHandler = new D3TimeseriesSimpleGraphErrorHandler(),
        @Optional() protected generalizer: D3DataGeneralizer = new D3DataSimpleGeneralizer()
    ) {
        super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateService, timezoneSrvc);
    }

    public ngAfterViewInit(): void {
        this.currentTimeId = this.uuidv4();

        this.graphId.setId(this.currentTimeId);
        this.graphService.setGraph(this.currentTimeId, this);

        this.rawSvg = d3.select<SVGSVGElement, any>(this.d3Elem.nativeElement)
            .append<SVGSVGElement>('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append<SVGSVGElement>('g')
            .attr('id', `graph-${this.currentTimeId}`)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.graphInteraction = this.rawSvg
            .append<SVGSVGElement>('g')
            .attr('id', `interaction-layer-${this.currentTimeId}`)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        new ResizeObserver(() => this.redrawCompleteGraph()).observe(this.d3Elem.nativeElement);
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
        this.graphService.removeGraph(this.currentTimeId);
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
            if (this.datasetMap.has(id)) {
                this.loadDatasetData(this.datasetMap.get(id), true);
            }
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
            d3.select('g.d3line').attr('visibility', 'visible');
        }
        Object.assign(this.plotOptions, options);
        this.redrawCompleteGraph();
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
        if (!firstChange && this.datasetMap.has(internalId)) {
            this.loadDatasetData(this.datasetMap.get(internalId), false);
        }
    }

    protected timeIntervalChanges(): void {
        this.datasetMap.forEach((dataset) => this.loadDatasetData(dataset, false));
    }

    protected onResize(): void {
    }

    public centerTime(timestamp: number): void {
        const centeredTimespan = this.timeSrvc.centerTimespan(this.timespan, new Date(timestamp));
        this.onTimespanChanged.emit(centeredTimespan);
    }

    public changeTime(from: number, to: number): void {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    public getDataset(internalId: string) {
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
        const datasetOptions = this.datasetOptions.get(dataset.internalId);

        if (this.timespan) {
            if (this.plotOptions.sendDataRequestOnlyIfDatasetTimespanCovered
                && dataset.firstValue
                && dataset.lastValue
                && !this.timeSrvc.overlaps(this.timespan, dataset.firstValue.timestamp, dataset.lastValue.timestamp)) {
                this.prepareData(dataset, new HelgolandTimeseriesData([]));
                this.onCompleteLoadingData(dataset);
            } else {
                if (this.loadingData.size === 0) { this.onContentLoading.emit(true); }
                const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, this.plotOptions.timespanBufferFactor, moment.duration(1, 'day').asMilliseconds());
                this.loadingData.add(dataset.internalId);
                this.dataLoaded.emit(this.loadingData);
                if (this.runningDataRequests.has(dataset.internalId)) {
                    this.runningDataRequests.get(dataset.internalId).unsubscribe();
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
            this.graphId.getId().subscribe(id => console.warn(`No timespan is configured for graph with ID: ${id}`));
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
        if (rawdata instanceof HelgolandTimeseriesData) {
            // add surrounding entries to the set
            if (rawdata.valueBeforeTimespan) { rawdata.values.unshift(rawdata.valueBeforeTimespan); }
            if (rawdata.valueAfterTimespan) { rawdata.values.push(rawdata.valueAfterTimespan); }

            const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan);

            this.datasetMap.get(dataset.internalId).data = data;
            const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            const options = this.datasetOptions.get(dataset.internalId);

            let barConfig: { startOf: unitOfTime.StartOf; period: moment.Duration; };

            // sum values for bar chart visualization
            if (options.type === 'bar') {
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
        return refValues.map(d => ({ timestamp: d[0], value: d[1] }));
    }

    /**
     * Function that processes the data to calculate y axis range of each dataset.
     * @param entry {DataEntry} Object containing dataset related data.
     */
    protected processData(entry: InternalDataEntry): void {
        let visualMin: number;
        let visualMax: number;
        let fixedMin = false;
        let fixedMax = false;

        // set out of yAxisRange
        if (entry.axisOptions.yAxisRange) {

            if (!isNaN(entry.axisOptions.yAxisRange.min)) {
                visualMin = entry.axisOptions.yAxisRange.min;
                fixedMin = true;
            }

            if (!isNaN(entry.axisOptions.yAxisRange.max)) {
                visualMax = entry.axisOptions.yAxisRange.max;
                fixedMax = true;
            }

            if (!isNaN(visualMin) && !isNaN(visualMax) && visualMin > visualMax) {
                const temp = visualMin;
                visualMin = visualMax;
                visualMax = temp;
            }
        }

        // set variable extend bounds
        if (isNaN(visualMin) || isNaN(visualMax)) {
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

            const dataExtentRafValues = entry.referenceValueData.map(e => d3.extent<DataEntry, number>(e.data, (d) => (typeof d.value === 'number') ? d.value : null));

            if (isNaN(visualMin)) {
                visualMin = d3.min([baseDataExtent[0], ...dataExtentRafValues.map(e => e[0])]);
            }

            if (isNaN(visualMax)) {
                visualMax = d3.max([baseDataExtent[1], ...dataExtentRafValues.map(e => e[1])]);
            }
        }

        // set out of zeroBasedAxis
        if (entry.axisOptions.zeroBased) {
            if (visualMin > 0) {
                visualMin = 0;
            }
            if (visualMax < 0) {
                visualMax = 0;
            }
        }

        this.preparedAxes.set(entry.internalId, {
            visualMin,
            visualMax,
            fixedMin,
            fixedMax,
            entry
        });
    }

    /**
     * Function that returns the height of the graph diagram.
     */
    private calculateHeight(): number {
        return (this.d3Elem.nativeElement as HTMLElement).clientHeight
            - this.margin.top
            - this.margin.bottom
            + (this.plotOptions.showTimeLabel || (this.plotOptions.timeRangeLabel && this.plotOptions.timeRangeLabel.show) ? 0 : 20);
    }

    /**
     * Function that returns the width of the graph diagram.
     */
    private calculateWidth(): number {
        return this.rawSvg.node().width.baseVal.value - this.margin.left - this.margin.right - this.maxLabelwidth;
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
        this.graph.selectAll('.grid.y-grid').remove();
        if (this.yAxes.length === 1 && this.plotOptions.grid) {
            this.graph.append('svg:g')
                .attr('class', 'grid y-grid')
                .attr('transform', 'translate(' + this.leftOffset + ', 0)')
                .call(d3.axisLeft(this.yAxes[0].yScale)
                    .ticks(TICKS_COUNT_YAXIS)
                    .tickSize(-this.width + this.leftOffset)
                    .tickFormat(() => ''));
        }
    }

    public getDrawingLayer(id: string, front?: boolean): d3.Selection<SVGGElement, any, any, any> {
        return this.rawSvg
            .insert('g', !front ? `#interaction-layer-${this.currentTimeId}` : null)
            .attr('id', id)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');
    }

    /**
     * Function to plot the whole graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    public redrawCompleteGraph(): void {
        if (this.isNotDrawable()) { return; }

        this.highlightOutput = {
            timestamp: 0,
            ids: new Map()
        };

        this.preparedData.forEach((entry) => {
            const idx: number = this.listOfUoms.findIndex((uom) => uom === entry.axisOptions.uom);
            if (idx < 0) { this.listOfUoms.push(entry.axisOptions.uom); }
        });

        this.height = this.calculateHeight();
        this.width = this.calculateWidth() - 20; // add buffer to the left to garantee visualization of last date (tick x-axis)
        this.graph.selectAll('*').remove();
        this.graphInteraction.selectAll('*').remove();
        this.observer.forEach(e => e.cleanUp && e.cleanUp());

        this.leftOffset = 0;
        this.yScaleBase = null;

        // reset y axes
        this.yAxes = [];
        this.prepareYAxes();

        this.yAxes.forEach(axis => {
            axis.first = (this.yScaleBase === null);
            axis.offset = this.leftOffset;

            const yAxisResult = this.drawYaxis(axis);
            if (this.yScaleBase === null) {
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
        this.background = this.graphInteraction.append<SVGSVGElement>('svg:rect')
            .attr('width', this.width - this.leftOffset)
            .attr('height', this.height)
            .attr('id', 'backgroundRect')
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.leftOffset + ', 0)');

        this.addTimespanJumpButtons();

        this.background.on('mousemove', () => this.observer.forEach(e => e.mousemoveBackground && e.mousemoveBackground()));

        this.background.on('mouseover', () => this.observer.forEach(e => e.mouseoverBackground && e.mouseoverBackground()));

        this.background.on('mouseout', () => this.observer.forEach(e => e.mouseoutBackground && e.mouseoutBackground()));

        if (this.plotOptions.togglePanZoom === false) {
            this.background.call(d3.zoom()
                .on('start', () => this.observer.forEach(e => e.zoomStartBackground && e.zoomStartBackground()))
                .on('zoom', () => this.observer.forEach(e => e.zoomMoveBackground && e.zoomMoveBackground()))
                .on('end', () => this.observer.forEach(e => e.zoomEndBackground && e.zoomEndBackground()))
            );
        } else {
            this.background.call(d3.drag()
                .on('start', () => this.observer.forEach(e => e.dragStartBackground && e.dragStartBackground()))
                .on('drag', () => this.observer.forEach(e => e.dragMoveBackground && e.dragMoveBackground()))
                .on('end', () => this.observer.forEach(e => e.dragEndBackground && e.dragEndBackground()))
            );
        }

        this.observer.forEach(e => {

            if (e.adjustBackground) {
                const graphExtent: D3GraphExtent = {
                    width: this.width,
                    height: this.height,
                    leftOffset: this.leftOffset,
                    margin: this.margin,
                    xScale: this.xScaleBase
                };
                e.adjustBackground(this.background, graphExtent, this.preparedData, this.graph, this.timespan);
            }
        });
        this.drawBackground();
    }

    protected drawTimeRangeLabels() {
        if (this.plotOptions.timeRangeLabel && this.plotOptions.timeRangeLabel.show) {
            this.graph.append('text')
                .attr('class', 'x axis time-range from')
                .attr('x', this.leftOffset)
                .attr('y', this.height + this.margin.bottom - 5)
                .style('text-anchor', 'start')
                .text(this.timezoneSrvc.formatTzDate(this.timespan.from, this.plotOptions.timeRangeLabel.format));
            this.graph.append('text')
                .attr('class', 'x axis time-range to')
                .attr('x', this.width)
                .attr('y', this.height + this.margin.bottom - 5)
                .style('text-anchor', 'end')
                .text(this.timezoneSrvc.formatTzDate(this.timespan.to, this.plotOptions.timeRangeLabel.format));
        }
    }

    private isNotDrawable() {
        try {
            return this.rawSvg.node().width.baseVal.value === undefined
                || this.rawSvg.node().width.baseVal.value === 0
                || this.rawSvg.node().height.baseVal.value === undefined
                || this.rawSvg.node().height.baseVal.value === 0
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
        if (this.preparedAxes.has(id)) {
            const axisSettings = this.preparedAxes.get(id);
            if (axisSettings.entry.options.separateYAxis) {
                // create sepearte axis
                this.yAxes.push({
                    uom: axisSettings.entry.axisOptions.uom,
                    range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
                    fixedMin: axisSettings.fixedMin,
                    fixedMax: axisSettings.fixedMax,
                    selected: axisSettings.entry.selected,
                    seperate: true,
                    ids: [id],
                    label: axisSettings.entry.axisOptions.parameters.feature.label
                });
            } else {
                // find matching axis or add new
                const axis = this.yAxes.find(e => e.uom.includes(axisSettings.entry.axisOptions.uom) && !e.seperate);
                if (axis) {
                    // add id to axis
                    axis.ids.push(id);
                    // update range for axis
                    if (!axis.fixedMin) {
                        axis.range.min = d3.min([axis.range.min, axisSettings.visualMin]);
                    }
                    if (!axis.fixedMax) {
                        axis.range.max = d3.max([axis.range.max, axisSettings.visualMax]);
                    }
                    axis.fixedMin = axis.fixedMin || axisSettings.fixedMin;
                    axis.fixedMax = axis.fixedMax || axisSettings.fixedMax;
                    // update selection
                    if (axis.selected) {
                        axis.selected = axisSettings.entry.selected;
                    }
                } else {
                    this.yAxes.push({
                        uom: axisSettings.entry.axisOptions.uom,
                        range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
                        fixedMin: axisSettings.fixedMin,
                        fixedMax: axisSettings.fixedMax,
                        seperate: false,
                        selected: axisSettings.entry.selected,
                        ids: [id]
                    });
                }
            }
        }
    }

    private addTimespanJumpButtons(): void {
        let dataVisible = false;
        let formerTimestamp = null;
        let laterTimestamp = null;
        if (this.plotOptions.requestBeforeAfterValues) {
            this.preparedData.forEach((entry: InternalDataEntry) => {
                const firstIdxInTimespan = entry.data.findIndex(e => (this.timespan.from < e.timestamp && this.timespan.to > e.timestamp) && typeof e.value === 'number');
                if (firstIdxInTimespan < 0) {
                    const lastIdxInTimespan = entry.data.findIndex(e => (e.timestamp > this.timespan.from && e.timestamp > this.timespan.to) && typeof e.value === 'number');
                    if (lastIdxInTimespan >= 0) {
                        laterTimestamp = entry.data[entry.data.length - 1].timestamp;
                    }
                    const temp = entry.data.findIndex(e => (e.timestamp < this.timespan.from && e.timestamp < this.timespan.to) && typeof e.value === 'number');
                    if (temp >= 0) {
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
            if (formerTimestamp) {
                const g = this.background.append('g');
                g.append('svg:rect')
                    .attr('class', 'formerButton')
                    .attr('width', buttonWidth + 'px')
                    .attr('height', this.height + 'px')
                    .attr('transform', 'translate(' + this.leftOffset + ', 0)')
                    .on('click', () => this.centerTime(formerTimestamp));
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', 0 + this.leftOffset + leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', 0 + this.leftOffset + (buttonWidth - leftRight) + 'px')
                    .attr('y2', this.height / 2 - (buttonWidth - leftRight) / 2 + 'px');
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', 0 + this.leftOffset + leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', 0 + this.leftOffset + (buttonWidth - leftRight) + 'px')
                    .attr('y2', this.height / 2 + (buttonWidth - leftRight) / 2 + 'px');
            }
            if (laterTimestamp) {
                const g = this.background.append('g');
                g.append('svg:rect')
                    .attr('class', 'laterButton')
                    .attr('width', '50px')
                    .attr('height', this.height)
                    .attr('transform', 'translate(' + (this.width - 50) + ', 0)')
                    .on('click', () => this.centerTime(laterTimestamp));
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', this.width - leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', this.width - (buttonWidth - leftRight) + 'px')
                    .attr('y2', this.height / 2 - (buttonWidth - leftRight) / 2 + 'px');
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', this.width - leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', this.width - (buttonWidth - leftRight) + 'px')
                    .attr('y2', this.height / 2 + (buttonWidth - leftRight) / 2 + 'px');
            }
        }
    }

    /**
     * Draws for every preprared data entry the chart.
     */
    protected drawAllCharts(): void {
        this.graph.selectAll('.diagram-path').remove();
        this.preparedData.forEach((entry) => this.drawChart(entry));
    }

    /**
     * Function that draws the x axis to the svg element.
     * @param bufferXrange {Number} Number with the distance between left edge and the beginning of the graph.
     */
    private drawXaxis(bufferXrange: number): void {
        // range for x axis scale
        this.xScaleBase = d3.scaleTime()
            .domain([new Date(this.timespan.from), new Date(this.timespan.to)])
            .range([bufferXrange, this.width]);

        const ticks = this.calcTicks();

        const xAxis = d3.axisBottom(this.xScaleBase)
            .tickFormat(d => this.timeFormatLocaleService.formatTime(d.valueOf()))
            // .ticks(10); // TODO: cleanup
            .tickValues(ticks);

        // update x axis
        this.graph.selectAll('.x.axis.bottom').remove();
        this.graph.append('g')
            .attr('class', 'x axis bottom')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

        // draw x grid lines
        this.graph.selectAll('.grid.x-grid').remove();
        if (this.plotOptions.grid) {
            // draw the x grid lines
            this.graph.append('svg:g')
                .attr('class', 'grid x-grid')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(xAxis
                    .tickSize(-this.height)
                    .tickFormat(() => '')
                );
        }

        // draw upper axis as border
        this.graph.selectAll('.x.axis.top').remove();
        this.graph.append('svg:g')
            .attr('class', 'x axis top')
            .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0));

        // draw right axis as border
        this.graph.selectAll('.y.axis.right').remove();
        this.graph.append('svg:g')
            .attr('class', 'y axis right')
            .attr('transform', 'translate(' + this.width + ',0)')
            .call(d3.axisRight(this.yScaleBase).tickFormat(() => '').tickSize(0));

        // text label for the x axis
        this.graph.selectAll('.x.axis.label').remove();
        if (this.plotOptions.showTimeLabel) {
            this.graph.append('text')
                .attr('class', 'x axis label')
                .attr('x', (this.width + bufferXrange) / 2)
                .attr('y', this.height + this.margin.bottom - 5)
                .style('text-anchor', 'middle')
                .text('time');
        }
    }

    private calcTicks() {
        const tickCount = (this.width - this.leftOffset) / 80;
        return this.ticks(this.timespan, tickCount);
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
        return this.round(start, moment.duration(t.step, t.interval));
    }

    private round(date: moment.Moment, duration: moment.Duration) {
        const offset = date.utcOffset() * 60 * 1000;
        const part = (+date + offset) / (+duration);
        return moment(Math.ceil(part) * (+duration) - offset);
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
            ['second', 1, durationSecond],
            ['second', 5, 5 * durationSecond],
            ['second', 15, 15 * durationSecond],
            ['second', 30, 30 * durationSecond],
            ['minute', 1, durationMinute],
            ['minute', 5, 5 * durationMinute],
            ['minute', 15, 15 * durationMinute],
            ['minute', 30, 30 * durationMinute],
            ['hour', 1, durationHour],
            ['hour', 3, 3 * durationHour],
            ['hour', 6, 6 * durationHour],
            ['hour', 12, 12 * durationHour],
            ['day', 1, durationDay],
            ['day', 2, 2 * durationDay],
            ['week', 1, durationWeek],
            ['month', 1, durationMonth],
            ['month', 3, 3 * durationMonth],
            ['year', 1, durationYear]
        ];
        let step;
        // If a desired tick count is specified, pick a reasonable tick interval
        // based on the extent of the domain and a rough estimate of tick size.
        // Otherwise, assume interval is already a time interval and use it.
        let detectedInterval: unitOfTime.DurationConstructor;
        const target = Math.abs(stop - start) / interval;
        const i: number = d3.bisector(function (j) { return j[2]; }).right(tickIntervals, target);
        if (i === tickIntervals.length) {
            step = d3.tickStep(start / durationYear, stop / durationYear, interval);
            detectedInterval = 'year';
        } else if (i) {
            const index = target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i;
            const entry = tickIntervals[index];
            step = entry[1];
            detectedInterval = entry[0];
        } else {
            step = Math.max(d3.tickStep(start, stop, interval), 1);
            detectedInterval = 'millisecond';
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

        this.observer.forEach(e => { if (e.adjustYAxis) { e.adjustYAxis(axis); } });

        // adjust to default extend
        this.rangeCalc.setDefaultExtendIfUndefined(axis);

        this.rangeCalc.bufferUnfixedRange(axis);

        // range for y axis scale
        const yScale = d3.scaleLinear().domain([axis.range.min, axis.range.max]).range([this.height, 0]);

        const yAxisGen = d3.axisLeft(yScale).ticks(TICKS_COUNT_YAXIS);
        let buffer = 0;

        // only if yAxis should not be visible
        if (!showAxis) {
            yAxisGen
                .tickFormat(() => '')
                .tickSize(0);
        }

        // draw y axis
        const axisElem = this.graph.append<SVGSVGElement>('svg:g')
            .attr('class', 'y axis')
            .call(yAxisGen);

        // only if yAxis should be visible
        if (showAxis) {
            const diagramHeight = this.height;
            let axisHeight = axisElem.node().getBBox().height;
            if (this.yaxisModifier) {
                axisHeight -= 180;
            }

            // draw y axis label
            const text = this.graph.append<SVGSVGElement>('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '1em')
                .attr('class', `yaxisTextLabel ${axis.selected ? 'selected' : ''}`)
                .text(axis.label ? (axis.uom + ' @ ' + axis.label) : axis.uom)
                .call(this.wrapText, axisHeight - 10, diagramHeight / 2, this.yaxisModifier, axis.label);

            const axisWidth = axisElem.node().getBBox().width + 10 + this.graphHelper.getDimensions(text.node()).h;

            // if yAxis should not be visible, buffer will be set to 0
            buffer = (showAxis ? axis.offset + (axisWidth < this.margin.left ? this.margin.left : axisWidth) : 0);

            const axisWidthDiv = (axisWidth < this.margin.left ? this.margin.left : axisWidth);

            if (!axis.first) {
                axisElem.attr('transform', 'translate(' + buffer + ', 0)');
            } else {
                buffer = axisWidthDiv - this.margin.left;
                axisElem.attr('transform', 'translate(' + buffer + ', 0)');
            }

            let textOff = - (this.leftOffset);
            if (axis.first) {
                textOff = this.margin.left;
            }
            text.attr('y', 0 - textOff);

            if (text) {
                const textWidth = text.node().getBBox().width;
                const textHeight = text.node().getBBox().height;
                const textPosition = {
                    x: text.node().getBBox().x,
                    y: text.node().getBBox().y
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
                            this.graphHelper.drawDatasetSign(this.graph, dataentry.options, startOfPoints.x, startOfPoints.y - pointOffset, dataentry.selected);
                        }
                        pointOffset += axisradius * 3 + (dataentry.selected ? 2 : 0);
                    }
                });

                const axisDiv = this.graph.append('rect')
                    .attr('class', `y axisDiv ${axis.selected ? 'selected' : ''}`)
                    .attr('width', axisWidthDiv)
                    .attr('height', this.height)
                    .on('mouseup', () => this.highlightLine(axis.ids));

                if (!axis.first) {
                    axisDiv.attr('x', axis.offset).attr('y', 0);
                } else {
                    axisDiv.attr('x', 0 - this.margin.left - this.maxLabelwidth).attr('y', 0);
                }

                this.observer.forEach(e => { if (e.afterYAxisDrawn) { e.afterYAxisDrawn(axis, buffer - axisWidth, axisHeight, axisWidth); } });
            }
        }

        return {
            buffer,
            yScale
        };
    }

    private drawBackground() {
        this.background = this.graph.insert<SVGSVGElement>('svg:rect', ':first-child')
            .attr('width', this.width - this.leftOffset)
            .attr('height', this.height)
            .attr('class', 'graph-background')
            .attr('fill', 'none')
            .attr('transform', 'translate(' + this.leftOffset + ', 0)');
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
                const querySelectorClip = 'clip' + this.currentTimeId;
                this.graph
                    .append('svg:clipPath')
                    .attr('class', 'diagram-path')
                    .attr('id', querySelectorClip)
                    .append('svg:rect')
                    .attr('x', this.leftOffset)
                    .attr('y', 0)
                    .attr('width', this.width - this.leftOffset)
                    .attr('height', this.height);
                // draw graph line
                this.graphBody = this.graph
                    .append('g')
                    .attr('class', 'diagram-path')
                    .attr('clip-path', 'url(#' + querySelectorClip + ')');

                if (entry.options.type === 'bar') {
                    this.drawBarChart(entry, yaxis.yScale);
                } else {
                    // draw ref value line
                    entry.referenceValueData.forEach(e => this.drawRefLineChart(e.data, e.color, entry.options.lineWidth || 1, yaxis.yScale));
                    this.drawLineChart(entry, yaxis.yScale);
                }
            }
        }
    }

    private drawRefLineChart(data: DataEntry[], color: string, width: number, yScaleBase: d3.ScaleLinear<number, number>): void {
        const line = this.createLine(this.xScaleBase, yScaleBase);

        this.graphBody
            .append('svg:path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', width)
            .attr('d', line);
    }

    private drawLineChart(entry: InternalDataEntry, yScaleBase: d3.ScaleLinear<number, number>) {
        const pointRadius = this.calculatePointRadius(entry);

        // create graph line
        const line = this.createLine(this.xScaleBase, yScaleBase);
        // draw line
        this.graphBody
            .append('svg:path')
            .datum(entry.data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-dasharray', entry.options.lineDashArray)
            .attr('stroke', entry.options.color)
            .attr('stroke-width', this.calculateLineWidth(entry))
            .attr('d', line);

        // draw line dots
        // TODO: move to service
        if (entry.options.pointSymbol) {
            let symbolType;
            const symbolSize = entry.options.pointSymbol.size * 20 || 60;
            switch (entry.options.pointSymbol.type) {
                case PointSymbolType.cross:
                    symbolType = d3.symbolCross;
                    break;
                case PointSymbolType.diamond:
                    symbolType = d3.symbolDiamond;
                    break;
                case PointSymbolType.square:
                    symbolType = d3.symbolSquare;
                    break;
                case PointSymbolType.star:
                    symbolType = d3.symbolStar;
                    break;
                case PointSymbolType.triangle:
                    symbolType = d3.symbolTriangle;
                    break;
                case PointSymbolType.wye:
                    symbolType = d3.symbolWye;
                    break;
                default:
                    break;
            }
            var symbolPathData = d3.symbol().type(symbolType).size(symbolSize)();
            this.graphBody.selectAll('.symbol')
                .data(entry.data.filter((d) => !isNaN(d.value)))
                .enter()
                .append('path')
                .attr('transform', (d) => `translate(${d.xDiagCoord},${d.yDiagCoord})`)
                .attr('stroke', entry.options.pointBorderColor)
                .attr('fill', entry.options.color)
                .attr('d', symbolPathData)

        } else {
            this.graphBody.selectAll('.graphDots')
                .data(entry.data.filter((d) => !isNaN(d.value)))
                .enter().append('circle')
                .attr('class', 'graphDots')
                .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + entry.hoverId)
                .attr('stroke', entry.options.pointBorderColor)
                .attr('stroke-width', entry.options.pointBorderWidth)
                .attr('fill', entry.options.color)
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', pointRadius);
        }

    }

    private drawBarChart(entry: InternalDataEntry, yScaleBase: d3.ScaleLinear<number, number>) {
        const paddingBefore = 0;
        const paddingAfter = 1;
        const periodInMs = entry.bar.period.asMilliseconds();

        const bars = this.graphBody.selectAll('.bar')
            .data(entry.data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('id', (d: DataEntry) => 'bar-' + d.timestamp + '-' + entry.hoverId)
            .style('fill', entry.options.color)
            .style('stroke-dasharray', entry.options.lineDashArray)
            .style('stroke', entry.options.color)
            .style('stroke-width', this.calculateLineWidth(entry))
            .style('fill-opacity', 0.5)
            .attr('x', (d: DataEntry) => this.xScaleBase(d.timestamp) + paddingBefore)
            .attr('width', (d: DataEntry) => {
                let width = 10;
                if (typeof d.value === 'number') {
                    width = this.xScaleBase(d.timestamp + periodInMs) - this.xScaleBase(d.timestamp);
                }
                return width - paddingBefore - paddingAfter;
            })
            .attr('y', (d: DataEntry) => !isNaN(d.value) ? yScaleBase(d.value) : 0)
            .attr('height', (d: DataEntry) => !isNaN(d.value) ? this.height - yScaleBase(d.value) : 0);
    }

    private createLine(xScaleBase: d3.ScaleTime<number, number>, yScaleBase: d3.ScaleLinear<number, number>) {
        return d3.line<DataEntry>()
            .defined((d) => {
                return (!isNaN(d.timestamp)) && (!isNaN(d.value));
            })
            .x((d) => {
                d.xDiagCoord = xScaleBase(d.timestamp);
                return d.xDiagCoord;
            })
            .y((d) => {
                d.yDiagCoord = yScaleBase(d.value);
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
    private wrapText(textObj: any, width: number, xposition: number, yaxisModifier: boolean, axisLabel: string): void {
        textObj.each(function (u: any, i: number, d: NodeList) {
            const bufferYaxisModifier = (yaxisModifier ? (axisLabel ? 0 : 30) : 0); // add buffer to avoid colored circles intersect with yaxismodifier symbols
            let word;
            const text = d3.select(this);
            const words = text.text().split(/\s+/).reverse();
            let line = [];
            const lineHeight = (i === d.length - 1 ? 0.3 : 1.1); // ems
            const y = text.attr('y');
            const dy = parseFloat(text.attr('dy'));
            let tspan = text.text(null).append('tspan').attr('x', 0 - xposition).attr('y', y).attr('dy', dy + 'em');
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                const node: SVGTSpanElement = <SVGTSpanElement>tspan.node();
                const hasGreaterWidth: boolean = node.getComputedTextLength() > width;
                const xyposition = xposition + (node.getComputedTextLength() / 2);
                node.setAttribute('x', '-' + '' + (xyposition + bufferYaxisModifier));
                if (hasGreaterWidth) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', 0 - xposition).attr('y', y).attr('dy', lineHeight + dy + 'em').text(word);
                    const nodeGreater: SVGTSpanElement = <SVGTSpanElement>tspan.node();
                    const xpositionGreater = xposition + (nodeGreater.getComputedTextLength());
                    nodeGreater.setAttribute('x', '-' + '' + (xpositionGreater + bufferYaxisModifier));
                }
            }
        });
    }

    /**
     * Function to generate uuid for a diagram
     */
    private uuidv4(): string {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
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

