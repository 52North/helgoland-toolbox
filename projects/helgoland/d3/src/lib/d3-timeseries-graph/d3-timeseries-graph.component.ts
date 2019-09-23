import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    IterableDiffers,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    ColorService,
    Data,
    DatasetApiInterface,
    DatasetOptions,
    DatasetPresenterComponent,
    IDataset,
    InternalDatasetId,
    InternalIdHandler,
    MinMaxRange,
    SumValuesService,
    Time,
    Timeseries,
    TimeseriesData,
    Timespan,
    TimeValueTuple,
} from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import moment, { Duration, min, unitOfTime } from 'moment';

import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { HighlightOutput } from '../model/d3-highlight';
import { D3PlotOptions, HoveringStyle } from '../model/d3-plot-options';
import { RangeCalculationsService } from './../helper/range-calculations.service';

export interface DataEntry {
    timestamp: number;
    value: number | string;
    xDiagCoord?: number;
    yDiagCoord?: number;
}

export interface InternalDataEntry {
    internalId: string;
    id?: number;
    data: DataEntry[];
    selected?: boolean;
    options: DatasetOptions;
    bar?: {
        startOf: unitOfTime.StartOf;
        period: Duration;
    };
    axisOptions: {
        uom: string;
        label?: string;
        zeroBased?: boolean;
        yAxisRange?: MinMaxRange;
        autoRangeSelection?: boolean;
        separateYAxis?: boolean;
        parameters?: {
            feature?: { id: string, label: string };
            phenomenon?: { id: string, label: string };
            offering?: { id: string, label: string };
        };
    };
    referenceValueData: {
        id: string;
        color: string;
        data: DataEntry[];
    }[];
    visible: boolean;
    focusLabelRect?: any;
    focusLabel?: any;
}

export interface DataConst extends IDataset {
    data?: Data<TimeValueTuple>;
}

export interface YRanges {
    uom: string;
    range?: MinMaxRange;
    outOfrange: boolean;
    id?: string; // necessary if grouped by internalId
    ids?: string[]; // necessary if grouped by uom
    first?: boolean;
    yScale?: d3.ScaleLinear<number, number>;
    offset?: number;
    parameters: {   // additional information for the y axis label
        feature?: { id: String, label: String };
        phenomenon?: { id: String, label: String };
        offering?: { id: String, label: String };
    };
}

export interface YAxis {
    uom: string;
    range: MinMaxRange;
    rangeFixed: boolean;
    ids: string[];
    seperate: boolean;
    selected: boolean;
    label?: string;
    first?: boolean;
    offset?: number;
    yScale?: d3.ScaleLinear<number, number>;
}

export interface YAxisSettings {
    visualRange: MinMaxRange;
    rangeFixed: boolean;
    entry: InternalDataEntry;
}

interface HighlightDataset {
    id: string;
    change: boolean;
}

export interface D3GraphObserver {
    adjustYAxis(axis: YAxis);
    afterYAxisDrawn(yaxis: YAxis, startX: number, axisHeight: number, axisWidth: number);
}

