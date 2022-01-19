import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    IterableDiffer,
    IterableDiffers,
    KeyValueDiffer,
    KeyValueDiffers,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Time, Timespan, TimezoneService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import moment, { duration, unitOfTime } from 'moment';
import { Subscription } from 'rxjs/internal/Subscription';

import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3GraphId } from '../helper/d3-graph-id.service';
import { D3Graphs } from '../helper/d3-graphs.service';
import { D3PointSymbolDrawerService } from '../helper/d3-point-symbol-drawer.service';
import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { D3HoveringService } from '../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../helper/hovering/d3-simple-hovering.service';
import { RangeCalculationsService } from '../helper/range-calculations.service';
import { DataEntry, YAxis, YAxisSettings } from '../model/d3-general';
import { D3GraphInterface } from './d3-graph.interface';
import { D3GraphExtent, D3GraphObserver } from './d3-series-graph-control';
import { HighlightOutput } from './models/d3-highlight';
import { HoveringStyle } from './models/d3-plot-options';
import { BarStyle, LineStyle, SeriesGraphDataset } from './models/series-graph-dataset';

const TICKS_COUNT_YAXIS = 5;

export interface D3SeriesGraphOptions {

    /**
     * show or hide y axis
     */
    yaxis?: boolean;

    /**
     * style when hovering with mouse
     */
    hoverStyle?: HoveringStyle;

    /**
     * show or hide grid lines inside plot
     */
    grid?: boolean;

    /**
    * show the label of the xaxis
    */
    showTimeLabel?: boolean;

    /**
     * Configures an optional timerange label with start and end under the diagram
     */
    timeRangeLabel?: {
        show: boolean;
        format?: string;
    }

    /**
     * toggle panning (true) and zooming (false)
     */
    togglePanZoom?: boolean;

    yaxisModifier?: boolean;

    overview?: boolean;

}

interface DatasetEventSubscriptions {
    state: Subscription;
    data: Subscription;
}

@Component({
    selector: 'n52-d3-series-graph',
    templateUrl: './d3-series-graph.component.html',
    styleUrls: ['./d3-series-graph.component.scss'],
    providers: [D3GraphId],
    encapsulation: ViewEncapsulation.None
})
export class D3SeriesGraphComponent implements OnDestroy, AfterViewInit, DoCheck, OnInit, D3GraphInterface {

    @Input()
    public datasets: SeriesGraphDataset[] = [];
    private datasetsDiffer: IterableDiffer<SeriesGraphDataset>;

    @Input()
    public timespan: Timespan;
    protected oldTimespan: Timespan = { from: 0, to: 0 };

    @Input()
    public hoveringService: D3HoveringService = new D3SimpleHoveringService(this.timezoneSrvc, this.pointSymbolDrawer);

    /**
     * Event with a list of selected datasets.
     */
    @Output()
    public datasetsSelected: EventEmitter<string[]> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

    @Output()
    public timespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    // DOM elements
    protected rawSvg: d3.Selection<SVGSVGElement, any, any, any>;
    protected graph: d3.Selection<SVGSVGElement, any, any, any>;
    protected graphBody: any;
    private background: d3.Selection<SVGSVGElement, any, any, any>;

    // data types
    protected preparedAxes: Map<string, YAxisSettings> = new Map();
    protected listOfUoms: string[] = [];
    /** calculated y axes for the diagram */
    private yAxes: YAxis[] = [];

