import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    IterableDiffers,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    DatasetOptions,
    DatasetPresenterComponent,
    DatasetType,
    HelgolandServicesConnector,
    HelgolandTrajectory,
    InternalIdHandler,
    LocatedTimeValueEntry,
    Time,
} from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {
    area,
    axisBottom,
    axisLeft,
    axisRight,
    axisTop,
    bisector,
    curveLinear,
    extent,
    line,
    mouse,
    ScaleLinear,
    scaleLinear,
    select,
    timeFormat,
} from 'd3';
import moment from 'moment';

import { D3AxisType } from '../model/d3-axis-type';
import { D3GraphOptions } from '../model/d3-graph-options';
import { D3SelectionRange } from '../model/d3-selection-range';

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    [id: string]: any;
}

interface DatasetConstellation {
    dataset?: HelgolandTrajectory;
    data?: LocatedTimeValueEntry[];
    yScale?: ScaleLinear<number, number>;
    drawOptions?: DrawOptions;
    focusLabelRect?: any;
    focusLabel?: any;
}

interface DrawOptions {
    uom: string;
    id: string;
    color: string;
    first: boolean;
    offset: number;
}

@Component({
    selector: 'n52-d3-trajectory-graph',
    templateUrl: './d3-trajectory-graph.component.html',
    styleUrls: ['./d3-trajectory-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TrajectoryGraphComponent
    extends DatasetPresenterComponent<DatasetOptions, D3GraphOptions>
    implements AfterViewInit, OnChanges {

    @Input()
    public selection: D3SelectionRange;

    @Output()
    public onSelectionChangedFinished: EventEmitter<D3SelectionRange> = new EventEmitter();

    @Output()
    public onSelectionChanged: EventEmitter<D3SelectionRange> = new EventEmitter();

    @Output()
    public onHoverHighlight: EventEmitter<number> = new EventEmitter();

    @ViewChild('dthree', { static: true })
    public d3Elem: ElementRef;

    protected datasetMap: Map<string, DatasetConstellation> = new Map();
    protected rawSvg: any;
    protected graph: any;
    protected height: number;
    protected width: number;
    protected margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    protected maxLabelwidth = 0;
    protected lineFun: d3.Line<DataEntry>;
    protected area: d3.Area<DataEntry>;
    protected xScaleBase: d3.ScaleLinear<number, number>;
    protected yScaleBase: d3.ScaleLinear<number, number>;
    protected background: any;
    protected focusG: any;
    protected highlightFocus: any;
    protected focuslabelTime: any;
    protected focuslabelY: any;
    protected yAxisGen: d3.Axis<number | { valueOf(): number; }>;
    protected baseValues: DataEntry[] = [];
    protected dragging: boolean;
    protected dragStart: [number, number];
    protected dragCurrent: [number, number];
    protected dragRect: any;
    protected dragRectG: any;
    protected bufferSum: number;
    protected dataLength: number;

    protected defaultGraphOptions: D3GraphOptions = {
        axisType: D3AxisType.Distance,
        dotted: false
    };

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected servicesConnector: HelgolandServicesConnector,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected translateService: TranslateService
    ) {
        super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateService);
        this.presenterOptions = this.defaultGraphOptions;
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.selection && this.selection) {
            this.processAllData();
            this.drawLineGraph();
        }
    }

    public ngAfterViewInit(): void {
        this.rawSvg = select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.lineFun = line<DataEntry>()
            .x(this.calcXValue)
            .y(this.calcYValue)
            .curve(curveLinear);

        this.area = area<DataEntry>()
            .x(this.calcXValue)
            .y0(this.height)
            .y1(this.calcYValue)
            .curve(curveLinear);

        this.drawLineGraph();
    }

    public reloadDataForDatasets(datasetIds: string[]): void {
        console.log('reload data at ' + new Date());
    }

    protected onLanguageChanged(langChangeEvent: LangChangeEvent): void { }

    protected timeIntervalChanges(): void {
        this.datasetMap.forEach((entry) => {
            if (entry.dataset) {
                this.loadData(entry.dataset);
            }
        });
    }

    protected addDataset(id: string, url: string): void {
        this.servicesConnector.getDataset({ id, url }, { type: DatasetType.Trajectory })
            .subscribe(dataset => {
                this.datasetMap.set(dataset.internalId, { dataset });
                this.loadData(dataset);
            });
    }

    protected removeDataset(internalId: string): void {
        this.datasetMap.delete(internalId);
        this.processAllData();
        this.drawLineGraph();
    }

    protected setSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected removeSelectedId(internalId: string): void {
        throw new Error('Method not implemented.');
    }

    protected presenterOptionsChanged(options: D3GraphOptions): void {
        this.timeIntervalChanges();
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean): void {
        if (!firstChange && this.datasetMap.has(internalId)) {
            this.loadData(this.datasetMap.get(internalId).dataset);
        }
    }

    protected onResize(): void {
        this.drawLineGraph();
    }

    protected loadData(dataset: HelgolandTrajectory) {
        if (this.timespan &&
            this.datasetOptions.has(dataset.internalId) &&
            this.datasetOptions.get(dataset.internalId).visible) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            const option = this.datasetOptions.get(dataset.internalId);
            this.servicesConnector.getDatasetData(dataset, buffer, { generalize: option.generalize })
                .subscribe((result) => {
                    this.dataLength = result.values.length;
                    this.datasetMap.get(dataset.internalId).data = result.values;
                    this.processDataForId(dataset.internalId);
                    this.drawLineGraph();
                });
        } else {
            this.drawLineGraph();
        }
    }

    protected processAllData() {
        this.baseValues = [];
        this.datasetIds.forEach((id) => this.processDataForId(id));
    }

    protected processDataForId(internalId: string) {
        const dataset = this.datasetMap.get(internalId);
        const options = this.datasetOptions.get(internalId);
        if (options.visible && dataset.data && dataset.data.length > 0) {
            const firstEntry = this.baseValues.length === 0;
            let previous: DataEntry = null;
            if (dataset && dataset.data && dataset.data.length >= 0) {
                dataset.data.forEach((elem, idx) => {
                    if (firstEntry) {
                        const entry = this.createDataEntry(internalId, elem, previous, idx);
                        if (this.selection) {
                            if (idx >= this.selection.from && idx <= this.selection.to) {
                                this.baseValues.push(entry);
                            }
                        } else {
                            this.baseValues.push(entry);
                        }
                        previous = entry;
                    } else {
                        if (this.selection) {
                            if (idx >= this.selection.from && idx <= this.selection.to) {
                                if (this.baseValues[idx - this.selection.from]) {
                                    this.baseValues[idx - this.selection.from][internalId] = elem.value;
                                }
                            }
                        } else {
                            if (this.baseValues[idx]) {
                                this.baseValues[idx][internalId] = elem.value;
                            }
                        }
                    }
                });
            }
        }
    }

    protected createDataEntry(
        internalId: string,
        entry: LocatedTimeValueEntry,
        previous: DataEntry,
        index: number
    ): DataEntry {
        let dist: number;
        if (previous) {
            const newdist = this.distanceBetween(
                entry.geometry.coordinates[1],
                entry.geometry.coordinates[0],
                previous.geometry.coordinates[1],
                previous.geometry.coordinates[0]
            );
            dist = previous.dist + Math.round(newdist / 1000 * 100000) / 100000;
        } else {
            dist = 0;
        }
        return {
            tick: index,
            dist: Math.round(dist * 10) / 10,
            timestamp: entry.timestamp,
            value: entry.value,
            [internalId]: entry.value,
            x: entry.geometry.coordinates[0],
            y: entry.geometry.coordinates[1],
            geometry: entry.geometry
        };
    }

    protected distanceBetween(latitude1, longitude1, latitude2, longitude2): number {
        const R = 6371000;
        const rad = Math.PI / 180;
        const lat1 = latitude1 * rad;
        const lat2 = latitude2 * rad;
        const sinDLat = Math.sin((latitude2 - latitude1) * rad / 2);
        const sinDLon = Math.sin((longitude2 - longitude1) * rad / 2);
        const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    protected calcYValue = (d: DataEntry) => {
        return this.yScaleBase(d.value);
    }

    protected calcXValue = (d: DataEntry, i: number) => {
        const xDiagCoord = this.xScaleBase(this.getXValue(d));
        d.xDiagCoord = xDiagCoord;
        return xDiagCoord;
    }

    protected calculateHeight(): number {
        return (this.d3Elem.nativeElement as HTMLElement).clientHeight - this.margin.top - this.margin.bottom;
    }

    protected calculateWidth(): number {
        return (this.d3Elem.nativeElement as HTMLElement).clientWidth - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    protected getXValue(data: DataEntry) {
        switch (this.presenterOptions.axisType) {
            case D3AxisType.Distance:
                return data.dist;
            case D3AxisType.Time:
                return data.timestamp;
            case D3AxisType.Ticks:
                return data.tick;
            default:
                return data.tick;
        }
    }

    protected drawDots(values: DataEntry[], yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        this.graph.selectAll('dot')
            .data(values)
            .enter().append('circle')
            .attr('stroke', options.color)
            .attr('r', 1.5)
            .attr('fill', options.color)
            .attr('cx', this.calcXValue)
            .attr('cy', (d: DataEntry) => yScale(d[options.id]));
    }

    protected drawValueLine(values: DataEntry[], yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        this.graph.append('svg:path')
            .datum(values)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', options.color)
            .attr('stroke-width', 1)
            .attr('d', line<DataEntry>()
                .x(this.calcXValue)
                .y((d: DataEntry) => yScale(d[options.id]))
                .curve(curveLinear));
    }

    protected drawGraph(yScale: d3.ScaleLinear<number, number>, options: DrawOptions) {
        if (this.presenterOptions.dotted) {
            this.drawDots(this.baseValues, yScale, options);
        } else {
            this.drawValueLine(this.baseValues, yScale, options);
        }
    }

    protected drawLineGraph() {
        if (!this.baseValues || this.baseValues.length === 0 || !this.graph) {
            return;
        }

        this.height = this.calculateHeight();
        this.width = this.calculateWidth();

        this.graph.selectAll('*').remove();

        this.bufferSum = 0;

        this.yScaleBase = null;

        this.datasetMap.forEach((datasetEntry, id) => {
            if (this.datasetOptions.has(id) && datasetEntry.data && datasetEntry.data.length > 0 && this.datasetOptions.get(id).visible) {
                datasetEntry.drawOptions = {
                    uom: datasetEntry.dataset.uom,
                    id: datasetEntry.dataset.internalId,
                    color: this.datasetOptions.get(id).color,
                    first: this.yScaleBase === null,
                    offset: this.bufferSum
                };
                const axisResult = this.drawYAxis(datasetEntry.drawOptions);
                if (this.yScaleBase === null) {
                    this.yScaleBase = axisResult.yScale;
                } else {
                    this.bufferSum = axisResult.buffer;
                }
                datasetEntry.yScale = axisResult.yScale;
            }
        });

        if (!this.yScaleBase) {
            return;
        }

        // draw right axis as border
        this.graph.append('svg:g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.width + ', 0)')
            .call(axisRight(this.yScaleBase).tickSize(0).ticks(0));

        this.drawXAxis(this.bufferSum);

        this.datasetMap.forEach((entry, id) => {
            if (this.datasetOptions.has(id) && this.datasetOptions.get(id).visible && entry.data && entry.data.length > 0) {
                this.drawGraph(entry.yScale, entry.drawOptions);
            }
        });

        this.background = this.graph.append('svg:rect')
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.bufferSum + ', 0)')
            .on('mousemove.focus', this.mousemoveHandler)
            .on('mouseout.focus', this.mouseoutHandler)
            .on('mousedown.drag', this.dragStartHandler)
            .on('mousemove.drag', this.dragHandler)
            .on('mouseup.drag', this.dragEndHandler);

        this.focusG = this.graph.append('g');
        this.highlightFocus = this.focusG.append('svg:line')
            .attr('class', 'mouse-focus-line')
            .attr('x2', '0')
            .attr('y2', '0')
            .attr('x1', '0')
            .attr('y1', '0')
            .style('stroke', 'black')
            .style('stroke-width', '1px');

        this.datasetMap.forEach((entry, id) => {
            if (this.datasetOptions.has(id) && this.datasetOptions.get(id).visible && entry.data) {
                entry.focusLabelRect = this.focusG.append('svg:rect')
                    .style('fill', 'white')
                    .style('stroke', 'none')
                    .style('pointer-events', 'none');
                entry.focusLabel = this.focusG.append('svg:text').attr('class', 'mouse-focus-label-x')
                    .style('pointer-events', 'none')
                    .style('fill', this.datasetOptions.get(id).color)
                    .style('font-weight', 'lighter');
            }
        });

        this.focuslabelTime = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-x');
        this.focuslabelY = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-y');
    }

    protected mousemoveHandler = () => {
        if (!this.baseValues || this.baseValues.length === 0) {
            return;
        }
        const coords = mouse(this.background.node());
        const idx = this.getItemForX(coords[0] + this.bufferSum, this.baseValues);
        this.showDiagramIndicator(idx);
        this.onHoverHighlight.emit(this.baseValues[idx].tick);
    }

    protected mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    protected dragStartHandler = () => {
        this.dragging = false;
        this.dragStart = mouse(this.background.node());
    }

    protected dragHandler = () => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    protected dragEndHandler = () => {
        if (!this.dragStart || !this.dragging) {
            this.onSelectionChangedFinished.emit({ from: 0, to: this.dataLength });
        } else {
            const from = this.getItemForX(this.dragStart[0] + this.bufferSum, this.baseValues);
            const to = this.getItemForX(this.dragCurrent[0] + this.bufferSum, this.baseValues);
            this.onSelectionChangedFinished.emit(this.prepareRange(this.baseValues[from].tick, this.baseValues[to].tick));
        }
        this.dragStart = null;
        this.dragging = false;
        this.resetDrag();
    }

    protected prepareRange(from: number, to: number): D3SelectionRange {
        if (from <= to) {
            return { from, to };
        }
        return { from: to, to: from };
    }

    protected drawDragRectangle() {
        if (!this.dragStart) { return; }

        this.dragCurrent = mouse(this.background.node());

        const from = this.getItemForX(this.dragStart[0] + this.bufferSum, this.baseValues);
        const to = this.getItemForX(this.dragCurrent[0] + this.bufferSum, this.baseValues);
        this.onSelectionChanged.emit(this.prepareRange(this.baseValues[from].tick, this.baseValues[to].tick));

        const x1 = Math.min(this.dragStart[0], this.dragCurrent[0]);
        const x2 = Math.max(this.dragStart[0], this.dragCurrent[0]);

        if (!this.dragRect && !this.dragRectG) {

            this.dragRectG = this.graph.append('g');

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

    protected resetDrag() {
        if (this.dragRectG) {
            this.dragRectG.remove();
            this.dragRectG = null;
            this.dragRect = null;
        }
    }

    protected hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
    }

    protected showDiagramIndicator = (idx: number) => {
        const item = this.baseValues[idx];
        this.focusG.style('visibility', 'visible');
        this.highlightFocus.attr('x1', item.xDiagCoord)
            .attr('y1', 0)
            .attr('x2', item.xDiagCoord)
            .attr('y2', this.height)
            .classed('hidden', false);

        let onLeftSide = false;
        if ((this.background.node().getBBox().width + this.bufferSum) / 2 > item.xDiagCoord) { onLeftSide = true; }

        this.showLabelValues(item, onLeftSide);
        this.showTimeIndicatorLabel(item, onLeftSide);
        this.showBottomIndicatorLabel(item, onLeftSide);
    }

    protected showLabelValues(item: DataEntry, onLeftSide: boolean) {
        this.datasetMap.forEach((entry, id) => {
            if (this.datasetOptions.get(id).visible) {
                if (entry.focusLabel && entry.yScale && item[id]) {
                    entry.focusLabel.text(item[id] + (entry.dataset.uom ? entry.dataset.uom : ''));
                    const entryX = onLeftSide ?
                        item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w;
                    entry.focusLabel
                        .attr('x', entryX)
                        .attr('y', entry.yScale(item[id]) + this.getDimensions(entry.focusLabel.node()).h - 3);
                    entry.focusLabelRect
                        .attr('x', entryX)
                        .attr('y', entry.yScale(item[id]))
                        .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                        .attr('height', this.getDimensions(entry.focusLabel.node()).h);
                }
            }
        });
    }

    protected showTimeIndicatorLabel(item: DataEntry, onLeftSide: boolean) {
        this.focuslabelTime.text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
        this.focuslabelTime
            .attr('x', onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(this.focuslabelTime.node()).w)
            .attr('y', 13);
    }

    protected showBottomIndicatorLabel(item: DataEntry, onLeftSide: boolean) {
        if (this.presenterOptions.axisType === D3AxisType.Distance) {
            this.focuslabelY.text(item.dist + ' km');
        }
        if (this.presenterOptions.axisType === D3AxisType.Ticks) {
            this.focuslabelY.text('Measurement: ' + item.tick);
        }
        this.focuslabelY
            .attr('y', this.calculateHeight() - 5)
            .attr('x', onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(this.focuslabelY.node()).w);
    }

    protected getDimensions(el: any) {
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

    protected getItemForX(x: number, data: DataEntry[]) {
        const index = this.xScaleBase.invert(x);
        const bisectDate = bisector((d: DataEntry) => {
            switch (this.presenterOptions.axisType) {
                case D3AxisType.Distance:
                    return d.dist;
                case D3AxisType.Time:
                    return d.timestamp;
                case D3AxisType.Ticks:
                default:
                    return d.tick;
            }
        }).left;
        return bisectDate(this.baseValues, index);
    }

    protected drawYAxis(options: DrawOptions): any {
        const range = extent<DataEntry, number>(this.baseValues, (datum, index, array) => {
            return datum[options.id]; // here with ID
        });
        const rangeOffset = (range[1] - range[0]) * 0.10;
        const yScale = scaleLinear()
            .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height, 0]);

        this.yAxisGen = axisLeft(yScale).ticks(5);

        // draw y axis
        const axis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(this.yAxisGen);

        // draw y axis label
        const text = this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', options.color)
            .text(options.uom);

        const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h;
        const buffer = options.offset + (axisWidth < 30 ? 30 : axisWidth);
        if (!options.first) {
            axis.attr('transform', 'translate(' + buffer + ', 0)');
        }

        const textOffset = !options.first ? buffer : options.offset;
        text.attr('y', 0 - this.margin.left - this.maxLabelwidth + textOffset)
            .attr('x', 0 - (this.height / 2));

        // draw the y grid lines when there is only one dataset
        if (this.datasetIds.length === 1) {
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .call(axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-this.width)
                    .tickFormat(() => '')
                );
        }

        return {
            buffer,
            yScale
        };
    }

    protected drawXAxis(buffer: number) {
        this.xScaleBase = scaleLinear()
            .domain(this.getXDomain(this.baseValues))
            .range([buffer, this.width]);

        const xAxisGen = axisBottom(this.xScaleBase).ticks(5);

        if (this.presenterOptions.axisType === D3AxisType.Time) {
            xAxisGen.tickFormat((d) => {
                return timeFormat('%d.%m.%Y %H:%M:%S')(new Date(d.valueOf()));
            });
        }

        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxisGen);

        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(axisBottom(this.xScaleBase)
                .ticks(10)
                .tickSize(-this.height)
                .tickFormat(() => '')
            );

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(axisTop(this.xScaleBase).ticks(0).tickSize(0));

        // text label for the x axis
        this.graph.append('text')
            .attr('x', (this.width + buffer) / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text(this.getXAxisLabel());
    }

    protected getXDomain(values: DataEntry[]) {
        switch (this.presenterOptions.axisType) {
            case D3AxisType.Distance:
                return [values[0].dist, values[values.length - 1].dist];
            case D3AxisType.Time:
                return [values[0].timestamp, values[values.length - 1].timestamp];
            default:
                return [values[0].tick, values[values.length - 1].tick];
        }
    }

    protected getXAxisLabel() {
        switch (this.presenterOptions.axisType) {
            case D3AxisType.Distance:
                return 'Distance';
            case D3AxisType.Time:
                return 'Time';
            default:
                return 'Ticks';
        }
    }

}
