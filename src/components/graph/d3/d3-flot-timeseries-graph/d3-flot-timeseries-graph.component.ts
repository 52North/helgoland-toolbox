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

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    latlng: L.LatLng;
    [id: string]: any;
    // internalId: any;
    // xDiagCoord?: number;
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
    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    private maxLabelwidth = 0;
    private lineTs: d3.Line<DataEntry>
    private xScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of x value
    private yScaleBase: d3.ScaleLinear<number, number>; // calculate diagram coord of y value
    private background: any;
    private focusG: any;
    private highlightFocus: any;
    private focuslabelTime: any;
    private focuslabelY: any;
    private bufferSum = 0;

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
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.lineTs = d3.line<DataEntry>()
        .x(function(d) {
            console.log(d[0]);
            const xDiagCoord = this.xScaleBase(d[0]);
            d.xdiagCoord = xDiagCoord;
            console.log(xDiagCoord);
            return xDiagCoord;
        })
        .y(function(d) {
            console.log(d[1]);
            this.yScaleBase(d[1]);
            return d[1];
        });

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
                    this.plotGraph();
                }),
                (error) => this.onError(error),
                () => console.log("loadDataset() - complete data loaded") // this.onCompleteLoadingData(dataset)
            );
        }
    }

    private prepareTsData(dataset: IDataset, data: Data<[number, number]>): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {

            console.log(dataset);

            const styles = this.datasetOptions.get(dataset.internalId);
            console.log(styles);

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
                }
            };
            console.log(dataEntry);

            this.preparedData.push(dataEntry);
            console.log(this.preparedData);

            this.plotGraph();
        });
    }
    
    private calculateHeight(): number {
        return this.rawSvg.node().clientHeight - this.margin.top - this.margin.bottom;
    }
    
    private calculateWidth(): number {
        return this.rawSvg.node().clientWidth - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    private plotGraph() {
        console.log("plotGraph()");

        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();

        var data = this.preparedData[0].data;

        // #####################################################
        var bufferXrange = 0;

        // range for x axis scale
        var varxScaleBase = d3.scaleLinear()    // this.xScaleBase = d3.scaleLinear()
            .domain( [ data[0][0] , data[data.length-1][0] ] )
            .range( [bufferXrange , this.width] );

        this.xScaleBase = varxScaleBase;
        
        const xAxisGen = d3.axisBottom(varxScaleBase).ticks(5);
        
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
            .call(d3.axisBottom(varxScaleBase)
                .ticks(10)
                .tickSize(-this.height)
                .tickFormat(() => '')
            );

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(varxScaleBase).ticks(0).tickSize(0));

        // text label for the x axis
        this.graph.append('text')
            .attr('x', (this.width + bufferXrange) / 2)
            .attr('y', this.height + this.margin.bottom - 5)
            .style('text-anchor', 'middle')
            .text('time');

        // #####################################################
        // range for y axis scale
        const range = d3.extent<DataEntry, number>(data, (datum, index, array) => {
            return datum[1]; // here with ID
        });
            
        const rangeOffset = (range[1] - range[0]) * 0.10;
        var varyScaleBase = d3.scaleLinear()
            .domain([range[0] - rangeOffset, range[1] + rangeOffset])
            .range([this.height, 0]);

        this.yScaleBase = varyScaleBase;

        var yAxisGen = d3.axisLeft(varyScaleBase).ticks(5);

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
            .text('cm'); // dataset.uom
        const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h; // 17->15  this.getDimensions(text.node()).h;
        const buffer = 0 + (axisWidth < 30 ? 30 : axisWidth); // options.offset = 0

        const textOffset = 0; // !options.first ? buffer : options.offset;
        text.attr('y', 0 - this.margin.left - this.maxLabelwidth + textOffset)
            .attr('x', 0 - (this.height / 2));

        // draw the y grid lines
        if (this.datasetIds.length === 1) {
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .call(d3.axisLeft(varyScaleBase)
                    .ticks(5)
                    .tickSize(-this.width)
                    .tickFormat(() => '')
                );
        }

        // #####################################################
        // draw grah line
        this.graph
            .append("svg:path")
            .datum(data)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', this.preparedData[0].color) // green
            .attr('stroke-width', 2)
            .attr("d", d3.line<DataEntry>()
            .x(function(d) {
                const xDiagCoord = varxScaleBase(d[0]);
                d.xDiagCoord = xDiagCoord;
                return xDiagCoord;
            })
            .y(function(d) {
                return varyScaleBase(d[1]); //yScale(d[options.id]);
            })
            .curve(d3.curveLinear));

        console.log(this.preparedData);
        
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

        // label inside graph
        this.preparedData[0].focusLabelRect = this.focusG.append('svg:rect')
            .style('fill', 'white')
            .style('stroke', 'none')
            .style('pointer-events', 'none');
        this.preparedData[0].focusLabel = this.focusG.append('svg:text').attr('class', 'mouse-focus-label-x')
            .style('pointer-events', 'none')
            .style('fill', this.preparedData[0].color)
            .style('font-weight', 'lighter');

        this.focuslabelTime = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-x');
        this.focuslabelY = this.focusG.append('svg:text')
            .style('pointer-events', 'none')
            .attr('class', 'mouse-focus-label-y');

    }


    private mousemoveHandler = () => {
        const coords = d3.mouse(this.background.node());
        const idx = this.getItemForX(coords[0] + this.bufferSum, this.preparedData[0].data);
        this.showDiagramIndicator(idx);
        this.onHoverHighlight.emit(this.preparedData[0].data[idx][0]);
    }

    private mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    // private dragStartHandler = () => {
    //     this.dragging = false;
    //     this.dragStart = d3.mouse(this.background.node());
    // }

    // private dragHandler = () => {
    //     this.dragging = true;
    //     this.drawDragRectangle();
    // }

    // private dragEndHandler = () => {
    //     if (!this.dragStart || !this.dragging) {
    //         this.onSelectionChangedFinished.emit({ from: 0, to: this.dataLength });
    //     } else {
    //         const from = this.getItemForX(this.dragStart[0] + this.bufferSum, this.baseValues);
    //         const to = this.getItemForX(this.dragCurrent[0] + this.bufferSum, this.baseValues);
    //         this.onSelectionChangedFinished.emit(this.prepareRange(this.baseValues[from].tick, this.baseValues[to].tick));
    //     }
    //     this.dragStart = null;
    //     this.dragging = false;
    //     this.resetDrag();
    // }

    private getItemForX(x: number, data: DataEntry[]) {
        const index = this.xScaleBase.invert(x);
        const bisectDate = d3.bisector((d: DataEntry) => {
            return d[0]
        }).left;
        return bisectDate(this.preparedData[0].data, index);
    }

    private hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
    }

    private showDiagramIndicator = (idx: number) => {
        const item = this.preparedData[0].data[idx];
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
    }

    private showLabelValues(item: DataEntry, onLeftSide: boolean) {
        var entry = this.preparedData[0];
        var id = 1;
                if (entry.focusLabel) {
                    entry.focusLabel.text(item[id] + 'cm'); // cm --> (entry.dataset.uom ? entry.dataset.uom : '')
                    const entryX = onLeftSide ?
                        item.xDiagCoord + 2 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w;
                    entry.focusLabel
                        .attr('x', entryX)
                        .attr('y', this.calculateHeight() - 5)
                        // .attr('y', entry.yScale(item[id]) + this.getDimensions(entry.focusLabel.node()).h - 3); // TODO: entry.yScale(item[id])
                    entry.focusLabelRect
                        .attr('x', entryX)
                        // .attr('y', entry.yScale(item[id]))
                        .attr('y', this.calculateHeight() - 20)
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