const TICKS_COUNT_YAXIS = 5;

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent
    extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions>
    implements AfterViewInit {

    @Input()
    // difference to timespan/timeInterval --> if brush, then this is the timespan of the main-diagram
    public mainTimeInterval: Timespan;

    @Output()
    public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

    @Output()
    public onClickDataPoint: EventEmitter<TimeseriesData[]> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    public highlightOutput: HighlightOutput;

    // DOM elements
    protected rawSvg: d3.Selection<SVGSVGElement, any, any, any>;
    protected graph: d3.Selection<SVGSVGElement, any, any, any>;
    protected graphFocus: any;
    protected graphBody: any;
    private dragRect: any;
    private dragRectG: any;
    private background: any;
    private copyright: any;
    private focusG: any;
    private highlightFocus: any;
    private highlightRect: any;
    private highlightText: any;
    private focuslabelTime: any;

    // options for interaction
    private dragging: boolean;
    private dragStart: [number, number];
    private dragCurrent: [number, number];
    private draggingMove: boolean;
    private dragMoveStart: number;
    private dragMoveRange: [number, number];
    private mousedownBrush: boolean;

    // data types
    protected preparedData: InternalDataEntry[] = [];
    protected preparedAxes: Map<string, YAxisSettings> = new Map();
    protected datasetMap: Map<string, DataConst> = new Map();
    protected listOfUoms: string[] = [];
    /** calculated y axes for the diagram */
    private yAxes: YAxis[] = [];
    private xAxisRange: Timespan; // x domain range
    private xAxisRangeOrigin: any = []; // x domain range
    private xAxisRangePan: [number, number]; // x domain range
    private listOfSeparation = Array();

    private xScaleBase: d3.ScaleTime<number, number>; // calculate diagram coord of x value
    private yScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of y value
    // private dotsObjects: any[];
    private labelTimestamp: number[];
    private labelXCoord: number[];
    private distLabelXCoord: number[];
    private bufferSum: number;

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
    private loadingCounter = 0;
    private loadingData: Set<string> = new Set();
    private currentTimeId: string;

    private observer: Set<D3GraphObserver> = new Set();

    // default plot options
    private plotOptions: D3PlotOptions = {
        showReferenceValues: false,
        generalizeAllways: true,
        togglePanZoom: true,
        hoverable: true,
        hoverStyle: HoveringStyle.point,
        grid: true,
        yaxis: true,
        overview: false,
        showTimeLabel: true,
        requestBeforeAfterValues: false
    };

    private lastHoverPositioning: number;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: DatasetApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected timeFormatLocaleService: D3TimeFormatLocaleService,
        protected colorService: ColorService,
        protected translateService: TranslateService,
        protected sumValues: SumValuesService,
        protected rangeCalc: RangeCalculationsService
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc, translateService);
    }

    public ngAfterViewInit(): void {
        this.currentTimeId = this.uuidv4();

        this.rawSvg = d3.select<SVGSVGElement, any>(this.d3Elem.nativeElement)
            .append<SVGSVGElement>('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append<SVGSVGElement>('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.graphFocus = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.mousedownBrush = false;
        this.plotGraph();
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
        this.plotGraph();
    }

    public reloadDataForDatasets(datasetIds: string[]): void {
        datasetIds.forEach(id => {
            if (this.datasetMap.has(id)) {
                this.loadDatasetData(this.datasetMap.get(id), true);
            }
        });
    }

    protected addDataset(id: string, url: string): void {
        this.api.getSingleTimeseries(id, url).subscribe(
            (timeseries) => this.loadAddedDataset(timeseries),
            (error) => {
                this.api.getDataset(id, url).subscribe(
                    (dataset) => this.loadAddedDataset(dataset),
                );
            }
        );
    }

    protected removeDataset(internalId: string): void {
        this.xAxisRangeOrigin = [];
        this.datasetMap.delete(internalId);
        this.preparedAxes.delete(internalId);
        let spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
        if (spliceIdx >= 0) {
            this.preparedData.splice(spliceIdx, 1);
            if (this.preparedData.length <= 0) {
            } else {
                this.preparedData.forEach((entry) => {
                    this.processData(entry);
                });
            }
            this.plotGraph();
        }
    }

    protected setSelectedId(internalId: string): void {
        const internalEntry = this.preparedData.find((e) => e.internalId === internalId);
        if (internalEntry) { internalEntry.selected = true; }
        this.plotGraph();
    }

    protected removeSelectedId(internalId: string): void {
        const internalEntry = this.preparedData.find((e) => e.internalId === internalId);
        if (internalEntry) { internalEntry.selected = false; }
        this.plotGraph();
    }

    protected presenterOptionsChanged(options: D3PlotOptions): void {
        if (this.plotOptions.hoverStyle !== HoveringStyle.point && options.hoverStyle === HoveringStyle.point) {
            d3.select('g.d3line').attr('visibility', 'visible');
        }
        Object.assign(this.plotOptions, options);
        this.plotGraph();
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
        if (!firstChange && this.datasetMap.has(internalId)) {
            this.loadDatasetData(this.datasetMap.get(internalId), false);
        }
    }

    protected timeIntervalChanges(): void {
        this.datasetMap.forEach((dataset) => {
            this.loadDatasetData(dataset, false);
        });
    }

    protected onResize(): void {
        this.plotGraph();
    }

    public centerTime(timestamp: number): void {
        const centeredTimespan = this.timeSrvc.centerTimespan(this.timespan, new Date(timestamp));
        this.onTimespanChanged.emit(centeredTimespan);
    }

    private changeTime(from: number, to: number): void {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    private loadAddedDataset(dataset: IDataset): void {
        this.datasetMap.set(dataset.internalId, dataset);
        this.loadDatasetData(dataset, false);
    }

    // load data of dataset
    private loadDatasetData(dataset: IDataset, force: boolean): void {
        const datasetOptions = this.datasetOptions.get(dataset.internalId);
        if (this.loadingCounter === 0) { this.onContentLoading.emit(true); }
        this.loadingCounter++;

        if (dataset instanceof Timeseries) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);

            this.loadingData.add(dataset.internalId);
            this.dataLoaded.emit(this.loadingData);
            this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                {
                    format: 'flot',
                    expanded: this.plotOptions.showReferenceValues || this.plotOptions.requestBeforeAfterValues,
                    generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                },
                { forceUpdate: force }
            ).subscribe(
                (result) => this.prepareData(dataset, result),
                (error) => this.onError(error),
                () => this.onCompleteLoadingData(dataset)
            );
        }
    }

    private onCompleteLoadingData(dataset: IDataset): void {
        this.loadingData.delete(dataset.internalId);
        this.dataLoaded.emit(this.loadingData);
        this.loadingCounter--;
        if (this.loadingCounter === 0) { this.onContentLoading.emit(false); }
    }

    /**
     * Function to prepare each dataset for the graph and adding it to an array of datasets.
     * @param dataset {IDataset} Object of the whole dataset
     */
    private prepareData(dataset: IDataset, data: Data<TimeValueTuple>): void {

        // add surrounding entries to the set
        if (data.valueBeforeTimespan) { data.values.unshift(data.valueBeforeTimespan); }
        if (data.valueAfterTimespan) { data.values.push(data.valueAfterTimespan); }

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
            data.values.forEach(e => console.log(moment(e[0]).toISOString()));
        }

        // generate random color, if color is not defined
        if (options.color === undefined) {
            options.color = this.colorService.getColor();
        }

        // end of check for datasets
        const dataEntry: InternalDataEntry = {
            internalId: dataset.internalId,
            id: (datasetIdx >= 0 ? datasetIdx : this.preparedData.length),
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

        let separationIdx: number = this.listOfSeparation.findIndex((id) => id === dataset.internalId);
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
        this.plotGraph();
    }

    /**
     * Function to add referencevaluedata to the dataset (e.g. mean).
     * @param internalId {String} String with the id of a dataset
     * @param styles {DatasetOptions} Object containing information for dataset styling
     * @param data {Data} Array of Arrays containing the measurement-data of the dataset
     * @param uom {String} String with the uom of a dataset
     */
    private addReferenceValueData(dataEntry: InternalDataEntry, styles: DatasetOptions, data: Data<TimeValueTuple>, uom: string): void {
        if (this.plotOptions.showReferenceValues) {
            dataEntry.referenceValueData = styles.showReferenceValues.map((refValue) => ({
                id: refValue.id,
                color: refValue.color,
                data: data.referenceValues[refValue.id].map(d => ({ timestamp: d[0], value: d[1] }))
            }));
        }
    }

    /**
     * Function that processes the data to calculate y axis range of each dataset.
     * @param entry {DataEntry} Object containing dataset related data.
     */
    protected processData(entry: InternalDataEntry): void {
        if (entry.visible) {
            let visualRange: MinMaxRange;
            let rangeFixed = false;
            // set out of yAxisRange
            if (entry.axisOptions.yAxisRange && entry.axisOptions.yAxisRange.min !== entry.axisOptions.yAxisRange.max) {
                visualRange = entry.axisOptions.yAxisRange;
                if (visualRange.min > visualRange.max) {
                    const max = visualRange.min;
                    visualRange.min = visualRange.max;
                    visualRange.min = max;
                }
                rangeFixed = true;
            } else {
                // calculate default range
                const baseDataExtent = d3.extent<DataEntry, number>(entry.data, (d) => {
                    if (typeof d.value === 'number') {
                        if (this.timespan.from <= d.timestamp && this.timespan.to >= d.timestamp) { return d.value; }
                    } else {
                        return null;
                    }
                });

                const dataExtentRafValues = entry.referenceValueData.map(e => {
                    return d3.extent<DataEntry, number>(e.data, (d) => (typeof d.value === 'number') ? d.value : null);
                });

                const rangeMin = d3.min([baseDataExtent[0], ...dataExtentRafValues.map(e => e[0])]);
                const rangeMax = d3.max([baseDataExtent[1], ...dataExtentRafValues.map(e => e[1])]);
                const dataExtent = [rangeMin, rangeMax];

                visualRange = {
                    min: dataExtent[0],
                    max: dataExtent[1]
                };
                visualRange = this.rangeCalc.bufferRange(visualRange);
            }

            // set out of zeroBasedAxis
            if (entry.axisOptions.zeroBased) {
                if (visualRange.min > 0) {
                    visualRange.min = 0;
                }
                if (visualRange.max < 0) {
                    visualRange.max = 0;
                }
            }

            this.preparedAxes.set(entry.internalId, {
                rangeFixed,
                visualRange,
                entry
            });
        }
    }

    /**
     * Function that returns the height of the graph diagram.
     */
    private calculateHeight(): number {
        return (this.d3Elem.nativeElement as HTMLElement).clientHeight - this.margin.top - this.margin.bottom + (this.plotOptions.showTimeLabel ? 0 : 20);
    }

    /**
     * Function that returns the width of the graph diagram.
     */
    private calculateWidth(): number {
        return this.rawSvg.node().width.baseVal.value - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    /**
     * Function to plot the graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    public plotGraph(): void {
        if (!this.graph || !this.rawSvg || !this.datasetIds) { return; }
        this.highlightOutput = {
            timestamp: 0,
            ids: new Map()
        };

        this.preparedData.forEach((entry) => {
            let idx: number = this.listOfUoms.findIndex((uom) => uom === entry.axisOptions.uom);
            if (idx < 0) { this.listOfUoms.push(entry.axisOptions.uom); }
        });

        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();
        this.graphFocus.selectAll('*').remove();

        this.bufferSum = 0;
        this.yScaleBase = null;

        // get range of x and y axis
        this.xAxisRange = this.timespan;

        // reset y axes
        this.yAxes = [];
        this.prepareYAxes();

        this.yAxes.forEach(axis => {
            axis.first = (this.yScaleBase === null);
            axis.offset = this.bufferSum;

            let yAxisResult = this.drawYaxis(axis);
            if (this.yScaleBase === null) {
                this.yScaleBase = yAxisResult.yScale;
                this.bufferSum = yAxisResult.buffer;
            } else {
                this.bufferSum = yAxisResult.buffer;
            }
            axis.yScale = yAxisResult.yScale;
        });

        // draw the y grid lines
        if (this.yAxes.length === 1 && this.plotOptions.grid) {
            this.graph.append('svg:g')
                .attr('class', 'grid y-grid')
                .attr('transform', 'translate(' + this.bufferSum + ', 0)')
                .call(d3.axisLeft(this.yAxes[0].yScale)
                    .ticks(TICKS_COUNT_YAXIS)
                    .tickSize(-this.width + this.bufferSum)
                    .tickFormat(() => '')
                );
        }

        if (!this.yScaleBase) {
            return;
        }

        // draw x axis
        this.drawXaxis(this.bufferSum);

        // create background as rectangle providing panning
        this.background = this.graph.append('svg:rect')
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height)
            .attr('id', 'backgroundRect')
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.bufferSum + ', 0)');

        this.drawAllCharts();
        this.addTimespanJumpButtons();

        // create background rect
        if (!this.plotOptions.overview) {
            // execute when it is not an overview diagram
            // mouse events hovering
            if (this.plotOptions.hoverable) {
                if (this.plotOptions.hoverStyle === HoveringStyle.line) {
                    this.createLineHovering();
                } else {
                    d3.select('g.d3line').attr('visibility', 'hidden');
                }
            }

            if (this.plotOptions.togglePanZoom === false) {
                this.background
                    .call(d3.zoom()
                        .on('start', this.zoomStartHandler)
                        .on('zoom', this.zoomHandler)
                        .on('end', this.zoomEndHandler)
                    );
            } else {
                this.background
                    .call(d3.drag()
                        .on('start', this.panStartHandler)
                        .on('drag', this.panMoveHandler)
                        .on('end', this.panEndHandler));
            }

            this.createCopyrightLabel();
        } else {
            // execute when it is overview diagram
            let interval: [number, number] = this.getXDomainByTimestamp();
            let overviewTimespanInterval = [interval[0], interval[1]];

            // create brush
            let brush = d3.brushX()
                .extent([[0, 0], [this.width, this.height]])
                .on('end', () => {
                    // on mouseclick change time after brush was moved
                    if (this.mousedownBrush) {
                        let timeByCoord: [number, number] = this.getTimestampByCoord(d3.event.selection[0], d3.event.selection[1]);
                        this.changeTime(timeByCoord[0], timeByCoord[1]);
                    }
                    this.mousedownBrush = false;
                });

            // add brush to svg
            this.background = this.graph.append('g')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('pointer-events', 'all')
                .attr('class', 'brush')
                .call(brush)
                .call(brush.move, overviewTimespanInterval);

            /**
             * add event to selection to prevent unnecessary re-rendering of brush
             * add style of brush selection here
             * e.g. 'fill' for color,
             * 'stroke' for borderline-color,
             * 'stroke-dasharray' for customizing borderline-style
             */
            this.background.selectAll('.selection')
                .attr('stroke', 'none')
                .on('mousedown', () => {
                    this.mousedownBrush = true;
                });

            // do not allow clear selection
            this.background.selectAll('.overlay')
                .remove();

            // add event to resizing handle to allow change time on resize
            this.background.selectAll('.handle')
                .style('fill', 'red')
                .style('opacity', 0.3)
                .attr('stroke', 'none')
                .on('mousedown', () => {
                    this.mousedownBrush = true;
                });
        }
        this.drawBackground();
    }

    protected prepareYAxes() {
        this.datasetIds.forEach(key => this.createYAxisForId(key));
    }

    protected createYAxisForId(key: string) {
        if (this.preparedAxes.has(key)) {
            // only create axis for datsets with datapoints inside selected timespan
            if (this.datasetMap.get(key).data.values.findIndex(el => el[0] >= this.timespan.from && el[0] <= this.timespan.to) >= 0) {
                const axisSettings = this.preparedAxes.get(key);
                if (axisSettings.entry.options.separateYAxis) {
                    // create sepearte axis
                    this.yAxes.push({
                        uom: axisSettings.entry.axisOptions.uom,
                        range: axisSettings.visualRange,
                        rangeFixed: axisSettings.rangeFixed,
                        selected: axisSettings.entry.selected,
                        seperate: true,
                        ids: [key],
                        label: axisSettings.entry.axisOptions.parameters.feature.label
                    });
                } else {
                    // find matching axis or add new
                    const axis = this.yAxes.find(e => e.uom.includes(axisSettings.entry.axisOptions.uom) && !e.seperate);
                    if (axis) {
                        // add id to axis
                        axis.ids.push(key);
                        // update range for axis
                        if (axisSettings.rangeFixed && axis.rangeFixed) {
                            axis.range = this.rangeCalc.mergeRanges(axis.range, axisSettings.visualRange);
                        } else if (axisSettings.rangeFixed) {
                            axis.range = axisSettings.visualRange;
                            axis.rangeFixed = true;
                        } else if (!axisSettings.rangeFixed && !axis.rangeFixed) {
                            axis.range = this.rangeCalc.mergeRanges(axis.range, axisSettings.visualRange);
                        }
                        // update selection
                        if (axis.selected) {
                            axis.selected = axisSettings.entry.selected;
                        }
                    } else {
                        this.yAxes.push({
                            uom: axisSettings.entry.axisOptions.uom,
                            range: axisSettings.visualRange,
                            seperate: false,
                            selected: axisSettings.entry.selected,
                            rangeFixed: axisSettings.rangeFixed,
                            ids: [key]
                        });
                    }
                }
            }
        }
    }

    private createLineHovering() {
        this.background
            .on('mousemove.focus', this.mousemoveHandler)
            .on('mouseout.focus', this.mouseoutHandler);
        // line inside graph
        this.highlightFocus = this.focusG.append('svg:line')
            .attr('class', 'mouse-focus-line')
            .attr('x2', '0')
            .attr('y2', '0')
            .attr('x1', '0')
            .attr('y1', '0')
            .style('stroke', 'black')
            .style('stroke-width', '1px');
        this.preparedData.forEach((entry) => {
            // label inside graph
            entry.focusLabelRect = this.focusG.append('svg:rect')
                .attr('class', 'mouse-focus-label')
                .style('fill', 'white')
                .style('stroke', 'none')
                .style('pointer-events', 'none');
            entry.focusLabel = this.focusG.append('svg:text')
                .attr('class', 'mouse-focus-label')
                .style('pointer-events', 'none')
                .style('fill', entry.options.color)
                .style('font-weight', 'lighter');
            this.focuslabelTime = this.focusG.append('svg:text')
                .style('pointer-events', 'none')
                .attr('class', 'mouse-focus-time');
        });
    }

    private clickDataPoint(d: DataEntry, entry: InternalDataEntry) {
        console.log('click point');
        if (d !== undefined) {
            const externalId: InternalDatasetId = this.datasetIdResolver.resolveInternalId(entry.internalId);
            const apiurl = externalId.url;
            const timespan: Timespan = { from: d.timestamp, to: d.timestamp };

            // request all timeseries that have data for the same offering and feature
            this.api.getTimeseries(apiurl,
                {
                    offering: entry.axisOptions.parameters.offering.id,
                    feature: entry.axisOptions.parameters.feature.id
                }).subscribe(
                    (tsArray) => {
                        const timeseries = [];
                        tsArray.forEach(ts => {
                            timeseries.push(ts.id);
                        });

                        // request ts data by timeseries ID for specific offering and feature
                        this.api.getTimeseriesData(apiurl, timeseries, timespan)
                            .subscribe(
                                (tsData) => this.onClickDataPoint.emit(tsData),
                                (error) => console.error(error)
                            );
                    },
                    (error) => console.error(error)
                );
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
                    .attr('transform', 'translate(' + this.bufferSum + ', 0)')
                    .on('click', () => this.centerTime(formerTimestamp));
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', 0 + this.bufferSum + leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', 0 + this.bufferSum + (buttonWidth - leftRight) + 'px')
                    .attr('y2', this.height / 2 - (buttonWidth - leftRight) / 2 + 'px');
                g.append('line')
                    .attr('class', 'arrow')
                    .attr('x1', 0 + this.bufferSum + leftRight + 'px')
                    .attr('y1', this.height / 2 + 'px')
                    .attr('x2', 0 + this.bufferSum + (buttonWidth - leftRight) + 'px')
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

    private createCopyrightLabel(): void {
        if (this.plotOptions.copyright) {
            let background = this.getDimensions(this.background.node());
            // default = top left
            let x = 0; // left
            let y = 0; // + this.margin.top; // top
            this.copyright = this.graph.append('g');
            let copyrightLabel = this.copyright.append('svg:text')
                .text(this.plotOptions.copyright.label)
                .attr('class', 'copyright')
                .style('pointer-events', 'none')
                .style('fill', 'grey');
            if (this.plotOptions.copyright.positionX === 'right') {
                x = background.w - this.margin.right - this.getDimensions(copyrightLabel.node()).w;
            }
            if (this.plotOptions.copyright.positionY === 'bottom') {
                y = background.h - this.margin.top * 2;
            }
            let yTransform = y + this.getDimensions(copyrightLabel.node()).h - 3;
            let xTransform = this.bufferSum + x;
            copyrightLabel
                .attr('transform', 'translate(' + xTransform + ', ' + yTransform + ')');
            this.copyright.append('svg:rect')
                .attr('class', 'copyright')
                .style('fill', 'none')
                .style('stroke', 'none')
                .style('pointer-events', 'none')
                .attr('width', this.getDimensions(copyrightLabel.node()).w)
                .attr('height', this.getDimensions(copyrightLabel.node()).h)
                .attr('transform', 'translate(' + xTransform + ', ' + y + ')');
        }
    }

    /**
     * Draws for every preprared data entry the chart.
     */
    protected drawAllCharts(): void {
        this.focusG = this.graphFocus.append('g');
        if ((this.plotOptions.hoverStyle === HoveringStyle.point) && !this.plotOptions.overview) {
            // create label for point hovering
            this.highlightRect = this.focusG.append('svg:rect');
            this.highlightText = this.focusG.append('svg:text');
        }
        this.preparedData.forEach((entry) => {
            this.drawChart(entry);
        });
    }

    /**
     * Function that calculates and returns the x diagram coordinate for the brush range
     * for the overview diagram by the selected time interval of the main diagram.
     * Calculate to get brush extent when main diagram time interval changes.
     */
    private getXDomainByTimestamp(): [number, number] {
        /**
         * calculate range of brush with timestamp and not diagram coordinates
         * formula:
         * brush_min =
         * (overview_width / (overview_max - overview_min)) * (brush_min - overview_min)
         * brus_max =
         * (overview_width / (overview_max - overview_min)) * (brush_max - overview_min)
         */

        let minOverviewTimeInterval = this.timespan.from;
        let maxOverviewTimeInterval = this.timespan.to;
        let minDiagramTimestamp = this.mainTimeInterval.from;
        let maxDiagramTimestamp = this.mainTimeInterval.to;
        let diagramWidth = this.width;

        let diffOverviewTimeInterval = maxOverviewTimeInterval - minOverviewTimeInterval;
        let divOverviewTimeWidth = diagramWidth / diffOverviewTimeInterval;
        let minCalcBrush: number = divOverviewTimeWidth * (minDiagramTimestamp - minOverviewTimeInterval);
        let maxCalcBrush: number = divOverviewTimeWidth * (maxDiagramTimestamp - minOverviewTimeInterval);

        return [minCalcBrush, maxCalcBrush];
    }

    /**
     * Function that calculates and returns the timestamp for the main diagram calculated
     * by the selected coordinate of the brush range.
     * @param minCalcBrush {Number} Number with the minimum coordinate of the selected brush range.
     * @param maxCalcBrush {Number} Number with the maximum coordinate of the selected brush range.
     */
    private getTimestampByCoord(minCalcBrush: number, maxCalcBrush: number): [number, number] {
        /**
         * calculate range of brush with timestamp and not diagram coordinates
         * formula:
         * minDiagramTimestamp =
         * ((minCalcBrush / overview_width) * (overview_max - overview_min)) + overview_min
         * maxDiagramTimestamp =
         * ((maxCalcBrush / overview_width) * (overview_max - overview_min)) + overview_min
         */

        let minOverviewTimeInterval = this.timespan.from;
        let maxOverviewTimeInterval = this.timespan.to;
        let diagramWidth = this.width;

        let diffOverviewTimeInterval = maxOverviewTimeInterval - minOverviewTimeInterval;
        let minDiagramTimestamp: number = ((minCalcBrush / diagramWidth) * diffOverviewTimeInterval) + minOverviewTimeInterval;
        let maxDiagramTimestamp: number = ((maxCalcBrush / diagramWidth) * diffOverviewTimeInterval) + minOverviewTimeInterval;

        return [minDiagramTimestamp, maxDiagramTimestamp];
    }

    /**
     * Function that draws the x axis to the svg element.
     * @param bufferXrange {Number} Number with the distance between left edge and the beginning of the graph.
     */
    private drawXaxis(bufferXrange: number): void {
        // range for x axis scale
        this.xScaleBase = d3.scaleTime()
            .domain([new Date(this.xAxisRange.from), new Date(this.xAxisRange.to)])
            .range([bufferXrange, this.width]);

        let xAxis = d3.axisBottom(this.xScaleBase)
            .tickFormat(d => {
                const date = new Date(d.valueOf());

                const formatMillisecond = '.%L',
                    formatSecond = ':%S',
                    formatMinute = '%H:%M',
                    formatHour = '%H:%M',
                    formatDay = '%b %d',
                    formatWeek = '%b %d',
                    formatMonth = '%B',
                    formatYear = '%Y';

                const format = d3.timeSecond(date) < date ? formatMillisecond
                    : d3.timeMinute(date) < date ? formatSecond
                        : d3.timeHour(date) < date ? formatMinute
                            : d3.timeDay(date) < date ? formatHour
                                : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                                    : d3.timeYear(date) < date ? formatMonth
                                        : formatYear;
                return this.timeFormatLocaleService.getTimeLocale(format)(new Date(d.valueOf()));
            });

        this.graph.append('g')
            .attr('class', 'x axis bottom')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

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
        this.graph.append('svg:g')
            .attr('class', 'x axis top')
            .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0));

        // draw right axis as border
        this.graph.append('svg:g')
            .attr('class', 'y axis right')
            .attr('transform', 'translate(' + this.width + ',0)')
            .call(d3.axisRight(this.yScaleBase).tickFormat(() => '').tickSize(0));

        // text label for the x axis
        if (this.plotOptions.showTimeLabel) {
            this.graph.append('text')
                .attr('x', (this.width + bufferXrange) / 2)
                .attr('y', this.height + this.margin.bottom - 5)
                .style('text-anchor', 'middle')
                .text('time');
        }
    }

    /**
     * Function to draw the y axis for each dataset.
     * Each uom has its own axis.
     * @param axis {DataEntry} Object containing a dataset.
     */
    private drawYaxis(axis: YAxis) {
        let showAxis = (this.plotOptions.overview ? false : (this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis));

        this.observer.forEach(e => e.adjustYAxis(axis));

        // adjust to default extend
        axis.range = this.rangeCalc.setDefaultExtendIfUndefined(axis.range);

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
            const axisHeight = axisElem.node().getBBox().height;
            // draw y axis label
            const text = this.graph.append<SVGSVGElement>('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '1em')
                .attr('class', `yaxisTextLabel ${axis.selected ? 'selected' : ''}`)
                .text(axis.label ? (axis.uom + ' @ ' + axis.label) : axis.uom)
                .call(this.wrapText, axisHeight - 10, this.height / 2);

            const axisWidth = axisElem.node().getBBox().width + 10 + this.getDimensions(text.node()).h;

            // if yAxis should not be visible, buffer will be set to 0
            buffer = (showAxis ? axis.offset + (axisWidth < this.margin.left ? this.margin.left : axisWidth) : 0);

            // console.log(`Axis size offset: ${buffer}, height: ${axisHeight}, width: ${axisWidth} with ${axis.uom}`);
            const axisWidthDiv = (axisWidth < this.margin.left ? this.margin.left : axisWidth);

            if (!axis.first) {
                axisElem.attr('transform', 'translate(' + buffer + ', 0)');
            } else {
                buffer = axisWidthDiv - this.margin.left;
                axisElem.attr('transform', 'translate(' + buffer + ', 0)');
            }

            let textOff = - (this.bufferSum);
            if (axis.first) {
                textOff = this.margin.left;
            }
            text.attr('y', 0 - textOff);

            if (text) {
                let textWidth = text.node().getBBox().width;
                let textHeight = text.node().getBBox().height;
                let textPosition = {
                    x: text.node().getBBox().x,
                    y: text.node().getBBox().y
                };
                let axisradius = 4;
                let startOfPoints = {
                    x: textPosition.y + textHeight / 2 + axisradius / 2, // + 2 because radius === 4
                    y: Math.abs(textPosition.x + textWidth) - axisradius * 2
                };
                let pointOffset = 0;

                axis.ids.forEach((entryID) => {
                    let dataentry = this.preparedData.find(el => el.internalId === entryID);
                    if (dataentry) {
                        if (dataentry.options.type) {
                            const circleRadius = axisradius + (dataentry.selected ? 2 : 0);
                            if (dataentry.options.lineWidth > 0) {
                                this.graph.append('line')
                                    .attr('class', 'y-axis-line')
                                    .attr('id', 'axisdot-line-' + entryID)
                                    .attr('stroke', dataentry.options.color)
                                    .attr('fill', dataentry.options.color)
                                    .attr('x1', startOfPoints.x - circleRadius * 2)
                                    .attr('y1', startOfPoints.y - pointOffset)
                                    .attr('x2', startOfPoints.x + circleRadius * 2)
                                    .attr('y2', startOfPoints.y - pointOffset)
                                    .attr('stroke-width', dataentry.options.lineWidth + (dataentry.selected ? 2 : 0));
                            }
                            if (dataentry.options.pointRadius > 0) {
                                this.graph.append('circle')
                                    .attr('class', 'y-axis-circle')
                                    .attr('id', 'axisdot-circle-' + entryID)
                                    .attr('stroke', dataentry.options.color)
                                    .attr('fill', dataentry.options.color)
                                    .attr('cx', startOfPoints.x)
                                    .attr('cy', startOfPoints.y - pointOffset)
                                    .attr('r', dataentry.options.pointRadius + (dataentry.selected ? 2 : 0));
                            }
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

                this.observer.forEach(e => e.afterYAxisDrawn(axis, buffer - axisWidth, axisHeight, axisWidth));
            }
        }

        return {
            buffer,
            yScale
        };
    }

    private drawBackground() {
        this.background = this.graph.insert('svg:rect', ':first-child')
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height)
            .attr('class', 'graph-background')
            .attr('fill', 'none')
            .attr('transform', 'translate(' + this.bufferSum + ', 0)');
    }

    /**
     * Function to set selected Ids that should be highlighted.
     * @param ids {Array} Array of Strings containing the Ids.
     */
    private highlightLine(ids: string[]): void {
        let changeFalse: HighlightDataset[] = [];
        let changeTrue: HighlightDataset[] = [];
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
        this.plotGraph();
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
                let querySelectorClip = 'clip' + this.currentTimeId;
                this.graph
                    .append('svg:clipPath')
                    .attr('id', querySelectorClip)
                    .append('svg:rect')
                    .attr('x', this.bufferSum)
                    .attr('y', 0)
                    .attr('width', this.width - this.bufferSum)
                    .attr('height', this.height);
                // draw graph line
                this.graphBody = this.graph
                    .append('g')
                    .attr('clip-path', 'url(#' + querySelectorClip + ')');

                if (entry.options.type === 'bar') {
                    this.drawBarChart(entry, yaxis.yScale);
                } else {
                    // draw ref value line
                    entry.referenceValueData.forEach(e => this.drawRefLineChart(e.data, e.color, 1, yaxis.yScale));
                    this.drawLineChart(entry, yaxis.yScale);
                }
            }
        }
    }

    /**
     * Function that shows labeling via mousmove.
     */
    private mousemoveHandler = (): void => {
        const coords = d3.mouse(this.background.node());
        this.labelTimestamp = [];
        this.labelXCoord = [];
        this.distLabelXCoord = [];
        this.preparedData.forEach((entry, entryIdx) => {
            const idx = this.getItemForX(coords[0] + this.bufferSum, entry.data);
            this.showDiagramIndicator(entry, idx, coords[0], entryIdx);
        });

        let outputIds: string[] = [];
        for (const key in this.highlightOutput.ids) {
            if (this.highlightOutput.ids.hasOwnProperty(key)) {
                outputIds.push(key);
            }
        }

        if (outputIds.length <= 0) {
            // do not show line in graph when no data available for timestamp
            this.focusG.style('visibility', 'hidden');
        } else {
            let last = 0,
                visible = false,
                first = true,
                labelArray: [d3.BaseType, d3.BaseType][] = [],
                textRectArray: d3.BaseType[] = d3.selectAll('.focus-visibility').nodes();

            // get and sort all text labels and rectangle of the text labels and combine related
            for (let i = 0; i < textRectArray.length; i += 2) {
                labelArray.push([textRectArray[i], textRectArray[i + 1]]);
            }
            // sory by y coordinate
            labelArray.sort((a, b) => parseFloat(d3.select(a[0]).attr('y')) - parseFloat(d3.select(b[0]).attr('y')));

            // translate if overlapping
            labelArray.forEach((el) => {
                // pairs of 2 objects (rectangle (equal) and label (odd))
                d3.select(el[0])
                    .attr('transform', (d, i, f) => {
                        if (d3.select(el[0]).attr('visibility') !== 'hidden') {
                            visible = true;
                            let ycoord: number = parseFloat(d3.select(el[0]).attr('y'));
                            let offset = 0;
                            if (!first) {
                                offset = Math.max(0, (last + 30) - ycoord);
                                if (offset < 10) { offset = 10; }
                            }
                            if (offset > 0) {
                                return 'translate(0, ' + offset + ')';
                            }
                        }
                        return 'translate(0, 0)';
                    });

                d3.select(el[1])
                    .attr('transform', (d, i, f) => {
                        if (d3.select(el[1]).attr('visibility') !== 'hidden') {
                            visible = true;
                            let ycoord: number = parseFloat(d3.select(el[0]).attr('y'));
                            let offset = 0;
                            if (!first) {
                                offset = Math.max(0, (last + 30) - ycoord);
                                if (offset < 10) { offset = 10; }
                            }
                            last = offset + ycoord;
                            if (offset > 0) {
                                return 'translate(0, ' + offset + ')';
                            }
                        }
                        return 'translate(0, 0)';
                    });

                if (visible) {
                    first = false;
                }

            });
        }
        this.onHighlightChanged.emit(this.highlightOutput);
    }

    /**
     * Function that hides the labeling inside the graph.
     */
    private mouseoutHandler = (): void => {
        this.hideDiagramIndicator();
    }

    /**
     * Function starting the drag handling for the diagram.
     */
    private panStartHandler = (): void => {
        this.draggingMove = false;
        this.dragMoveStart = d3.event.x;
        this.dragMoveRange = [this.xAxisRange.from, this.xAxisRange.to];
    }

    /**
     * Function that controlls the panning (dragging) of the graph.
     */
    private panMoveHandler = (): void => {
        this.draggingMove = true;
        if (this.dragMoveStart && this.draggingMove) {
            let diff = -(d3.event.x - this.dragMoveStart); // d3.event.subject.x);
            let amountTimestamp = this.dragMoveRange[1] - this.dragMoveRange[0];
            let ratioTimestampDiagCoord = amountTimestamp / this.width;
            let newTimeMin = this.dragMoveRange[0] + (ratioTimestampDiagCoord * diff);
            let newTimeMax = this.dragMoveRange[1] + (ratioTimestampDiagCoord * diff);

            this.xAxisRangePan = [newTimeMin, newTimeMax];
            this.timespan = { from: this.xAxisRangePan[0], to: this.xAxisRangePan[1] };
            this.plotGraph();
        }
    }

    /**
     * Function that ends the dragging control.
     */
    private panEndHandler = (): void => {
        if (this.xAxisRangePan) {
            this.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
            this.plotGraph();
            this.dragMoveStart = null;
            this.draggingMove = false;
            this.xAxisRangePan = null;
        }
    }

    /**
     * Function that starts the zoom handling.
     */
    private zoomStartHandler = (): void => {
        this.dragging = false;
        // dependent on point or line hovering
        this.dragStart = d3.mouse(this.background.node());
        this.xAxisRangeOrigin.push([this.xAxisRange.from, this.xAxisRange.to]);
    }

    /**
     * Function that draws a rectangle when zoom is started and the mouse is moving.
     */
    private zoomHandler = (): void => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    /**
     * Function that ends the zoom handling and calculates the via zoom selected time interval.
     */
    private zoomEndHandler = (): void => {
        if (!this.dragStart || !this.dragging) {
            if (this.xAxisRangeOrigin[0]) {
                // back to origin range (from - to)
                this.changeTime(this.xAxisRangeOrigin[0][0], this.xAxisRangeOrigin[0][1]);
                this.xAxisRangeOrigin = [];
                this.plotGraph();
            }
        } else {
            let xDomainRange;
            if (this.dragStart[0] <= this.dragCurrent[0]) {
                xDomainRange = this.getxDomain(this.dragStart[0], this.dragCurrent[0]);
            } else {
                xDomainRange = this.getxDomain(this.dragCurrent[0], this.dragStart[0]);
            }
            this.xAxisRange = { from: xDomainRange[0], to: xDomainRange[1] };
            this.changeTime(this.xAxisRange.from, this.xAxisRange.to);
            this.plotGraph();
        }
        this.dragStart = null;
        this.dragging = false;
        this.resetDrag();
    }

    private drawRefLineChart(data: DataEntry[], color: string, width: number, yScaleBase: d3.ScaleLinear<number, number>): void {
        let line = this.createLine(this.xScaleBase, yScaleBase);

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
        let line = this.createLine(this.xScaleBase, yScaleBase);
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
        this.graphBody.selectAll('.graphDots')
            .data(entry.data.filter((d) => typeof d.value === 'number'))
            .enter().append('circle')
            .attr('class', 'graphDots')
            .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + entry.id)
            .attr('stroke', entry.options.pointBorderColor)
            .attr('stroke-width', entry.options.pointBorderWidth)
            .attr('fill', entry.options.color)
            .attr('cx', line.x())
            .attr('cy', line.y())
            .attr('r', pointRadius);

        if (this.plotOptions.hoverStyle === HoveringStyle.point && !this.plotOptions.overview) {
            this.graphBody.selectAll('.hoverDots')
                .data(entry.data.filter((d) => typeof d.value === 'number'))
                .enter().append('circle')
                .attr('class', 'hoverDots')
                .attr('id', (d: DataEntry) => 'hover-dot-' + d.timestamp + '-' + entry.id)
                .attr('stroke', 'transparent')
                .attr('fill', 'transparent')
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', pointRadius + 3)
                .on('mouseover', (d: DataEntry) => this.mouseOverPointHovering(d, entry))
                .on('mouseout', (d: DataEntry) => this.mouseOutPointHovering(d, entry))
                .on('mousedown', (d: DataEntry) => this.clickDataPoint(d, entry));
        }
    }

    private drawBarChart(entry: InternalDataEntry, yScaleBase: d3.ScaleLinear<number, number>) {
        const paddingBefore = 0;
        const paddingAfter = 5;
        const periodInMs = entry.bar.period.asMilliseconds();

        const bars = this.graphBody.selectAll('.bar')
            .data(entry.data)
            .enter().append('rect')
            .attr('class', 'bar')
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
            .attr('y', (d: DataEntry) => typeof d.value === 'number' ? yScaleBase(d.value) : 0)
            .attr('height', (d: DataEntry) => (typeof d.value === 'number') ? this.height - yScaleBase(d.value) : 0);

        if (this.plotOptions.hoverStyle === HoveringStyle.point) {
            bars
                .on('mouseover', (d: { value: number, timestamp: number }, idx: number, rectElems: any[]) => this.mouseoverBarHovering(d, rectElems, idx, entry))
                .on('mousemove', (d: { value: number, timestamp: number }) => this.mousemoveBarHovering(d, entry))
                .on('mouseout', (d: { value: number, timestamp: number }, idx: number, rectElems: any[]) => this.mouseoutBarHovering(d, rectElems, idx, entry));
        }
    }

    private hideHoveringLabel() {
        if (this.highlightRect) { this.highlightRect.style('visibility', 'hidden'); }
        if (this.highlightText) { this.highlightText.style('visibility', 'hidden'); }
    }

    private showHoveringLabel() {
        if (this.highlightRect) { this.highlightRect.style('visibility', 'visible'); }
        if (this.highlightText) { this.highlightText.style('visibility', 'visible'); }
    }

    private mouseoverBarHovering(d: { value: number; timestamp: number; }, rectElems: any[], idx: number, entry: InternalDataEntry) {
        if (d !== undefined) {
            let coords = d3.mouse(this.background.node());
            let xCoord = coords[0];
            let yCoord = coords[1];
            let rectBack = this.background.node().getBBox();
            if (xCoord >= 0 && xCoord <= rectBack.width && yCoord >= 0 && yCoord <= rectBack.height) {
                // highlight bar
                d3.select(rectElems[idx]).style('stroke-width', this.calculateLineWidth(entry) + 2);

                this.showHoveringLabel();

                this.setHoveringLabel(d.value, d.timestamp, entry.axisOptions.uom);

                this.positioningHoverLabel(xCoord, yCoord, entry.options.color);
                // generate output of highlighted data
                this.highlightOutput = {
                    timestamp: d.timestamp,
                    ids: new Map().set(entry.internalId, { timestamp: d.timestamp, value: d.value })
                };
                this.onHighlightChanged.emit(this.highlightOutput);
            }
        }
    }

    private mousemoveBarHovering(d: { value: number; timestamp: number; }, entry: InternalDataEntry) {
        const temp = new Date().getTime();
        if (d !== undefined && (temp - this.lastHoverPositioning > 50)) {
            let coords = d3.mouse(this.background.node());
            let xCoord = coords[0];
            let yCoord = coords[1];
            this.positioningHoverLabel(xCoord, yCoord, entry.options.color);
        }
    }

    private mouseoutBarHovering(d: { value: number; timestamp: number; }, rectElems: any[], idx: number, entry: InternalDataEntry) {
        if (d !== undefined) {
            // unhighlight hovered dot
            d3.select(rectElems[idx])
                .style('stroke-width', this.calculateLineWidth(entry));
            // make label invisible
            this.hideHoveringLabel();
        }
    }

    private positioningHoverLabel(x: number, y: number, color: string) {
        let onLeftSide = false;
        if ((this.background.node().getBBox().width + this.bufferSum) / 2 > x) {
            onLeftSide = true;
        }
        let rectX: number = x + 15;
        let rectY: number = y;
        let rectW: number = this.getDimensions(this.highlightText.node()).w + 8;
        let rectH: number = this.getDimensions(this.highlightText.node()).h;
        if (!onLeftSide) {
            rectX = x - 15 - rectW;
            rectY = y;
        }
        if ((y + rectH + 4) > this.background.node().getBBox().height) {
            rectY = rectY - rectH;
        }
        // create hovering label
        let dotRectangle = this.highlightRect
            .attr('class', 'mouseHoverDotRect')
            .style('fill', 'white')
            .style('fill-opacity', 1)
            .style('stroke', color)
            .style('stroke-width', '1px')
            .style('pointer-events', 'none')
            .attr('width', rectW)
            .attr('height', rectH)
            .attr('transform', 'translate(' + rectX + ', ' + rectY + ')');
        let labelX: number = x + 4 + 15;
        let labelY: number = y + this.getDimensions(dotRectangle.node()).h - 4;
        if (!onLeftSide) {
            labelX = x - rectW + 4 - 15;
            labelY = y + this.getDimensions(dotRectangle.node()).h - 4;
        }
        if ((y + rectH + 4) > this.background.node().getBBox().height) {
            labelY = labelY - rectH;
        }
        this.highlightText.attr('transform', 'translate(' + labelX + ', ' + labelY + ')');
        this.lastHoverPositioning = new Date().getTime();
    }

    private createLine(xScaleBase: d3.ScaleTime<number, number>, yScaleBase: d3.ScaleLinear<number, number>) {
        return d3.line<DataEntry>()
            .defined((d) => typeof d.timestamp === 'number' && typeof d.value === 'number')
            .x((d) => {
                const xDiagCoord = xScaleBase(d.timestamp);
                if (!isNaN(xDiagCoord)) {
                    d.xDiagCoord = xDiagCoord;
                    return xDiagCoord;
                }
            })
            .y((d) => {
                if (typeof d.value === 'number') {
                    const yDiagCoord = yScaleBase(d.value);
                    if (!isNaN(yDiagCoord)) {
                        d.yDiagCoord = yDiagCoord;
                        return yDiagCoord;
                    } else {
                        // return value to avoid error with NaN in linepath while drag and drop in Google Chrome
                        return 0;
                    }
                }
            })
            .curve(d3.curveLinear);
    }

    private mouseOverPointHovering(d: DataEntry, entry: InternalDataEntry) {
        if (d !== undefined) {
            let coords = d3.mouse(this.background.node());
            let xCoord = coords[0];
            let yCoord = coords[1];
            let rectBack = this.background.node().getBBox();
            if (coords[0] >= 0 && coords[0] <= rectBack.width && coords[1] >= 0 && coords[1] <= rectBack.height) {
                // highlight hovered dot
                d3.select('#dot-' + d.timestamp + '-' + entry.id)
                    .attr('opacity', 0.8)
                    .attr('r', this.calculatePointRadius(entry) + 3);

                this.showHoveringLabel();

                this.setHoveringLabel(d.value, d.timestamp, entry.axisOptions.uom);

                this.positioningHoverLabel(xCoord, yCoord, entry.options.color);

                this.highlightOutput = {
                    timestamp: d.timestamp,
                    ids: new Map().set(entry.internalId, { timestamp: d.timestamp, value: d.value })
                };
                this.onHighlightChanged.emit(this.highlightOutput);
            }
        }
    }

    private setHoveringLabel(value: number | string, timestamp: number, uom: string) {
        let stringedValue = (typeof value === 'number') ? parseFloat(value.toPrecision(15)).toString() : value;
        this.highlightText
            .text(`${stringedValue} ${uom} ${moment(timestamp).format('DD.MM.YY HH:mm')}`)
            .attr('class', 'mouseHoverDotLabel')
            .style('pointer-events', 'none')
            .style('fill', 'black');
    }

    private mouseOutPointHovering(d: DataEntry, entry: InternalDataEntry) {
        if (d !== undefined) {
            // unhighlight hovered dot
            d3.select('#dot-' + d.timestamp + '-' + entry.id)
                .attr('opacity', 1)
                .attr('r', this.calculatePointRadius(entry));
            this.hideHoveringLabel();
        }
    }

    /**
     * Function that returns the timestamp of provided x diagram coordinates.
     * @param start {Number} Number with the minimum diagram coordinate.
     * @param end {Number} Number with the maximum diagram coordinate.
     */
    private getxDomain(start: number, end: number): [number, number] {
        let domMinArr = [];
        let domMaxArr = [];
        let domMin: number;
        let domMax: number;
        let tmp;
        let lowestMin = Number.POSITIVE_INFINITY;
        let lowestMax = Number.POSITIVE_INFINITY;

        start += this.bufferSum;
        end += this.bufferSum;

        this.preparedData.forEach((entry) => {
            domMinArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord) {
                    if (elem.xDiagCoord >= start) {
                        return array[index] !== undefined;
                    }
                }
            }));
            domMaxArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord >= end) {
                    return array[index] !== undefined;
                }
            }));
        });

        for (let i = 0; i <= domMinArr.length - 1; i++) {
            if (domMinArr[i] != null) {
                tmp = domMinArr[i].xDiagCoord;
                if (tmp < lowestMin) {
                    lowestMin = tmp;
                    domMin = domMinArr[i].timestamp;
                }
            }
        }
        for (let j = 0; j <= domMaxArr.length - 1; j++) {
            if (domMaxArr[j] != null) {
                tmp = domMaxArr[j].xDiagCoord;
                if (tmp < lowestMax) {
                    lowestMax = tmp;
                    domMax = domMaxArr[j].timestamp;
                }
            }
        }
        return [domMin, domMax];
    }

    /**
     * Function that configurates and draws the rectangle.
     */
    private drawDragRectangle(): void {
        if (!this.dragStart) { return; }
        this.dragCurrent = d3.mouse(this.background.node());

        const x1 = Math.min(this.dragStart[0], this.dragCurrent[0]);
        const x2 = Math.max(this.dragStart[0], this.dragCurrent[0]);

        if (!this.dragRect && !this.dragRectG) {

            this.dragRectG = this.graph.append('g')
                .style('fill-opacity', .2)
                .style('fill', 'blue');

            this.dragRect = this.dragRectG.append('rect')
                .attr('width', x2 - x1)
                .attr('height', this.height)
                .attr('x', x1 + this.bufferSum)
                .attr('class', 'mouse-drag')
                .style('pointer-events', 'none');
        } else {
            this.dragRect.attr('width', x2 - x1)
                .attr('x', x1 + this.bufferSum);
        }
    }

    /**
     * Function that disables the drawing rectangle control.
     */
    private resetDrag(): void {
        if (this.dragRectG) {
            this.dragRectG.remove();
            this.dragRectG = null;
            this.dragRect = null;
        }
    }

    /**
     * Function that returns the metadata of a specific entry in the dataset.
     * @param x {Number} Coordinates of the mouse inside the diagram.
     * @param data {DataEntry} Array with the data of each dataset entry.
     */
    private getItemForX(x: number, data: DataEntry[]): number {
        const index = this.xScaleBase.invert(x);
        const bisectDate = d3.bisector((d: DataEntry) => d.timestamp).left;
        return bisectDate(data, index);
    }

    /**
     * Function that disables the labeling.
     */
    private hideDiagramIndicator(): void {
        this.focusG.style('visibility', 'hidden');
        d3.selectAll('.focus-visibility')
            .attr('visibility', 'hidden');
    }

    /**
     * Function that enables the lableing of each dataset entry.
     * @param entry {InternalDataEntry} Object containing the dataset.
     * @param idx {Number} Number with the position of the dataset entry in the data array.
     * @param xCoordMouse {Number} Number of the x coordinate of the mouse.
     * @param entryIdx {Number} Number of the index of the entry.
     */
    private showDiagramIndicator = (entry: InternalDataEntry, idx: number, xCoordMouse: number, entryIdx: number): void => {
        const item: DataEntry = entry.data[idx];
        this.labelXCoord[entryIdx] = null;
        this.distLabelXCoord[entryIdx] = null;

        if (item !== undefined && item.yDiagCoord && item.value !== undefined) {
            // create line where mouse is
            this.focusG.style('visibility', 'visible');
            // show label if data available for time
            this.chVisLabel(entry, true, entryIdx);

            let xMouseAndBuffer = xCoordMouse + this.bufferSum;
            let labelBuffer = ((this.timespan.from / (this.timespan.to - this.timespan.from)) * 0.0001)
                * ((this.timespan.from / (this.timespan.to - this.timespan.from)) * 0.0001);

            labelBuffer = Math.max(10, labelBuffer);

            this.showLabelValues(entry, item);
            this.showTimeIndicatorLabel(item, entryIdx, xMouseAndBuffer);

            if (item.xDiagCoord >= this.background.node().getBBox().width + this.bufferSum || xMouseAndBuffer < item.xDiagCoord - labelBuffer) {
                this.chVisLabel(entry, false, entryIdx);
            }

            if (xMouseAndBuffer < item.xDiagCoord) {
                if (entry.data[idx - 1] && (Math.abs(entry.data[idx - 1].xDiagCoord - xMouseAndBuffer) < Math.abs(item.xDiagCoord - xMouseAndBuffer))) {
                    this.chVisLabel(entry, false, entryIdx);
                    // show closest element to mouse
                    this.showLabelValues(entry, entry.data[idx - 1]);
                    this.showTimeIndicatorLabel(entry.data[idx - 1], entryIdx, xMouseAndBuffer);
                    this.chVisLabel(entry, true, entryIdx);

                    // check for graph width and range between data point and mouse
                    if (entry.data[idx - 1].xDiagCoord >= this.background.node().getBBox().width + this.bufferSum
                        || entry.data[idx - 1].xDiagCoord <= this.bufferSum
                        || entry.data[idx - 1].xDiagCoord + labelBuffer < xMouseAndBuffer) {
                        this.chVisLabel(entry, false, entryIdx);
                    }
                }
            }
        } else {
            // TODO: set hovering for labelbuffer after last and before first value of the graph
            // hide label if no data available for time
            this.chVisLabel(entry, false, entryIdx);
        }
    }

    /**
     * Function to change visibility of label and white rectangle inside graph (next to mouse-cursor line).
     * @param entry {DataEntry} Object containing the dataset.
     * @param visible {Boolean} Boolean giving information about visibility of a label.
     */
    private chVisLabel(entry: InternalDataEntry, visible: boolean, entryIdx: number): void {
        if (visible) {
            entry.focusLabel
                .attr('visibility', 'visible')
                .attr('class', 'focus-visibility');
            entry.focusLabelRect
                .attr('visibility', 'visible')
                .attr('class', 'focus-visibility');
        } else {
            entry.focusLabel
                .attr('visibility', 'hidden');
            entry.focusLabelRect
                .attr('visibility', 'hidden');

            this.labelTimestamp[entryIdx] = null;
            delete this.highlightOutput.ids[entry.internalId];
        }
    }

    /**
     * Function to show the labeling inside the graph.
     * @param entry {DataEntry} Object containg the dataset.
     * @param item {DataEntry} Object of the entry in the dataset.
     */
    private showLabelValues(entry: InternalDataEntry, item: DataEntry): void {
        let onLeftSide: boolean = this.checkLeftSide(item.xDiagCoord);
        if (entry.focusLabel) {
            entry.focusLabel.text(item.value + (entry.axisOptions.uom ? entry.axisOptions.uom : ''));
            const entryX: number = onLeftSide ?
                item.xDiagCoord + 4 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w + 4;
            entry.focusLabel
                .attr('x', entryX)
                .attr('y', item.yDiagCoord);
            entry.focusLabelRect
                .attr('x', entryX)
                .attr('y', item.yDiagCoord - this.getDimensions(entry.focusLabel.node()).h + 3)
                .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                .attr('height', this.getDimensions(entry.focusLabel.node()).h);

            this.highlightOutput.ids[entry.internalId] = {
                'timestamp': item.timestamp,
                'value': item.value
            };
        } else {
            delete this.highlightOutput.ids[entry.internalId];
        }
    }

    /**
     * Function to show the time labeling inside the graph.
     * @param item {DataEntry} Object of the entry in the dataset.
     * @param entryIdx {Number} Number of the index of the entry.
     */
    private showTimeIndicatorLabel(item: DataEntry, entryIdx: number, mouseCoord: number): void {
        // timestamp is the time where the mouse-cursor is
        this.labelTimestamp[entryIdx] = item.timestamp;
        this.labelXCoord[entryIdx] = item.xDiagCoord;
        this.distLabelXCoord[entryIdx] = Math.abs(mouseCoord - item.xDiagCoord);
        let minXcoord = d3.min(this.distLabelXCoord);
        let idxOfMin = this.distLabelXCoord.findIndex((elem) => elem === minXcoord);
        let onLeftSide = this.checkLeftSide(item.xDiagCoord);
        let right = this.labelXCoord[idxOfMin] + 2;
        let left = this.labelXCoord[idxOfMin] - this.getDimensions(this.focuslabelTime.node()).w - 2;
        this.focuslabelTime.text(moment(this.labelTimestamp[idxOfMin]).format('DD.MM.YY HH:mm'));
        this.focuslabelTime
            .attr('x', onLeftSide ? right : left)
            .attr('y', 13);
        this.highlightFocus
            .attr('x1', this.labelXCoord[idxOfMin])
            .attr('y1', 0)
            .attr('x2', this.labelXCoord[idxOfMin])
            .attr('y2', this.height)
            .classed('hidden', false);
        this.highlightOutput.timestamp = this.labelTimestamp[idxOfMin];
    }

    /**
     * Function giving information if the mouse is on left side of the diagram.
     * @param itemCoord {number} x coordinate of the value (e.g. mouse) to be checked
     */
    private checkLeftSide(itemCoord: number): boolean {
        return ((this.background.node().getBBox().width + this.bufferSum) / 2 > itemCoord) ? true : false;
    }

    /**
     * Function to wrap the text for the y axis label.
     * @param text {any} y axis label
     * @param width {Number} width of the axis which must not be crossed
     * @param xposition {Number} position to center the label in the middle
     */
    private wrapText(textObj: any, width: number, xposition: number): void {
        textObj.each(function (u: any, i: number, d: NodeList) {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                // lineNumber = 0,
                lineHeight = (i === d.length - 1 ? 0.3 : 1.1), // ems
                y = text.attr('y'),
                dy = parseFloat(text.attr('dy')),
                tspan = text.text(null).append('tspan').attr('x', 0 - xposition).attr('y', y).attr('dy', dy + 'em');
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                let node: SVGTSpanElement = <SVGTSpanElement>tspan.node();
                let hasGreaterWidth: boolean = node.getComputedTextLength() > width;
                if (hasGreaterWidth) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', 0 - xposition).attr('y', y).attr('dy', lineHeight + dy + 'em').text(word);
                }
            }
        });
    }

    /**
     * Function that returns the boundings of a html element.
     * @param el {Object} Object of the html element.
     */
    private getDimensions(el: any): { w: number, h: number } {
        let w = 0;
        let h = 0;
        if (el) {
            const dimensions = el.getBBox();
            w = dimensions.width;
            h = dimensions.height;
        } else {
            console.log('error: getDimensions() ' + el + ' not found.');
        }
        return {
            w,
            h
        };
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

    /**
     * Function that logs the error in the console.
     * @param error {Object} Object with the error.
     */
    private onError(error: any): void {
        console.error(error);
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

