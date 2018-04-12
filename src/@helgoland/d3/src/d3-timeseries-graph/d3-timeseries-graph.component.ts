import  {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    IterableDiffers,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    ApiInterface,
    Data,
    DatasetGraphComponent,
    DatasetOptions,
    IDataset,
    InternalIdHandler,
    Time,
    Timeseries,
    Timespan,
} from '@helgoland/core';
import {
    D3PlotOptions,
} from '@helgoland/d3';
// import {
//     axisBottom,
//     axisLeft,
//     axisTop,
//     bisector,
//     curveLinear,
//     extent,
//     line,
//     mouse,
//     ScaleLinear,
//     scaleLinear,
//     select,
//     timeFormat,
// } from 'd3';
import * as d3 from 'd3';
import * as moment from 'moment';

import { Observable, Observer } from 'rxjs/Rx';

interface DataEntry {
    [id: string]: any;
    xDiagMin?: number;
    xDiagMax?: number;
    yDiagMin?: number;
    yDiagMax?: number;
    xDiagCoord?: number;
}

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent
    extends DatasetGraphComponent<DatasetOptions, D3PlotOptions>
    implements AfterViewInit {

    @Output()
    // public onHoverHighlight: EventEmitter<number> = new EventEmitter();
    public onHighlightUom: EventEmitter<D3PlotOptions> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    private preparedData = Array(); // : DataSeries[]

    private rawSvg: any;
    private graph: any;
    private graphBody: any;
    private xAxisRange: any; // x domain range
    private xAxisRangeOrigin: any; // x domain range
    private xAxisRangePan: [number, number]; // x domain range
    private yAxisRange: any; // y domain range
    private yRanges: any; // y array of objects containing ranges for every uom
    private myRanges: any; // y object containing ranges for each uom
    private dataYranges: any; // y array of objects containing ranges of all datasets
    private ypos: any; // y array of objects containing ranges of all datasets
    private idxOfPos = 0;
    private xDomainMax: any; // y domain range

    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    private maxLabelwidth = 0;
    private xScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of x value
    private yScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of y value
    private background: any;
    private focusG: any;
    private highlightFocus: any;
    private focuslabelTime: any;
    private focuslabelY: any;
    private bufferSum: number;

    private dragging: boolean;
    private dragStart: [number, number];
    private dragCurrent: [number, number];

    private draggingMove: boolean;
    private dragMoveStart: [number, number];
    private dragMoveStart02: [number, number];
    private dragMoveRange: [number, number];

    private dragRect: any;
    private dragRectG: any;

    private lwHigh = 3; // lineWidth high
    private lwLow = 1; // lineWidth low

    private plotOptions: D3PlotOptions = {
        // selected: []
    };

    private datasetMap: Map<string, IDataset> = new Map();

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    public ngAfterViewInit(): void {

        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '600px')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.yRanges = new Array();
        this.myRanges = {};
        this.dataYranges = new Array();
        this.xAxisRangeOrigin = new Array();
        this.ypos = new Array();
    }

    public reloadData(): void {
        // not implemented yet
    }

    protected addDataset(id: string, url: string): void {
        this.api.getSingleTimeseries(id, url).subscribe(
            (timeseries) => this.loadAddedDataset(timeseries), // this.loadDataset(timeseries),
            (error) => {
                this.api.getDataset(id, url).subscribe(
                    (dataset) => this.loadAddedDataset(dataset), // this.loadDataset(dataset)
                );
            }
        );
    }
    protected removeDataset(internalId: string): void {
        // not implemented yet
    }
    protected setSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        tsData.selected = true;
        tsData.lines.lineWidth = this.lwHigh;
        // tsData.bars.lineWidth = this.lwHigh;
        this.plotGraph();
    }
    protected removeSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        tsData.selected = false;
        tsData.lines.lineWidth = this.lwLow;
        // tsData.bars.lineWidth = this.lwLow;
        this.plotGraph();
    }
    protected graphOptionsChanged(options: D3PlotOptions): void {
        Object.assign(this.plotOptions, options);
        if (this.rawSvg) {
            this.plotGraph();
        }
    }
    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean) {
        // not implemented yet
    }
    protected timeIntervalChanges(): void {
        this.datasetMap.forEach((dataset) => {
            this.loadDataset(dataset);
        });
    }
    protected onResize(): void {
        this.plotGraph();
    }

    private changeTime(from: number, to: number) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    private loadAddedDataset(dataset: IDataset) {
        this.datasetMap.set(dataset.internalId, dataset);
        this.loadDataset(dataset);
    }

    // load data of dataset
    private loadDataset(dataset: IDataset) {
        const datasetOptions = this.datasetOptions.get(dataset.internalId);

        if (dataset instanceof Timeseries) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);

            this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                {
                    format: 'flot',
                    // expanded: this.plotOptions.showReferenceValues === true,
                    // generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                }
            ).subscribe(
                (result) => {
                    this.prepareTsData(dataset, result).subscribe(() => {
                        console.log('plotGraph ??? ');
                    });
                },
                (error) => this.onError(error),
                () => console.log('loadDataset() - complete data loaded') // this.onCompleteLoadingData(dataset)
            );
        }
    }

    // add dataset to preparedData
    private prepareTsData(dataset: IDataset, data: Data<[number, number]>): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            const styles = this.datasetOptions.get(dataset.internalId);

            // TODO: check for datasets with various uoms --- see all comments with #varUom
            // if (this.preparedData.length === 1) {
            //     dataset.uom = 'mc';
            // }
            // if (datasetIdx === 1) {
            //     dataset.uom = 'mc';
            // }
            // end of check for datasets

            const dataEntry = {
                internalId: dataset.internalId,
                color: styles.color,
                data: styles.visible ? data.values : [],
                points: {
                    fillColor: styles.color
                },
                lines: {
                    lineWidth: (this.plotOptions.selected.includes(dataset.uom) ? this.lwHigh : this.lwLow)
                },
                bars: {
                    lineWidth: (this.plotOptions.selected.includes(dataset.uom) ? this.lwHigh : this.lwLow)
                },
                axisOptions: {
                    uom: dataset.uom,
                    label: dataset.label
                }
            };

            if (datasetIdx >= 0) {
                this.preparedData[datasetIdx] = dataEntry;
            } else {
                this.preparedData.push(dataEntry);
            }

            let min = dataEntry.data[0][1];
            let max = dataEntry.data[1][1];

            // get min and max value of data
            const range = d3.extent<DataEntry, number>(dataEntry.data, (datum, index, array) => {
                return datum[1]; // datum[0] = timestamp -- datum[1] = value
            });
            if (min >= range[0]) { min = range[0]; }
            if (max <= range[1]) { max = range[1]; }

            const newDatasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            this.dataYranges[newDatasetIdx] = {
                uom: dataEntry.axisOptions.uom,
                range: [min, max]
            };

            // min = yMin[0]
            const yMin = d3.extent<DataEntry, number>(this.dataYranges, (datum, index, array) => {
                if (datum.uom === dataEntry.axisOptions.uom) {
                    return datum.range[0]; // datum.range = [min, max]
                }
            });
            // max = yMax[1]
            const yMax = d3.extent<DataEntry, number>(this.dataYranges, (datum, index, array) => {
                if (datum.uom === dataEntry.axisOptions.uom) {
                    return datum.range[1];
                }
            });

            if (!this.myRanges[dataEntry.axisOptions.uom]) {
                this.myRanges[dataEntry.axisOptions.uom] = {};
            }
            if (!this.myRanges[dataEntry.axisOptions.uom].ids) {
                this.myRanges[dataEntry.axisOptions.uom].ids = [];
            }

            this.myRanges[dataEntry.axisOptions.uom].range = [yMin[0], yMax[1]];
            if (!(this.myRanges[dataEntry.axisOptions.uom].ids.includes(dataEntry.internalId))) {
                this.myRanges[dataEntry.axisOptions.uom].ids.push(dataEntry.internalId);
            }
            this.yRanges = new Array();

            console.log(this.myRanges); // TODO delete dataset --> delete range of dataset
            for (let singleUom in this.myRanges) {
                if (this.myRanges.hasOwnProperty(singleUom)) {
                    this.yRanges.push({
                        uom: singleUom,
                        range: this.myRanges[singleUom].range,
                        ids: this.myRanges[singleUom].ids
                    });
                }
            }
            this.plotGraph();
        });
    }

    private calculateHeight(): number {
        return this.rawSvg.node().clientHeight - this.margin.top - this.margin.bottom;
    }

    private calculateWidth(): number {
        return this.rawSvg.node().clientWidth - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    // get time range for x axis
    private getxAxisRange() {
        let min = this.preparedData[0].data[0][0];
        let max = this.preparedData[0].data[this.preparedData[0].data.length - 1][0];

        this.preparedData.forEach((entry) => {

            const range = d3.extent<DataEntry, number>(entry.data, (datum, index, array) => {
                return datum[0]; // datum[0] = timestamp -- datum[1] = value
            });
            if (min >= range[0]) { min = range[0]; }
            if (max <= range[1]) { max = range[1]; }
        });
        return [min, max];
    }

    // get value range for y axis for each uom of every dataset
    private getyAxisRange(uom) {

        for (let i = 0; i <= this.yRanges.length; i++) {
            if (this.yRanges[i].uom === uom) {
                return this.yRanges[i].range;
            }
        }

        return null; // error: uom does not exist
    }

    private plotGraph() {
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();

        this.bufferSum = 0;
        this.yScaleBase = null;

        // get range of x and y axis
        this.xAxisRange = [this.timespan.from, this.timespan.to];

        // #####################################################

        this.yRanges.forEach((entry) => {
            entry.first = (this.yScaleBase === null);
            entry.offset = this.bufferSum;

            let yAxisResult = this.drawYaxis(entry);
            if (this.yScaleBase === null) {
                this.yScaleBase = yAxisResult.yScale;
            } else {
                this.bufferSum = yAxisResult.buffer;
            }
            entry.yScale = yAxisResult.yScale;
        });

        if (!this.yScaleBase) {
            return;
        }

        // draw x and y axis
        this.drawXaxis(this.bufferSum);

        this.preparedData.forEach((entry) => {
            this.drawGraphLine(entry);
        });

        // #####################################################
        // inside line and mouse events
        this.background = this.graph.append('svg:rect')
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .attr('pointer-events', 'all')
            .attr('transform', 'translate(' + this.bufferSum + ', 0)')
            .on('mousemove.focus', this.mousemoveHandler)
            .on('mouseout.focus', this.mouseoutHandler);

        if (this.plotOptions.togglePanZoom === false) {
            this.background
                .on('mousedown.drag', this.zoomStartHandler)
                .on('mousemove.drag', this.zoomHandler)
                .on('mouseup.drag', this.zoomEndHandler);
        } else {
            this.background
                .call(d3.drag()
                    .on('start', this.panStartHandler)
                    .on('drag', this.panMoveHandler)
                    .on('end', this.panEndHandler));
        }

        // line inside graph
        this.focusG = this.graph.append('g');
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
                .style('fill', entry.color)
                .style('font-weight', 'lighter');

            this.focuslabelTime = this.focusG.append('svg:text')
                .style('pointer-events', 'none')
                .attr('class', 'mouse-focus-time');
        });
    }

    private drawXaxis(bufferXrange: number) {
        // range for x axis scale
        this.xScaleBase = d3.scaleLinear()
            .domain( [ this.xAxisRange[0] , this.xAxisRange[1] ] )
            .range( [ bufferXrange , this.width ] );

        // const xAxisGen = d3.axisBottom(this.xScaleBase).ticks(5);
        const xAxisGen = d3.axisBottom(this.xScaleBase)
            .tickValues(d3.timeHours(this.xAxisRange[0], this.xAxisRange[1], 4));

        xAxisGen.tickFormat((d) => {
            return d3.timeFormat('%H:%M:%S')(new Date(d.valueOf()));
        });

        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxisGen)
            .selectAll('text')
            .style('text-anchor', 'middle');

        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScaleBase)
                .ticks(5)
                .tickSize(-this.height)
                .tickFormat(() => '')
            );

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0));

        // text label for the x axis
        this.graph.append('text')
            .attr('x', (this.width + bufferXrange) / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text('time');
    }

    private drawYaxis(entry): any {
        const range = this.getyAxisRange(entry.uom);

        let yMin = range[0];
        let yMax = range[1];

        // range for y axis scale
        const rangeOffset = (yMax - yMin) * 0.10;
        const yScale = d3.scaleLinear()
            .domain([ yMin - rangeOffset, yMax + rangeOffset])
            .range([this.height, 0]);

        let yAxisGen = d3.axisLeft(yScale).ticks(5);

        // draw y axis
        const axis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(yAxisGen);

        // draw y axis label
        const text = this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(entry.uom)
            .on('mouseup', () => {
                this.highlightLine(entry.ids, entry.uom);
            });

        const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h;
        const buffer = entry.offset + (axisWidth < 30 ? 30 : axisWidth);

        if (!entry.first) {
            axis.attr('transform', 'translate(' + buffer + ', 0)');
        }

        const textOffset = !entry.first ? buffer : entry.offset;
        text.attr('y', 0 - this.margin.left - this.maxLabelwidth + textOffset)
            .attr('x', 0 - (this.height / 2));

        // draw the y grid lines
        if (this.datasetIds.length === 1) {
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .call(d3.axisLeft(yScale)
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

    private highlightLine (ids, uom) {
        let selected = false;
        if (this.plotOptions.selected.includes(uom)) {
            selected = true;
            this.plotOptions.selected.splice(this.plotOptions.selected.indexOf(uom), 1);
        } else {
            this.plotOptions.selected.push(uom);
        }
        ids.forEach((id) => (selected ? this.removeSelectedId(id) : this.setSelectedId(id)));
        this.onHighlightUom.emit(this.plotOptions);
    }

    private drawGraphLine(entry: DataEntry) {
        let data = entry.data;

        const getYaxisRange = this.yRanges.find((obj, index) => {
            if (obj.uom === entry.axisOptions.uom) {
                return obj.yScale;
            } // uom does exist in this.yRanges
        });

        let xScaleBase = this.xScaleBase;
        let yScaleBase = getYaxisRange.yScale;

        // #####################################################
        // create body to clip graph
        this.graph
            .append('svg:clipPath')
            .attr('id', 'clip')
            .append('svg:rect')
            .attr('x', this.bufferSum)
            .attr('y', 0)
            .attr('width', this.width - this.bufferSum)
            .attr('height', this.height);

        // draw grah line
        this.graphBody = this.graph
            .append('g')
            .attr('clip-path', 'url(#clip)');
        this.graphBody
            .append('svg:path')
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', entry.color)
            .attr('stroke-width', entry.lines.lineWidth)
            .attr('d', d3.line<DataEntry>()
            .x((d) => {
                d.timestamp = d[0];
                const xDiagCoord = xScaleBase(d[0]);
                d.xDiagCoord = xDiagCoord;
                return xDiagCoord;
            })
            .y((d) => {
                const yDiagCoord = yScaleBase(d[1]);
                d.yDiagCoord = yDiagCoord;
                return yDiagCoord;
            })
            .curve(d3.curveLinear));
    }

    private mousemoveHandler = () => {
        const coords = d3.mouse(this.background.node());
        this.ypos = [];
        this.idxOfPos = 0;
        this.preparedData.forEach((entry) => {
            const idx = this.getItemForX(coords[0] + this.bufferSum, entry.data);
            this.showDiagramIndicator(entry, idx);
        });

        if (this.ypos !== undefined) {
            let yPos = this.ypos.sort ((a, b) => { return a.y - b.y; });
            yPos.forEach((p, i) => {
                if (i > 0) {
                    let last = yPos[i - 1].y;
                    yPos[i].off = Math.max(0, (last + 20) - yPos[i].y);
                    yPos[i].y += yPos[i].off;
                }
            });
            yPos.sort ((a, b) => { return a.idx - b.idx; });

            let c1 = 0;
            let c2 = 0;

            d3.selectAll('.mouse-focus-label')
                .attr('transform', (d, i) => {
                    // pairs of 2 objects (rectangle (equal) and label (odd))
                    if (i > 0) {
                        c1 = (i - 1) % 2;
                    }
                    c2 += c1;
                    if (yPos[c2] && yPos[c2].off) {
                        return 'translate (0,' + ( 3 + yPos[c2].off ) + ')';
                    }
                });
        }
    }

    private mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    // drag handling for move
    private panStartHandler = () => {
        this.draggingMove = false;
        this.dragMoveStart = d3.event.x;
        this.dragMoveRange = this.xAxisRange;
    }

    private panMoveHandler = () => {
        this.draggingMove = true;
        if (this.dragMoveStart && this.draggingMove) {
            let diff = -(d3.event.x - d3.event.subject.x);
            let amountTimestamp = this.dragMoveRange[1] - this.dragMoveRange[0];
            let ratioTimestampDiagCoord = amountTimestamp / this.width;
            let newTimeMin = this.dragMoveRange[0] + (ratioTimestampDiagCoord * diff);
            let newTimeMax = this.dragMoveRange[1] + (ratioTimestampDiagCoord * diff);

            this.xAxisRangePan = [newTimeMin, newTimeMax];
            this.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
            this.plotGraph();

        }
    }

    private panEndHandler = () => {
        this.plotGraph();
        this.dragMoveStart = null;
        this.draggingMove = false;

    }

    // drag handling for zoom
    private zoomStartHandler = () => {
        this.dragging = false;
        this.dragStart = d3.mouse(this.background.node());
        this.xAxisRangeOrigin.push(this.xAxisRange);
    }

    private zoomHandler = () => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    private zoomEndHandler = () => {
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
            this.xAxisRange = [xDomainRange[0], xDomainRange[1]];
            this.changeTime(this.xAxisRange[0], this.xAxisRange[1]);
            this.plotGraph();
        }
        this.dragStart = null;
        this.dragging = false;
        this.resetDrag();
    }

    // return timestamp of provided diagram coord
    private getxDomain(start: number, end: number) {
        let domMinArr = [];
        let domMaxArr = [];
        let domMin;
        let domMax;
        let tmp;
        let lowestMin = Number.POSITIVE_INFINITY;
        let lowestMax = Number.POSITIVE_INFINITY;

        start += this.bufferSum;
        end += this.bufferSum;

        this.preparedData.forEach((entry) => {
            domMinArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord) {
                    if (elem.xDiagCoord >= start) {
                        return array[index];
                    }
                }
            }));
            domMaxArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord >= end) {
                    return array[index];
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

    private drawDragRectangle() {
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

    private prepareRange(from: number, to: number) {
        if (from <= to) {
            return { from, to };
        }
        return { from: to, to: from };
    }

    private resetDrag() {
        if (this.dragRectG) {
            this.dragRectG.remove();
            this.dragRectG = null;
            this.dragRect = null;
        }
    }

    private getItemForX(x: number, data: DataEntry[]) {
        const index = this.xScaleBase.invert(x);
        const bisectDate = d3.bisector((d: DataEntry) => {
            return d[0];
        }).left;
        return bisectDate(data, index);
    }

    private hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
        d3.selectAll('.focus-visibility')
            .attr('visibility', 'hidden');
    }

    private showDiagramIndicator = (entry, idx: number) => {
        const item = entry.data[idx];
        if (item !==  undefined) {
            // create line where mouse is
            this.focusG.style('visibility', 'visible');
            this.highlightFocus
                .attr('x1', item.xDiagCoord)
                .attr('y1', 0)
                .attr('x2', item.xDiagCoord)
                .attr('y2', this.height)
                .classed('hidden', false);

            // show label if data available for time
            entry.focusLabel
                .attr('visibility', 'visible')
                .attr('class', 'focus-visibility');
            entry.focusLabelRect
                .attr('visibility', 'visible')
                .attr('class', 'focus-visibility');

            let onLeftSide = false;
            if ((this.background.node().getBBox().width + this.bufferSum) / 2 > item.xDiagCoord) { onLeftSide = true; }

            this.showLabelValues(entry, item, onLeftSide);
            this.showTimeIndicatorLabel(item, onLeftSide);
        } else {
            // hide label if no data available for time
            entry.focusLabel
                .attr('visibility', 'hidden');
            entry.focusLabelRect
                .attr('visibility', 'hidden');
        }
    }

    private showLabelValues(entry, item: DataEntry, onLeftSide: boolean) {
        let id = 1;
        if (entry.focusLabel) {
            entry.focusLabel.text(item[id] + (entry.axisOptions.uom ? entry.axisOptions.uom : ''));
            const entryX = onLeftSide ?
                item.xDiagCoord + 4 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w - 4;
            entry.focusLabel
                .attr('x', entryX)
                .attr('y', item.yDiagCoord);
            entry.focusLabelRect
                .attr('x', entryX)
                .attr('y', item.yDiagCoord - this.getDimensions(entry.focusLabel.node()).h + 3)
                .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                .attr('height', this.getDimensions(entry.focusLabel.node()).h);

            this.ypos.push({ idx: this.idxOfPos ++, y: item.yDiagCoord, off: 0 });
        }
    }

    private showTimeIndicatorLabel(item: DataEntry, onLeftSide: boolean) {
        this.focuslabelTime.text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
        this.focuslabelTime
            .attr('x', onLeftSide ? item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(this.focuslabelTime.node()).w)
            .attr('y', 13);
    }

    private getDimensions(el: any) {
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

    private onError(error: any) {
        console.error(error);
    }

}
