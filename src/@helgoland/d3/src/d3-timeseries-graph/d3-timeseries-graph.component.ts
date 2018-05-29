import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    IterableDiffers,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    DatasetApiInterface,
    Data,
    DatasetPresenterComponent,
    DatasetOptions,
    IDataset,
    InternalIdHandler,
    Time,
    Timeseries,
    Timespan,
} from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import * as d3 from 'd3';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

interface DataEntry {
    [id: string]: any;
    xDiagMin?: number;
    xDiagMax?: number;
    yDiagMin?: number;
    yDiagMax?: number;
    xDiagCoord?: number;
}

interface DataConst extends IDataset {
    data?: Data<[number, number]>;
}

@Component({
    selector: 'n52-d3-timeseries-graph',
    templateUrl: './d3-timeseries-graph.component.html',
    styleUrls: ['./d3-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3TimeseriesGraphComponent
    extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions>
    implements AfterViewInit {

    // @Input()
    // public highlight: boolean;

    @Output()
    public onSelectId: EventEmitter<any> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    private preparedData = Array(); // : DataSeries[]

    // set zoom limit --> can be adapted to needs
    private config = {
        time: {
            zoomLimit: 10800000  // 3 hour ((3 * 3600) * 1000) limitation
        }
    };

    private rawSvg: any;
    private graph: any;
    private graphBody: any;
    private xAxisRange: any; // x domain range
    private xAxisRangeOrigin: any; // x domain range
    private xAxisRangePan: [number, number]; // x domain range
    private yAxisRange: any; // y domain range
    private yRangesEachUom: any; // y array of objects containing ranges for each uom
    private dataYranges: any; // y array of objects containing ranges of all datasets
    private ypos: any; // y array of objects containing ranges of all datasets
    private idxOfPos = 0;

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
    private bufferSum: number;
    private labelTimestamp: any;

    private dragging: boolean;
    private dragStart: [number, number];
    private dragCurrent: [number, number];

    private draggingMove: boolean;
    private dragMoveStart: [number, number];
    private dragMoveRange: [number, number];

    private dragRect: any;
    private dragRectG: any;

    private toHighlightDataset: any;
    private addLineWidth = 2; // value added to linewidth

    private plotOptions: D3PlotOptions = {
        showReferenceValues: false,
        generalizeAllways: true
    };

    private datasetMap: Map<string, DataConst> = new Map();

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: DatasetApiInterface,
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

        this.dataYranges = new Array();
        this.xAxisRangeOrigin = new Array();
    }

    public reloadData(): void {
        // not implemented yet
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
        console.log('removed ' + internalId);
        this.dataYranges = new Array();
        this.xAxisRangeOrigin = new Array();

        this.datasetMap.delete(internalId);
        this.preparedData.splice(this.preparedData.findIndex((entry) => entry.internalId === internalId), 1);
        let newPrepData = this.preparedData;
        this.preparedData = new Array();
        if (newPrepData.length <= 0) {
            this.plotGraph();
        } else {
            newPrepData.forEach((entry, idx) => {
                this.preparedData.push(entry);
                this.processData(entry, entry.internalId);
            });
        }
    }
    protected setSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (!tsData.selected || tsData.selected === undefined) {
            tsData.selected = true;
            tsData.lines.lineWidth += this.addLineWidth;
            tsData.lines.pointRadius += this.addLineWidth;
            tsData.bars.lineWidth += this.addLineWidth;
        }
        this.plotGraph();
    }
    protected removeSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (tsData.selected || tsData.selected === undefined) {
            tsData.selected = false;
            tsData.lines.lineWidth -= this.addLineWidth;
            tsData.lines.pointRadius -= this.addLineWidth;
            tsData.bars.lineWidth -= this.addLineWidth;
        }
        this.plotGraph();
    }
    protected graphOptionsChanged(options: D3PlotOptions): void {
        Object.assign(this.plotOptions, options);
        if (this.rawSvg) {
            this.plotGraph();
        }
    }
    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean) {
        if (!firstChange && this.datasetMap.has(internalId)) {
            this.loadDataset(this.datasetMap.get(internalId));
        }
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
        if (to - from < this.config.time.zoomLimit) {
            to = from + this.config.time.zoomLimit;
        }
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
                    expanded: this.plotOptions.showReferenceValues === true,
                    generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                }
            ).subscribe(
                (result) => {
                    this.datasetMap.get(dataset.internalId).data = result;
                    this.prepareTsData(dataset).subscribe(() => {
                        console.log('plotGraph ??? ');
                    });
                },
                (error) => this.onError(error),
                () => console.log('loadDataset() - complete data loaded') // this.onCompleteLoadingData(dataset)
            );
        }
    }

    private processDataset(internalId) {
        let idx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
        this.processData(this.preparedData[idx], internalId);
    }

    // add dataset to preparedData
    private prepareTsData(dataset: IDataset): Observable<boolean> { // , data: Data<[number, number]>
        return Observable.create((observer: Observer<boolean>) => {
            const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            const styles = this.datasetOptions.get(dataset.internalId);
            const data = this.datasetMap.get(dataset.internalId).data;
            // TODO: change uom for testing
            // if (this.preparedData.length > 0) {
                // dataset.uom = 'mc';
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
                    lineWidth: styles.lineWidth,
                    pointRadius: styles.pointRadius
                },
                bars: {
                    lineWidth: styles.lineWidth
                },
                axisOptions: {
                    uom: dataset.uom,
                    label: dataset.label
                },
                visible: styles.visible
            };
            // alternative linewWidth = this.plotOptions.selected.includes(dataset.uom)

            if (this.selectedDatasetIds.indexOf(dataset.internalId) >= 0) {
                dataEntry.lines.lineWidth += this.addLineWidth;
                dataEntry.lines.pointRadius += this.addLineWidth;
                dataEntry.bars.lineWidth += this.addLineWidth;
            }

            if (datasetIdx >= 0) {
                this.preparedData[datasetIdx] = dataEntry;
            } else {
                this.preparedData.push(dataEntry);
            }
            this.addReferenceValueData(dataset.internalId, styles, data, dataset.uom);
            this.processData(dataEntry, dataset.internalId);
            this.plotGraph();
        });
    }

    private addReferenceValueData(internalId: string, styles: DatasetOptions, data: Data<[number, number]>, uomO: string) {
        this.preparedData = this.preparedData.filter((entry) => {
            return !entry.internalId.startsWith('ref' + internalId);
        });
        if (this.plotOptions.showReferenceValues) {
            styles.showReferenceValues.forEach((refValue) => {
                const refDataEntry = {
                    internalId: 'ref' + internalId + refValue.id,
                    color: refValue.color,
                    data: data.referenceValues[refValue.id],
                    points: {
                        fillColor: refValue.color
                    },
                    lines: {
                        lineWidth: 1
                    },
                    axisOptions: {
                        uom: uomO
                    }
                };
                this.preparedData.push(refDataEntry);
            });
        }
    }

    private processData(dataEntry, internalId) {
        // get min and max value of data
        const range = d3.extent<DataEntry, number>(dataEntry.data, (datum, index, array) => {
            return datum[1]; // datum[0] = timestamp -- datum[1] = value
        });

        let min = range[0];
        let max = range[1];
        if (min === max) {
            min = min - (min * 0.1);
            max = max + (max * 0.1);
        }

        const newDatasetIdx = this.preparedData.findIndex((e) => e.internalId === internalId);

        // set range, uom and id for each dataset
        if (dataEntry.visible) {
            this.dataYranges[newDatasetIdx] = {
                uom: dataEntry.axisOptions.uom,
                range: [min, max],
                id: internalId
            };
        } else {
            this.dataYranges[newDatasetIdx] = null;
        }

        // set range and array of IDs for each uom to generate y-axis later on
        this.yRangesEachUom = [];
        this.dataYranges.forEach((obj) => {
            if (obj !== null) {
                let idx = this.yRangesEachUom.findIndex((e) => e.uom === obj.uom);
                let yrangeObj = {
                    uom: obj.uom,
                    range: obj.range,
                    ids: [obj.id]
                };
                if (idx >= 0) {
                    if (this.yRangesEachUom[idx].range[0] > obj.range[0]) {
                        this.yRangesEachUom[idx].range[0] = obj.range[0];
                    }
                    if (this.yRangesEachUom[idx].range[1] < obj.range[1]) {
                        this.yRangesEachUom[idx].range[1] = obj.range[1];
                    }
                    this.yRangesEachUom[idx].ids.push(obj.id);
                } else {
                    this.yRangesEachUom.push(yrangeObj);
                }
            }
        });
        this.plotGraph();
    }

    private calculateHeight(): number {
        return this.rawSvg.node().height.baseVal.value - this.margin.top - this.margin.bottom;
    }

    private calculateWidth(): number {
        return this.rawSvg.node().width.baseVal.value - this.margin.left - this.margin.right - this.maxLabelwidth;
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

        for (let i = 0; i <= this.yRangesEachUom.length; i++) {
            if (this.yRangesEachUom[i].uom === uom) {
                return this.yRangesEachUom[i].range;
            }
        }

        return null; // error: uom does not exist
    }

    private plotGraph() {
        console.log(JSON.stringify(this.plotOptions));
        console.log(this.plotOptions.grid);
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();

        this.bufferSum = 0;
        this.yScaleBase = null;

        // get range of x and y axis
        this.xAxisRange = [this.timespan.from, this.timespan.to];

        // #####################################################

        this.yRangesEachUom.forEach((entry) => {
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

    private timeTickValues(time: String, range: any, span: number) {
        if (time === 'minly') {
            return d3.timeMinutes(range, this.xAxisRange[1], span);
        }
        if (time === 'hourly') {
            return d3.timeHours(range, this.xAxisRange[1], span);
        }
        if (time === 'daily') {
            return d3.timeDay.range(range, this.xAxisRange[1], span);
        }
    }

    private drawXaxis(bufferXrange: number) {
        // range for x axis scale
        this.xScaleBase = d3.scaleLinear()
            .domain([this.xAxisRange[0], this.xAxisRange[1]])
            .range([bufferXrange, this.width]);

        // calculate range for about 7 ticks on x axis
        let calcTicks = (((this.xAxisRange[1] - this.xAxisRange[0]) / 1000) / 7);
        let hourly = Math.ceil(calcTicks / 3600);
        let daily = Math.ceil(calcTicks / (3600 * 48));

        if ((calcTicks / 3600) <= 0.6) {
            hourly = 0.5;
        }

        let tickSize = hourly;
        let timeString = 'hourly';
        let timeFormatString = '%H:%M:%S';

        if (hourly > 11) {
            timeFormatString = '%d %b %H:%M';
        }

        if (hourly > 47) {
            timeFormatString = '%d %B';
            tickSize = (Math.max(1, Math.round(hourly / 12))) * 12;
        }

        // calculate minimum range dependent on tickSize for UTC // 7200000 (e.g. tickSize = 4 --> every 4 hours)
        let minRange = this.xAxisRange[0] + ((3600000 * tickSize) - (this.xAxisRange[0] % (3600000 * tickSize)));
        // minimum range for UTC+2
        let minRangeGer = minRange + 3600000 * (tickSize / 2);
        if ((minRange - 3600000 * (tickSize / 2)) >= this.xAxisRange[0]) {
            minRangeGer = minRange - 3600000 * (tickSize / 2);
        }

        // calculate tickvalues dependent on tickSize for UTC+2
        let xAxisGen;
        if (tickSize >= 1) {
            xAxisGen = d3.axisBottom(this.xScaleBase)
                .tickValues(this.timeTickValues(timeString, minRangeGer, tickSize))
                .tickFormat((d) => {
                    return d3.timeFormat(timeFormatString)(new Date(d.valueOf()));
                });
        } else {
            timeString = 'minly';
            xAxisGen = d3.axisBottom(this.xScaleBase)
                .tickValues(this.timeTickValues(timeString, minRangeGer, 30))
                .tickFormat((d) => {
                    return d3.timeFormat(timeFormatString)(new Date(d.valueOf()));
                });
        }

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
            .call(xAxisGen
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
        let showAxis = (this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis.show);
        const range = this.getyAxisRange(entry.uom);

        let yMin = range[0];
        let yMax = range[1];

        // range for y axis scale
        const rangeOffset = (yMax - yMin) * 0.10;
        const yScale = d3.scaleLinear()
            .domain([yMin - rangeOffset, yMax + rangeOffset])
            .range([this.height, 0]);

        let yAxisGen = d3.axisLeft(yScale).ticks(5);
        let buffer = 0;

        // only if yAxis should not be visible
        if (!showAxis) {
            yAxisGen
                .tickFormat(() => '')
                .tickSize(0);
        }

        // draw y axis
        const axis = this.graph.append('svg:g')
            .attr('class', 'y axis')
            .call(yAxisGen);

        // only if yAxis should be visible
        if (showAxis) {
            // draw y axis label
            const text = this.graph.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('fill', 'black')
                .text(entry.uom);

            const axisWidth = axis.node().getBBox().width + 5 + this.getDimensions(text.node()).h;
            // if yAxis should not be visible, buffer will be set to 0
            buffer = (showAxis ? entry.offset + (axisWidth < this.margin.left ? this.margin.left : axisWidth) : 0);

            const axisWidthDiv = entry.first ? this.margin.left : (axisWidth < this.margin.left ? this.margin.left : axisWidth);

            if (!entry.first) {
                axis.attr('transform', 'translate(' + buffer + ', 0)');
            }

            const textOffset = !entry.first ? buffer : entry.offset;
            text.attr('y', 0 - this.margin.left - this.maxLabelwidth + textOffset)
                .attr('x', 0 - (this.height / 2));

            const axisDiv = this.graph.append('rect')
                .attr('class', 'axisDiv')
                .attr('width', axisWidthDiv)
                .attr('height', this.height)
                .attr('fill', 'white')
                .attr('opacity', 0)
                .on('mouseover', (d, i, k) => {
                    d3.select(k[0])
                        .attr('fill', 'grey')
                        .attr('opacity', 0.4);
                })
                .on('mouseout', (d, i, k) => {
                    d3.select(k[0])
                        .attr('fill', 'white')
                        .attr('opacity', 0);
                })
                .on('mouseup', () => {
                    this.highlightLine(entry.ids, entry.uom);
                });

            if (!entry.first) {
                axisDiv
                    .attr('x', entry.offset)
                    .attr('y', 0);
            } else {
                axisDiv
                    .attr('x', 0 - this.margin.left - this.maxLabelwidth)
                    .attr('y', 0);
            }

        }

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

    private highlightLine(ids, uom) {
        this.toHighlightDataset = [];
        let changeFalse = [];
        let changeTrue = [];
        ids.forEach((ID) => {
            if (this.selectedDatasetIds.indexOf(ID) >= 0) {
                changeFalse.push({id: ID, change: false});
            }
            changeTrue.push({id: ID, change: true});
        });

        let changeAll = true;
        if (ids.length === changeFalse.length) {
            this.toHighlightDataset = changeFalse;
            changeAll = true;
        } else {
            this.toHighlightDataset = changeTrue;
            changeAll = false;
        }

        this.changeSelectedIds(this.toHighlightDataset, changeAll);
    }

    private changeSelectedIds(toHighlight: any, change: boolean) {
        if (change) {
            this.toHighlightDataset.forEach((obj) => {
                this.removeSelectedId(obj.id);
                this.selectedDatasetIds.splice(this.selectedDatasetIds.findIndex((entry) => entry === obj.id), 1);
            });
        } else {
            this.toHighlightDataset.forEach((obj) => {
                if (this.selectedDatasetIds.indexOf(obj.id) < 0) {
                    this.setSelectedId(obj.id);
                    this.selectedDatasetIds.push(obj.id);
                }
            });
        }

        this.onSelectId.emit(this.toHighlightDataset);
        this.plotGraph();
    }

    private drawGraphLine(entry: DataEntry) {
        let data = entry.data;
        const getYaxisRange = this.yRangesEachUom.find((obj, index) => {
            if (obj.uom === entry.axisOptions.uom) {
                return obj.yScale;
            } // uom does exist in this.yRangesEachUom
        });

        let xScaleBase = this.xScaleBase;
        if (getYaxisRange !== undefined) {
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

            // create graph line
            let line = d3.line<DataEntry>()
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
                .curve(d3.curveLinear);

            this.graphBody
                .append('svg:path')
                .datum(data)
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', entry.color)
                .attr('stroke-width', entry.lines.lineWidth)
                .attr('d', line);

            this.graphBody.selectAll('.dot')
                .data(data.filter((d) => { return d; }))
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('stroke', entry.color)
                .attr('fill', entry.color)
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', entry.lines.pointRadius);
        }
    }

    private mousemoveHandler = () => {
        const coords = d3.mouse(this.background.node());
        this.ypos = [];
        this.idxOfPos = 0;
        this.labelTimestamp = new Array();
        this.preparedData.forEach((entry, entryIdx) => {
            const idx = this.getItemForX(coords[0] + this.bufferSum, entry.data);
            this.showDiagramIndicator(entry, idx, coords[0], entryIdx);
        });
        // focus do not overlap each other
        if (this.ypos !== undefined) {
            let firstLabel = [];
            // only push one of the pairs of objects (rectangle and label)
            this.ypos.forEach((e, i) => {
                if (i % 2 === 0) {
                    firstLabel.push(e);
                }
            });
            let yPos = firstLabel.sort((a, b) => { return a.y - b.y; });
            yPos.forEach((p, i) => {
                if (i > 0) {
                    let last = yPos[i - 1].y;
                    yPos[i].off = Math.max(0, (last + 30) - yPos[i].y);
                    yPos[i].y += yPos[i].off;
                }
            });
            yPos.sort((a, b) => { return a.idx - b.idx; });

            let c1 = 0;
            let c2 = 0;

            // d3.selectAll('.mouse-focus-label')
            d3.selectAll('.focus-visibility')
                .attr('transform', (d, i) => {
                    // pairs of 2 objects (rectangle (equal) and label (odd))
                    if (i > 0) {
                        c1 = (i - 1) % 2;
                    }
                    c2 += c1;
                    if (yPos[c2] && yPos[c2].off) {
                        return 'translate(0,' + (5 + yPos[c2].off) + ')';
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
            this.timespan = { from: this.xAxisRangePan[0], to: this.xAxisRangePan[1] };
            this.plotGraph();

        }
    }

    private panEndHandler = () => {
        this.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
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

    private showDiagramIndicator = (entry, idx: number, xCoordMouse: number, entryIdx: number) => {
        const item = entry.data[idx];
        if (item !== undefined) {
            // create line where mouse is
            this.focusG.style('visibility', 'visible');
            // show label if data available for time
            this.chVisLabel(entry, true);

            let onLeftSide = false;
            if ((this.background.node().getBBox().width + this.bufferSum) / 2 > item.xDiagCoord) { onLeftSide = true; }

            let labelBuffer = ((this.timespan.from / (this.timespan.to - this.timespan.from)) * 0.0001)
                * ((this.timespan.from / (this.timespan.to - this.timespan.from)) * 0.0001);

            labelBuffer = Math.max(4, labelBuffer);

            this.showLabelValues(entry, item, onLeftSide);
            this.showTimeIndicatorLabel(item, onLeftSide, xCoordMouse, entryIdx);

            if ((xCoordMouse) > (item.xDiagCoord + labelBuffer) || (xCoordMouse) < (item.xDiagCoord - labelBuffer)) {
                // hide label if mouse to far from coordinate
                this.chVisLabel(entry, false);

                if (entry.data[idx - 1] && entry.data[idx - 1].xDiagCoord + labelBuffer >= xCoordMouse) {
                    this.showLabelValues(entry, entry.data[idx - 1], onLeftSide);
                    this.showTimeIndicatorLabel(item, onLeftSide, xCoordMouse, entryIdx);

                    this.chVisLabel(entry, true);
                }
            }
        } else {
            // hide label if no data available for time
            this.chVisLabel(entry, false);
        }
    }

    // function to change visibility of label and white rectangle inside graph (next to mouse-cursor line)
    private chVisLabel(entry, visible: boolean) {
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
        }
    }

    private showLabelValues(entry, item: DataEntry, onLeftSide: boolean) {
        let id = 1;
        if (entry.focusLabel) {
            entry.focusLabel.text(item[id] + (entry.axisOptions.uom ? entry.axisOptions.uom : ''));
            const entryX = onLeftSide ?
                item.xDiagCoord + 4 : item.xDiagCoord - this.getDimensions(entry.focusLabel.node()).w + 4;
            entry.focusLabel
                .attr('x', entryX)
                .attr('y', item.yDiagCoord);
            entry.focusLabelRect
                .attr('x', entryX)
                .attr('y', item.yDiagCoord - this.getDimensions(entry.focusLabel.node()).h + 3)
                .attr('width', this.getDimensions(entry.focusLabel.node()).w)
                .attr('height', this.getDimensions(entry.focusLabel.node()).h);

            this.ypos.push({ idx: this.idxOfPos++, y: item.yDiagCoord, off: 0 });
        }
    }

    private showTimeIndicatorLabel(item: DataEntry, onLeftSide: boolean, xCoord: number, entryIdx: number) {
        // timestamp is the time where the mouse-cursor is
        this.labelTimestamp[entryIdx] = item.timestamp;
        let min = d3.min(this.labelTimestamp);
        let idxOfMin = this.labelTimestamp.findIndex((elem) => elem === min);
        let right = item.xDiagCoord + 2;
        let left = item.xDiagCoord - this.getDimensions(this.focuslabelTime.node()).w - 2;
        this.focuslabelTime.text(moment(this.labelTimestamp[idxOfMin]).format('DD.MM.YY HH:mm'));
        this.focuslabelTime
            .attr('x', onLeftSide ? right : left)
            .attr('y', 13);
        if (item.timestamp === min) {
            this.highlightFocus
                .attr('x1', item.xDiagCoord)
                .attr('y1', 0)
                .attr('x2', item.xDiagCoord)
                .attr('y2', this.height)
                .classed('hidden', false);
        }
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
