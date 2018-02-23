import  {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    IterableDiffers,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

import { Observable, Observer } from 'rxjs/Rx';

import { DatasetGraphComponent } from './../../dataset-graph.component';
import { Data } from './../../../../model/api/data';
import { DatasetOptions } from './../../../../model/internal/options';
import { PlotOptions } from './../../flot/model/plotOptions';
import { LocatedTimeValueEntry } from './../../../../model/api/data';
import { Dataset, IDataset, Timeseries } from './../../../../model/api/dataset';

import { DataSeries } from './../../flot/model/dataSeries';
import { Timespan } from './../../../../model/internal/timeInterval';
import { ApiInterface } from './../../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../../services/time/time.service';

interface DataEntry {
    [id: string]: any;
    xDiagMin?: number;
    xDiagMax?: number;
    yDiagMin?: number;
    yDiagMax?: number;
    xDiagCoord?: number;
}

@Component({
    selector: 'n52-d3-flot-timeseries-graph',
    templateUrl: './d3-flot-timeseries-graph.component.html',
    styleUrls: ['./d3-flot-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3FlotTimeseriesGraphComponent
    extends DatasetGraphComponent<DatasetOptions, PlotOptions>
    implements AfterViewInit {

    @Output()
    public onHoverHighlight: EventEmitter<number> = new EventEmitter();
    

    @ViewChild('d3flot')
    public d3Elem: ElementRef;

    private preparedData = Array(); // : DataSeries[]

    private rawSvg: any;
    private graph: any;
    private xAxisRange: any; // x domain range
    private yAxisRange: any; // y domain range
    private xDomainMin: any; // y domain range
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
    // private lineTs: d3.Line<DataEntry>
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
    private dragMoveRange: [number, number];

    private dragRect: any;
    private dragRectG: any;
    // private diagramValueData = Array(); // : DataEntry[] = [];

    private plotOptions: PlotOptions = {
        grid: {
            autoHighlight: true,
            hoverable: true
        },
        series: {
            lines: {
                fill: false,
                show: true
            },
            points: {
                fill: true,
                radius: 2,
                show: false
            },
            shadowSize: 1
        },
        selection: {
            mode: null
        },
        xaxis: {
            mode: 'time',
            timezone: 'browser',
        },
        yaxes: [],
        showReferenceValues: false
    };

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
    }

    protected addDataset(id: string, url: string): void {
        this.api.getSingleTimeseries(id, url).subscribe(
            (timeseries) => this.loadDataset(timeseries),
            (error) => {
                this.api.getDataset(id, url).subscribe(
                    (dataset) => this.loadDataset(dataset)
                );
            }
        );
    }
    protected removeDataset(internalId: string): void {
    }
    protected setSelectedId(internalId: string): void {
    }
    protected removeSelectedId(internalId: string): void {
    }
    protected graphOptionsChanged(options: PlotOptions): void {
    }
    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean) {
    }
    protected timeIntervalChanges(): void {
    }
    protected onResize(): void {
        this.plotGraph();
    }

    // load data of dataset
    private loadDataset(dataset: IDataset) {
        const datasetOptions = this.datasetOptions.get(dataset.internalId);

        if (dataset instanceof Timeseries) {
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);

            this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                {
                    format: 'flot',
                    expanded: this.plotOptions.showReferenceValues === true,
                    generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                }
            ).subscribe(
                (result) => this.prepareTsData(dataset, result).subscribe(() => {
                    // this.plotGraph();
                }),
                (error) => this.onError(error),
                () => console.log("loadDataset() - complete data loaded") // this.onCompleteLoadingData(dataset)
            );
        }
    }

    // add dataset to preparedData
    private prepareTsData(dataset: IDataset, data: Data<[number, number]>): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {

            const styles = this.datasetOptions.get(dataset.internalId);

            const dataEntry = {
                internalId: dataset.internalId,
                color: styles.color,
                data: styles.visible ? data.values : [],
                points: {
                    fillColor: styles.color
                },
                lines: {
                    lineWidth: 1
                },
                bars: {
                    lineWidth: 1
                },
                axisOptions: {
                    uom: dataset.uom,
                    label: dataset.label
                }
            };
            this.preparedData.push(dataEntry);

            this.xAxisRange = "start";

            // wait till all datasets are loaded
            // if (this.preparedData.length == this.datasetIds.length) {
                this.plotGraph();
            // }

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

        if (this.xAxisRange === "start") {
            return [1519293900000, 1519327800000]; // TODO: set as default for testing moving graph
        }

        if (this.xAxisRange === "zoomed") {
            var min = this.xDomainMin;
            var max = this.xDomainMax;
        } else {
            var min = this.preparedData[0].data[0][0];
            var max = this.preparedData[0].data[this.preparedData[0].data.length-1][0];
            
            this.preparedData.forEach((entry) => {

                const range = d3.extent<DataEntry, number>(entry.data, (datum, index, array) => {
                    return datum[0]; // datum[0] = timestamp -- datum[1] = value
                });
                if (min >= range[0]) { min = range[0]; }
                if (max <= range[1]) { max = range[1]; }
            })
        }
        return [ min, max ];
    }

    // get value range for y axis
    private getyAxisRange() {
        var min = this.preparedData[0].data[0][1];
        var max = this.preparedData[0].data[1][1];

        this.preparedData.forEach((entry) => {
            // TODO: only if y axis the same

            // get min and max value of data
            const range = d3.extent<DataEntry, number>(entry.data, (datum, index, array) => {
                return datum[1]; // datum[0] = timestamp -- datum[1] = value 
            });
            if (min >= range[0]) { min = range[0]; }
            if (max <= range[1]) { max = range[1]; }
        })

        return [ min, max ];
    }

    private plotGraph() {
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();

        this.bufferSum = 0;
        this.yScaleBase = null;

        // get range of x and y axis
        this.xAxisRange = this.getxAxisRange();
        this.yAxisRange = this.getyAxisRange();

        // #####################################################

        this.preparedData.forEach((entry) => {
            entry.axisOptions.first = (this.yScaleBase === null);
            entry.axisOptions.offset = this.bufferSum;
            
            const yAxisResult = this.drawYaxis(entry);
            if (this.yScaleBase === null) {
                this.yScaleBase = yAxisResult.yScale;
            } else {
                this.bufferSum = yAxisResult.buffer;
            }
            entry.yScale = yAxisResult.yScale;
        })

        if (!this.yScaleBase) {
            return;
        }

        // draw x and y axis
        this.drawXaxis(this.bufferSum);

        this.preparedData.forEach((entry) => {
            this.drawGraphLine(entry);
        })

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
            .on('mouseout.focus', this.mouseoutHandler)
            .call(d3.drag()
                .on("start", this.dragMoveStartHandler)
                .on("drag", this.dragMoveHandler)
                .on("end", this.dragMoveEndHandler)
            );
            // .on('mousedown.drag', this.dragMoveStartHandler)
            // .on('mousemove.drag', this.dragMoveHandler)
            // .on('mouseup.drag', this.dragMoveEndHandler)
            // .on('mousedown.drag', this.dragStartHandler)
            // .on('mousemove.drag', this.dragHandler)
            // .on('mouseup.drag', this.dragEndHandler);

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
                .style('fill', 'white')
                .style('stroke', 'none')
                .style('pointer-events', 'none');
            entry.focusLabel = this.focusG.append('svg:text').attr('class', 'mouse-focus-label-x')
                .style('pointer-events', 'none')
                .style('fill', entry.color)
                .style('font-weight', 'lighter');

            this.focuslabelTime = this.focusG.append('svg:text')
                .style('pointer-events', 'none')
                .attr('class', 'mouse-focus-label-x');
        })
    }

    private drawXaxis(bufferXrange: number) {
        // range for x axis scale
        this.xScaleBase = d3.scaleLinear()    // this.xScaleBase = d3.scaleLinear()
            .domain( [ this.xAxisRange[0] , this.xAxisRange[1] ] ) // .domain( [ data[0][0] , data[data.length-1][0] ] )
            .range( [bufferXrange , this.width] );
        
        const xAxisGen = d3.axisBottom(this.xScaleBase).ticks(5);
        
        xAxisGen.tickFormat((d) => {
            return d3.timeFormat('%d.%m.%Y %H:%M:%S')(new Date(d.valueOf()));
        });
        
        // draw x axis
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxisGen);
        
        // draw the x grid lines
        this.graph.append('svg:g')
            .attr('class', 'grid')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScaleBase)
                .ticks(10)
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

    private drawYaxis(entry: DataEntry): any {
        const range = d3.extent<DataEntry, number>(entry.data, (datum, index, array) => {
            return datum[1]; // datum[0] = timestamp -- datum[1] = value 
        });
        
        let yMin = range[0];
        let yMax = range[1];

        // range for y axis scale                
        const rangeOffset = (yMax - yMin) * 0.10;
        const yScale = d3.scaleLinear()
            .domain([ yMin - rangeOffset, yMax + rangeOffset]) // .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height, 0]);

        var yAxisGen = d3.axisLeft(yScale).ticks(5);

        // draw y axis
        const axis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(yAxisGen);

        // draw y axis label
        const text = this.graph.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', entry.color)
            .text(entry.axisOptions.uom);

        const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h; // 17->15  this.getDimensions(text.node()).h;
        const buffer = entry.axisOptions.offset + (axisWidth < 30 ? 30 : axisWidth);

        if (!entry.axisOptions.first) {
            axis.attr('transform', 'translate(' + buffer + ', 0)');
        }

        const textOffset = !entry.axisOptions.first ? buffer : entry.axisOptions.offset;
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
        }
    }

    private drawGraphLine(entry: DataEntry) {
        var data = entry.data;

        var XscaleBase = this.xScaleBase;
        var YscaleBase = entry.yScale; // this.yScaleBase;

        // #####################################################
        // draw grah line
        this.graph
            .append("svg:path")
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', entry.color) // green
            .attr('stroke-width', 2)
            .attr("d", d3.line<DataEntry>()
            .x(function(d) {
                d.timestamp = d[0];
                const xDiagCoord = XscaleBase(d[0]);
                d.xDiagCoord = xDiagCoord;
                return xDiagCoord;
            })
            .y(function(d) {
                const yDiagCoord = YscaleBase(d[1]);
                d.yDiagCoord = yDiagCoord;
                return yDiagCoord; //yScale(d[options.id]);
            })
            .curve(d3.curveLinear));
    }


    private mousemoveHandler = () => {
        const coords = d3.mouse(this.background.node());
        this.preparedData.forEach((entry) => {
            const idx = this.getItemForX(coords[0] + this.bufferSum, entry.data);
            this.showDiagramIndicator(entry, idx);
            this.onHoverHighlight.emit(entry.data[idx][0]);
        })
    }

    private mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    // drag handling for move
    private dragMoveStartHandler = (d) => {
        this.draggingMove = false;
        this.dragMoveStart = d3.event.x;
        this.dragMoveRange = this.xAxisRange;
    }

    private dragMoveHandler = (d) => {
        this.draggingMove = true;
        if (this.dragMoveStart && this.draggingMove) {
            let xDomRange = this.getxDomainInv(this.dragMoveRange[0], this.dragMoveRange[1]);
            let diff = d3.event.x - d3.event.subject.x ;
            let newDomRange = this.getxDomain(xDomRange[0] + diff, xDomRange[1] + diff);
            this.setxDomain(newDomRange);

            this.plotGraph();

        }
    }

    private dragMoveEndHandler = (d) => {
        if (!this.dragMoveStart || !this.draggingMove) {
            // back to origin range (from - to)
            this.xAxisRange = "start";
            this.plotGraph();
        }
        this.dragMoveStart = null;
        this.draggingMove = false;
    }

    // drag handling for zoom
    private dragStartHandler = () => {
        this.dragging = false;
        this.dragStart = d3.mouse(this.background.node());
    }

    private dragHandler = () => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    private dragEndHandler = () => {
        if (!this.dragStart || !this.dragging) {
            // back to origin range (from - to)
            this.xAxisRange = undefined;
            this.plotGraph();
        } else {
            if (this.dragStart[0] <= this.dragCurrent[0]) {
                let xDomainRange = this.getxDomain(this.dragStart[0], this.dragCurrent[0]);
                this.setxDomain(xDomainRange);
            } else {
                let xDomainRange = this.getxDomain(this.dragCurrent[0], this.dragStart[0]);
                this.setxDomain(xDomainRange);
            }
            this.plotGraph();
        }
        this.dragStart = null;
        this.dragging = false;
        this.resetDrag();
    }

    // set x range when drag
    private setxDomain(xDomainRange: Array<number>) {
        this.xDomainMin = xDomainRange[0];
        this.xDomainMax = xDomainRange[1];
        this.xAxisRange = "zoomed";
    }

    // return timestamp of provided diagram coord
    private getxDomain(start: number, end: number) {
        let domMinArr = [];
        let domMaxArr = [];
        let domMin;
        let domMax;
        let tmp;
        let lowest = Number.POSITIVE_INFINITY;
        let highest = Number.NEGATIVE_INFINITY;

        start += this.bufferSum;
        end += this.bufferSum;

        this.preparedData.forEach((entry) => {
            domMinArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord >= start) {
                    return array[index];
                }
            }))
            domMaxArr.push(entry.data.find((elem, index, array) => {
                if (elem.xDiagCoord >= end) {
                    return array[index-1]
                } 
            }))
        })

        for (let i=0; i<=domMinArr.length-1; i++) {
            tmp = domMinArr[i].xDiagCoord;
            if (tmp < lowest) {
                lowest = tmp;
                domMin = domMinArr[i].timestamp;
            }
        }
        for (let j=0; j<=domMaxArr.length-1; j++) {
            tmp = domMaxArr[j].xDiagCoord;
            if (tmp > highest) {
                highest = tmp;
                domMax = domMaxArr[j].timestamp;
            }
        }

        return [domMin, domMax];
    }

    // return diagram coord of provided timestamp
    private getxDomainInv(start: number, end: number) {

        let domMinArr = [];
        let domMaxArr = [];
        let domMin;
        let domMax;
        let tmp;
        let lowest = Number.POSITIVE_INFINITY;
        let highest = Number.NEGATIVE_INFINITY;

        start += this.bufferSum;
        end += this.bufferSum;

        this.preparedData.forEach((entry) => {
            domMinArr.push(entry.data.find((elem, index, array) => {
                if (elem.timestamp >= start) {
                    return array[index];
                }
            }))
            domMaxArr.push(entry.data.find((elem, index, array) => {
                if (elem.timestamp >= end) {
                    return array[index-1]
                } 
            }))
        })

        for (let i=0; i<=domMinArr.length-1; i++) {
            tmp = domMinArr[i].timestamp;
            if (tmp < lowest) {
                lowest = tmp;
                domMin = domMinArr[i].xDiagCoord;
            }
        }
        for (let j=0; j<=domMaxArr.length-1; j++) {
            tmp = domMaxArr[j].timestamp;
            if (tmp > highest) {
                highest = tmp;
                domMax = domMaxArr[j].xDiagCoord;
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

    private prepareRange(from: number, to: number) { //: D3SelectionRange {
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
            return d[0]
        }).left;
        return bisectDate(data, index);
    }

    private hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
    }

    private showDiagramIndicator = (entry, idx: number) => {
        const item = entry.data[idx];
        // create line where mouse is
        this.focusG.style('visibility', 'visible');
        this.highlightFocus
            .attr('x1', item.xDiagCoord)
            .attr('y1', 0)
            .attr('x2', item.xDiagCoord)
            .attr('y2', this.height)
            .classed('hidden', false);

        let onLeftSide = false;
        if ((this.background.node().getBBox().width + this.bufferSum) / 2 > item.xDiagCoord) { onLeftSide = true; }

        this.showLabelValues(entry, item, onLeftSide);
        this.showTimeIndicatorLabel(item, onLeftSide);
    }

    private showLabelValues(entry, item: DataEntry, onLeftSide: boolean) {
        // var entry = this.preparedData[0]; // this.baseValues --> item[internalId]
        var id = 1;
            if (entry.focusLabel) {
                entry.focusLabel.text(item[id] + 'cm'); // cm --> (entry.dataset.uom ? entry.dataset.uom : '')
                const entryX = onLeftSide ?
                    item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w;
                entry.focusLabel
                    .attr('x', entryX)
                    .attr('y', item.yDiagCoord)
                    // .attr('y', this.calculateHeight() - 5)
                    // .attr('y', entry.yScale(item[id]) + this.getDimensions(entry.focusLabel.node()).h - 3); // TODO: entry.yScale(item[id])
                entry.focusLabelRect
                    .attr('x', entryX)
                    // .attr('y', entry.yScale(item[id]))
                    .attr('y', item.yDiagCoord -18)
                    // .attr('y', this.calculateHeight() - 20)
                    .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                    .attr('height', this.getDimensions(entry.focusLabel.node()).h);
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