    private xScaleBase: d3.ScaleTime<number, number>; // calculate diagram coord of x value
    private yScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of y value
    private leftOffset: number;

    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 0,
        bottom: 45,
        left: 40
    };
    private maxLabelwidth = 0;
    private addLineWidth = 2; // value added to linewidth
    private ID: string;

    private observer: Set<D3GraphObserver> = new Set();

    @Input()
    public graphOptions: D3SeriesGraphOptions;
    protected graphOptionsDiffer: KeyValueDiffer<any, any>;

    // default plot options
    public plotOptions: D3SeriesGraphOptions = {
        hoverStyle: HoveringStyle.point,
        grid: true,
        yaxis: true,
        showTimeLabel: true,
        yaxisModifier: false,
        timeRangeLabel: {
            show: false
        },
    };

    private graphInteraction: d3.Selection<SVGSVGElement, any, any, any>;
    private langChangeSubscription: Subscription;
    private timezoneSubscription: Subscription;

    private subscriptions: Map<string, DatasetEventSubscriptions> = new Map();

    private resizeObserver: ResizeObserver;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected keyValueDiffers: KeyValueDiffers,
        protected timeSrvc: Time,
        protected timeFormatLocaleService: D3TimeFormatLocaleService,
        protected translateService: TranslateService,
        protected timezoneSrvc: TimezoneService,
        protected rangeCalc: RangeCalculationsService,
        protected graphHelper: D3GraphHelperService,
        protected graphService: D3Graphs,
        protected graphId: D3GraphId,
        protected pointSymbolDrawer: D3PointSymbolDrawerService,
        protected zone: NgZone,
    ) {
        this.datasetsDiffer = this.iterableDiffers.find([]).create();
        this.graphOptionsDiffer = this.keyValueDiffers.find({}).create();
        this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => this.onLanguageChanged());
        this.timezoneSubscription = this.timezoneSrvc.timezoneChange.subscribe((tz: string) => this.onTimezoneChanged());
    }

    ngOnInit(): void {
        this.datasets.forEach(e => this.subscribeEvents(e));
    }

    ngDoCheck() {
        const graphDatasetsChanges = this.datasetsDiffer.diff(this.datasets);
        if (graphDatasetsChanges && this.datasets && this.graph) {
            graphDatasetsChanges.forEachAddedItem((addedItem) => {
                if (addedItem.item.hasData()) {
                    this.redrawCompleteGraph();
                }
                return this.subscribeEvents(addedItem.item);
            });
            graphDatasetsChanges.forEachRemovedItem((removedItem) => {
                this.redrawCompleteGraph();
                return this.unsubscribeEvents(removedItem.item);
            });
        }

        const graphOptionsChanged = this.graphOptionsDiffer.diff(this.graphOptions);
        if (graphOptionsChanged && this.plotOptions) {
            Object.assign(this.plotOptions, this.graphOptions);
            this.redrawCompleteGraph();
        }

        if (this.timespan && this.oldTimespan?.from !== this.timespan.from && this.oldTimespan?.to !== this.timespan.to) {
            this.oldTimespan.from = this.timespan.from;
            this.oldTimespan.to = this.timespan.to;
            this.redrawCompleteGraph();
        }
    }

    private subscribeEvents(ds: SeriesGraphDataset) {
        let dataSubscription: Subscription;
        dataSubscription = ds.dataChangeEvent.subscribe(() => {
            this.redrawCompleteGraph();
        });
        const events: DatasetEventSubscriptions = {
            state: ds.stateChangeEvent.subscribe(() => {
                // TODO: maybe calculate new data
                return this.redrawCompleteGraph();
            }),
            data: dataSubscription
        }
        this.subscriptions.set(ds.id, events);
    }

    private unsubscribeEvents(item: SeriesGraphDataset) {
        if (this.subscriptions.has(item.id)) {
            this.subscriptions.get(item.id).state.unsubscribe();
            this.subscriptions.get(item.id).data.unsubscribe();
            this.subscriptions.delete(item.id);
        }
    }

    public ngAfterViewInit(): void {
        this.ID = this.uuidv4();

        this.graphId.setId(this.ID);
        this.graphService.setGraph(this.ID, this);

        this.rawSvg = d3.select<SVGSVGElement, any>(this.d3Elem.nativeElement)
            .append<SVGSVGElement>('svg')
            .style('width', '100%')
            .style('height', '100%')
            .style('position', 'absolute');

        this.graph = this.rawSvg
            .append<SVGSVGElement>('g')
            .attr('id', `graph-${this.ID}`)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.graphInteraction = this.rawSvg
            .append<SVGSVGElement>('g')
            .attr('id', `interaction-layer-${this.ID}`)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.addResizeObserver();
        this.redrawCompleteGraph();
    }

    private addResizeObserver() {
        this.resizeObserver = new ResizeObserver(entries => this.zone.run(() => this.redrawCompleteGraph()));
        this.resizeObserver.observe(this.d3Elem.nativeElement);
    }

    public ngOnDestroy() {
        this.langChangeSubscription.unsubscribe();
        this.timezoneSubscription.unsubscribe();
        this.resizeObserver.unobserve(this.d3Elem.nativeElement);
        this.graphService.removeGraph(this.ID);
    }

    public registerObserver(obs: D3GraphObserver) {
        this.observer.add(obs);
    }

    public unregisterObserver(obs: D3GraphObserver) {
        this.observer.delete(obs);
    }

    public getGraphElem(): d3.Selection<SVGSVGElement, any, any, any> {
        return this.graph;
    }

    protected onLanguageChanged(): void {
        this.redrawGraph();
    }

    protected onTimezoneChanged(): void {
        this.redrawGraph();
    }

    public centerTime(timestamp: number): void {
        const centeredTimespan = this.timeSrvc.centerTimespan(this.timespan, new Date(timestamp));
        this.timespanChanged.emit(centeredTimespan);
    }

    public changeTime(from: number, to: number): void {
        this.timespanChanged.emit(new Timespan(from, to));
    }

    /**
     * Function that processes the data to calculate y axis range of each dataset.
     * @param entry {DataEntry} Object containing dataset related data.
     */
    protected processData(entry: SeriesGraphDataset): void {
        let visualMin: number;
        let visualMax: number;
        let fixedMin = false;
        let fixedMax = false;

        // set out of yAxisRange
        if (entry.yAxis.range) {

            if (!isNaN(entry.yAxis.range.min)) {
                visualMin = entry.yAxis.range.min;
                fixedMin = true;
            }

            if (!isNaN(entry.yAxis.range.max)) {
                visualMax = entry.yAxis.range.max;
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
                    if (this.timespan.from <= d.timestamp && this.timespan.to >= d.timestamp) { return d.value; }
                } else {
                    return null;
                }
            });

            const dataExtentChildValues = entry.children
                .filter(c => c.visible)
                .map(e => d3.extent<DataEntry, number>(e.data, (d) => (typeof d.value === 'number') ? d.value : null));

            if (isNaN(visualMin)) {
                visualMin = d3.min([baseDataExtent[0], ...dataExtentChildValues.map(e => e[0])]);
            }

            if (isNaN(visualMax)) {
                visualMax = d3.max([baseDataExtent[1], ...dataExtentChildValues.map(e => e[1])]);
            }
        }

        // set out of zeroBasedAxis
        if (entry.yAxis.zeroBased) {
            if (visualMin > 0) {
                visualMin = 0;
            }
            if (visualMax < 0) {
                visualMax = 0;
            }
        }

        this.preparedAxes.set(entry.id, {
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
        if (this.plotOptions.grid) {
            const idx = this.yAxes.reverse().findIndex(yAxe => yAxe.ids.find(id => this.datasets.find(e => e.id)))
            if (idx >= 0) {
                this.graph.append('svg:g')
                    .attr('class', 'grid y-grid')
                    .attr('transform', 'translate(' + this.leftOffset + ', 0)')
                    .call(d3.axisLeft(this.yAxes[idx].yScale)
                        .ticks(TICKS_COUNT_YAXIS)
                        .tickSize(-this.width + this.leftOffset)
                        .tickFormat(() => ''));
            }
        }
    }

    public getDrawingLayer(id: string, front?: boolean): d3.Selection<SVGGElement, any, any, any> {
        return this.rawSvg
            .insert('g', !front ? `#interaction-layer-${this.ID}` : null)
            .attr('id', id)
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');
    }

    private prepareDatasets() {
        if (this.datasets && this.datasets.length) {
            this.datasets.forEach(entry => {
                if (entry.data.length > 0) {
                    this.processData(entry);
                }
            });
        }
    }

    public redrawCompleteGraph() {
        this.prepareDatasets();
        this.redrawGraph();
    }

    /**
     * Function to plot the whole graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    protected redrawGraph(): void {
        if (this.isNotDrawable()) { return; }

        this.datasets.forEach((entry) => {
            const idx: number = this.listOfUoms.findIndex((uom) => uom === entry.description.uom);
            if (idx < 0) { this.listOfUoms.push(entry.description.uom); }
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

        // this.addTimespanJumpButtons();

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
                e.adjustBackground(this.background, graphExtent, this.datasets, this.graph, this.timespan);
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
                || this.datasets === undefined
        } catch (error) {
            return true;
        }
    }

    protected prepareYAxes() {
        this.datasets.forEach(entry => entry.visible && this.createYAxisForId(entry.id));
    }

    protected createYAxisForId(id: string) {
        if (this.preparedAxes.has(id)) {
            const axisSettings = this.preparedAxes.get(id);
            if (axisSettings.entry.yAxis.separate) {
                // create sepearte axis
                this.yAxes.push({
                    uom: axisSettings.entry.description.uom,
                    range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
                    fixedMin: axisSettings.fixedMin,
                    fixedMax: axisSettings.fixedMax,
                    selected: axisSettings.entry.selected,
                    seperate: true,
                    ids: [id],
                    label: axisSettings.entry.description.featureLabel
                });
            } else {
                // find matching axis or add new
                const axis = this.yAxes.find(e => e.uom.includes(axisSettings.entry.description.uom) && !e.seperate);
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
                        uom: axisSettings.entry.description.uom,
                        range: { min: axisSettings.visualMin, max: axisSettings.visualMax },
                        fixedMin: axisSettings.fixedMin,
                        fixedMax: axisSettings.fixedMax,
                        seperate: false,
                        selected: axisSettings.entry.selected ? axisSettings.entry.selected : false,
                        ids: [id]
                    });
                }
            }
        }
    }

    /**
     * Draws for every preprared data entry the chart.
     */
    protected drawAllCharts(): void {
        this.graph.selectAll('.diagram-path').remove();
        this.datasets.forEach((entry, idx) => this.drawChart(entry, idx));
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
        const tickCount = (this.width - this.leftOffset) / 120;
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
            ['month', 6, 6 * durationMonth],
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
        const showAxis = this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis;

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
            if (this.plotOptions.yaxisModifier) {
                axisHeight -= 180;
            }

            // draw y axis label
            const text = this.graph.append<SVGSVGElement>('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '1em')
                .attr('class', `yaxisTextLabel ${axis.selected ? 'selected' : ''}`)
                .text(axis.label ? (axis.uom + ' @ ' + axis.label) : axis.uom)
                .call(this.wrapText, axisHeight - 10, diagramHeight / 2, this.plotOptions.yaxisModifier, axis.label);

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
                    const ds = this.datasets.find(e => e.id === entryID);
                    if (ds && ds.yAxis.showSymbolOnAxis) {
                        const dataentry = this.datasets.find(el => el.id === entryID);
                        if (dataentry && dataentry.style) {
                            this.graphHelper.drawDatasetSign(this.graph, dataentry.style, startOfPoints.x, startOfPoints.y - pointOffset, dataentry.selected);
                            pointOffset += axisradius * 3 + (dataentry.selected ? 2 : 0);
                        }
                    }
                });

                const axisDiv = this.graph.append('rect')
                    .attr('class', `y axisDiv ${axis.selected ? 'selected' : ''}`)
                    .attr('width', axisWidthDiv)
                    .attr('height', this.height)
                    .on('mouseup', () => this.highlightAxis(axis));

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

    private highlightAxis(axis: YAxis): void {
        const selection = !axis.selected;
        axis.ids.forEach(id => {
            const entry = this.datasets.find(e => e.id === id);
            // TODO: maybe with update false
            entry.setSelected(selection);
        })
        this.redrawGraph();
        const list = this.datasets.filter(e => e.selected).map(e => e.id);
        this.datasetsSelected.emit(list);
        this.datasets.forEach(ds => ds.setSelected(list.findIndex(e => e === ds.id) >= 0, false));
    }

    /**
     * Function to draw the graph line for each dataset.
     * @param entry {DataEntry} Object containing a dataset.
     */
    protected drawChart(entry: SeriesGraphDataset, idx: number): void {
        if (entry.data.length > 0 && entry.visible) {
            const yaxis = this.yAxes.find(e => e.ids.indexOf(entry.id) >= 0);
            if (yaxis) {
                // create body to clip graph
                // unique ID generated through the current time (current time when initialized)
                const querySelectorClip = 'clip' + this.ID;
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

                switch (entry.style.constructor) {
                    case BarStyle:
                        this.drawBarChart(entry as SeriesGraphDataset<BarStyle>, idx, yaxis.yScale);
                        break;
                    case LineStyle:
                        entry.children.forEach(e => e.visible && this.drawRefLineChart(e.data, e.color, 1, yaxis.yScale));
                        this.drawLineChart(entry as SeriesGraphDataset<LineStyle>, idx, yaxis.yScale);
                        break;
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

    private drawLineChart(ds: SeriesGraphDataset<LineStyle>, idx: number, yScaleBase: d3.ScaleLinear<number, number>) {
        const pointRadius = this.calculatePointRadius(ds); 0

        // create graph line
        const line = this.createLine(this.xScaleBase, yScaleBase);
        // draw line
        this.graphBody
            .append('svg:path')
            .datum(ds.data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke-dasharray', ds.style.lineDashArray)
            .attr('stroke', ds.style.baseColor)
            .attr('stroke-width', this.calculateLineWidth(ds))
            .attr('d', line);

        // draw line dots
        if (ds.style.pointSymbol) {
            this.graphBody.selectAll('.symbol')
                .data(ds.data.filter((d) => !isNaN(d.value)))
                .enter()
                .append('path')
                .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + idx)
                .attr('transform', (de: DataEntry, idx, data) => `translate(${line.x()(de, idx, data)},${line.y()(de, idx, data)})`)
                .attr('stroke', ds.style.pointBorderColor)
                .attr('fill', ds.style.baseColor)
                .attr('d', this.pointSymbolDrawer.getSymbolPath(ds.style.pointSymbol, ds.selected, this.addLineWidth))
        } else {
            this.graphBody.selectAll('.graphDots')
                .data(ds.data.filter((d) => !isNaN(d.value)))
                .enter().append('circle')
                .attr('class', 'graphDots')
                .attr('id', (d: DataEntry) => 'dot-' + d.timestamp + '-' + idx)
                .attr('stroke', ds.style.pointBorderColor)
                .attr('stroke-width', ds.style.pointBorderWidth)
                .attr('fill', ds.style.baseColor)
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', pointRadius);
            this.graphBody.selectAll('.highlightDots')
                .data(ds.data.filter((d) => !isNaN(d.value) && d.highlight).map(d => {
                    d.highlight = false;
                    return d;
                }))
                .enter()
                .append('circle')
                .attr('fill', ds.style.baseColor)
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', pointRadius)
                .attr('opacity', 0.8)
                .transition()
                .duration(1500)
                .attr('r', pointRadius * 5)
                .attr('opacity', 0)
        }

    }

    private drawBarChart(ds: SeriesGraphDataset<BarStyle>, idx: number, yScaleBase: d3.ScaleLinear<number, number>) {
        const paddingBefore = 0;
        const paddingAfter = 1;
        const periodInMs = ds.style.period.asMilliseconds();

        this.graphBody.selectAll('.bar')
            .data(ds.data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('id', (d: DataEntry) => 'bar-' + d.timestamp + '-' + idx)
            .style('fill', ds.style.baseColor)
            .style('stroke-dasharray', ds.style.lineDashArray)
            .style('stroke', ds.style.baseColor)
            .style('stroke-width', this.calculateLineWidth(ds))
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

    private calculateLineWidth(ds: SeriesGraphDataset): number {
        if (ds.selected) {
            return ds.style.lineWidth + this.addLineWidth;
        } else {
            return ds.style.lineWidth;
        }
    }

    private calculatePointRadius(ds: SeriesGraphDataset<LineStyle>) {
        if (ds.selected) {
            return ds.style.pointRadius > 0 ? ds.style.pointRadius + this.addLineWidth : ds.style.pointRadius;
        } else {
            return ds.style.pointRadius;
        }
    }

}
