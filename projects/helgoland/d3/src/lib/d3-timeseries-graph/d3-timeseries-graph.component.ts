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
    ColorService,
    DatasetApiInterface,
    Data,
    DatasetPresenterComponent,
    DatasetOptions,
    IDataset,
    InternalIdHandler,
    Time,
    Timeseries,
    Timespan,
    MinMaxRange,
} from '@helgoland/core';
import * as d3 from 'd3';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { D3PlotOptions } from '../model/d3-plot-options';

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

    @Input()
    // difference to timespan/timeInterval --> if brush, then this is the timespan of the main-diagram
    public mainTimeInterval: Timespan;

    @Output()
    public onSelectId: EventEmitter<any> = new EventEmitter();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    // set zoom limit --> can be adapted to needs
    private config = {
        time: {
            zoomLimit: 10800000  // 3 hour ((3 * 3600) * 1000) limitation
        }
    };

    private preparedData = Array(); // : DataSeries[]
    private mousedownBrush: boolean;
    private rawSvg: any;
    private graph: any;
    private graphBody: any;
    private xAxisRange: any; // x domain range
    private xAxisRangeOrigin: any; // x domain range
    private xAxisRangePan: [number, number]; // x domain range
    private yRangesEachUom: any; // y array of objects containing ranges for each uom
    private defaultYaxisRange: boolean;
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

    private loadingCounter = 0;
    private currentTimeId: any;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: DatasetApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        private colorService: ColorService
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    public ngAfterViewInit(): void {
        this.currentTimeId = this.uuidv4();

        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.mousedownBrush = false;
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
        let spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
        if (spliceIdx >= 0) {
            this.preparedData.splice(spliceIdx, 1);
            if (this.preparedData.length <= 0) {
                this.yRangesEachUom = new Array();
                this.plotGraph();
            } else {
                this.preparedData.forEach((entry, idx) => {
                    this.processData(entry, entry.internalId);
                });
            }
        }
    }
    protected setSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (!tsData.selected || tsData.selected === undefined) {
            tsData.selected = true;
            tsData.lines.lineWidth += this.addLineWidth;
            // tsData.lines.pointRadius += this.addLineWidth;
            tsData.bars.lineWidth += this.addLineWidth;
        }
        this.plotGraph();
    }
    protected removeSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (tsData.selected || tsData.selected === undefined) {
            tsData.selected = false;
            tsData.lines.lineWidth -= this.addLineWidth;
            // tsData.lines.pointRadius -= this.addLineWidth;
            tsData.bars.lineWidth -= this.addLineWidth;
        }
        this.plotGraph();
    }
    protected graphOptionsChanged(options: D3PlotOptions): void {
        Object.assign(this.plotOptions, options);
        if (this.rawSvg && this.yRangesEachUom) {
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

    private isContentLoadingD3(loading: boolean): void {
        this.onContentLoading.emit(loading);
    }

    private loadAddedDataset(dataset: IDataset) {
        this.datasetMap.set(dataset.internalId, dataset);
        this.loadDataset(dataset);
    }

    // load data of dataset
    private loadDataset(dataset: IDataset) {
        const datasetOptions = this.datasetOptions.get(dataset.internalId);
        if (this.loadingCounter === 0) {
            this.isContentLoadingD3(true); }
        this.loadingCounter++;

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
                () => {
                    console.log('loadDataset() - complete data loaded');
                    this.onCompleteLoadingData();
                }
            );
        }
    }

    private onCompleteLoadingData() {
        this.loadingCounter--;
        if (this.loadingCounter === 0) { this.isContentLoadingD3(false); }
    }

    /**
     * Function to prepare each dataset for the graph and adding it to an array of datasets.
     * @param dataset {IDataset} Object of the whole dataset
     */
    private prepareTsData(dataset: IDataset): Observable<boolean> { // , data: Data<[number, number]>
        return Observable.create((observer: Observer<boolean>) => {
            const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            const styles = this.datasetOptions.get(dataset.internalId);
            const data = this.datasetMap.get(dataset.internalId).data;

            // TODO: change uom for testing
            // if (this.preparedData.length > 0) {
            //     dataset.uom = 'mc';
            // }

            // set timeseries invisible, if no data is provided for selected timerange
            if (data.values.length === 0) {
                styles.visible = false;
            } else {
                if (!styles.visualize) {
                    styles.visible = false;
                } else {
                    styles.visible = true;
                }
            }

            // generate random color, if color is not defined
            if (styles.color === undefined) {
                styles.color = this.colorService.getColor();
            }


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
                    label: dataset.label,
                    zeroBased: styles.zeroBasedYAxis,
                    yAxisRange: styles.yAxisRange
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

    /**
     * Function to add referencevaluedata to the dataset (e.g. mean).
     * @param internalId {String} String with the id of a dataset
     * @param styles {DatasetOptions} Object containing information for dataset styling
     * @param data {Data} Array of Arrays containing the measurement-data of the dataset
     * @param uomO {String} String with the uom of a dataset
     */
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

    /**
     * Function that processes the data to calculate y axis range of each dataset.
     * @param dataEntry {DataEntry} Object containing dataset related data.
     * @param internalId {String} String with the ID of a dataset.
     */
    private processData(dataEntry, internalId) {
        let min;
        let max;

        let yAxisRange = dataEntry.axisOptions.yAxisRange as MinMaxRange;

        // get min and max value of data
        const range = d3.extent<DataEntry, number>(dataEntry.data, (datum, index, array) => {
            return datum[1]; // datum[0] = timestamp -- datum[1] = value
        });

        let outOfrange = false;

        if (yAxisRange.min > yAxisRange.max) {
            min = yAxisRange.max;
            max = yAxisRange.min;
            if (min > range[1] || max < range[0]) {
                outOfrange = true;
            }
        } else {
            min = yAxisRange.min;
            max = yAxisRange.max;
            if (min > range[1] || max < range[0]) {
                outOfrange = true;
            }
        }

        if (this.plotOptions !== undefined && this.plotOptions.grid !== undefined && !this.plotOptions.grid.hoverable) {
            outOfrange = true;
        }

        // check if there are given min and max. If not use default min and max calculated from data
        if (yAxisRange.min !== yAxisRange.max && !outOfrange) {
            this.defaultYaxisRange = false;
        } else {
            min = range[0];
            max = range[1];
            if (min === max) {
                min = min - (min * 0.1);
                max = max + (max * 0.1);
            }
            this.defaultYaxisRange = true;
        }

        // if style option 'zero based y-axis' is checked,
        // the axis will be aligned to top 0 (with data below 0) or to bottom 0 (with data above 0)
        let zeroBasedValue = -1;
        if (dataEntry.axisOptions.zeroBased) {
            if (range[1] <= 0) {
                max = 0;
                zeroBasedValue = 1;
            }
            if (range[0] >= 0) {
                min = 0;
                zeroBasedValue = 0;
            }
        }

        const newDatasetIdx = this.preparedData.findIndex((e) => e.internalId === internalId);

        // set range, uom and id for each dataset
        if (dataEntry.visible) {
            this.dataYranges[newDatasetIdx] = {
                uom: dataEntry.axisOptions.uom,
                range: [min, max],
                id: internalId,
                defR: this.defaultYaxisRange,
                zeroBasedYAxis: dataEntry.axisOptions.zeroBased,
                zeroBasedValue: zeroBasedValue
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
                    ids: [obj.id],
                    defaultRange: obj.defR,
                    zeroBased: {
                        bool: obj.zeroBasedYAxis,
                        value: obj.zeroBasedValue
                    }
                };
                if (idx >= 0) {

                    if (obj.defR === this.yRangesEachUom[idx].defaultRange) {
                        if (this.yRangesEachUom[idx].range[0] > obj.range[0]) {
                            this.yRangesEachUom[idx].range[0] = obj.range[0];
                        }
                        if (this.yRangesEachUom[idx].range[1] < obj.range[1]) {
                            this.yRangesEachUom[idx].range[1] = obj.range[1];
                        }
                    } else if (!obj.defR) {
                        this.yRangesEachUom[idx].range[0] = obj.range[0];
                        this.yRangesEachUom[idx].range[1] = obj.range[1];
                    }

                    if (yrangeObj.zeroBased.bool) {
                        this.yRangesEachUom[idx].zeroBased.bool = yrangeObj.zeroBased.bool;
                        this.yRangesEachUom[idx].zeroBased.value = yrangeObj.zeroBased.value;
                    }
                    if (this.yRangesEachUom[idx].zeroBased.bool) {
                    }

                    this.yRangesEachUom[idx].ids.push(obj.id);

                } else {
                    this.yRangesEachUom.push(yrangeObj);
                }
            }
        });
        this.plotGraph();
    }

    /**
     * Function that returns the height of the graph diagram.
     */
    private calculateHeight(): number {
        return this.rawSvg.node().height.baseVal.value - this.margin.top - this.margin.bottom;
    }

    /**
     * Function that returns the width of the graph diagram.
     */
    private calculateWidth(): number {
        return this.rawSvg.node().width.baseVal.value - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    /**
     * Function that returns the value range for building the y axis for each uom of every dataset.
     * @param uom {String} String that is the uom of a dataset
     */
    private getyAxisRange(uom) {

        for (let i = 0; i <= this.yRangesEachUom.length; i++) {
            if (this.yRangesEachUom[i].uom === uom) {
                let range = this.yRangesEachUom[i].range;

                // check for zero based y axis
                if (this.yRangesEachUom[i].zeroBased) {
                    range[this.yRangesEachUom[i].zeroBased.value] = 0;
                }

                return range;
            }
        }

        return null; // error: uom does not exist
    }

    /**
     * Function to plot the graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    private plotGraph() {
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
        // create background rect
        if (this.plotOptions.grid === undefined || this.plotOptions.grid.hoverable) {
            // execute when it is not an overview diagram
            this.background = this.graph.append('svg:rect')
                .attr('width', this.width - this.bufferSum)
                .attr('height', this.height)
                .attr('fill', 'none')
                .attr('stroke', 'none')
                .attr('pointer-events', 'all')
                .attr('transform', 'translate(' + this.bufferSum + ', 0)');

            // mouse events hovering
            this.background
                .on('mousemove.focus', this.mousemoveHandler)
                .on('mouseout.focus', this.mouseoutHandler);

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
        } else {
            // execute when it is overview diagram
            let interval = this.getXDomainByTimestamp();
            let overviewTimespanInterval = [interval[0], interval[1]];

            // create brush
            let brush = d3.brushX()
                .extent([[0, 0], [this.width, this.height]])
                .on('end', () => {
                    // on mouseclick change time after brush was moved
                    if (this.mousedownBrush) {
                        let timeByCoord = this.getTimestampByCoord(d3.event.selection[0], d3.event.selection[1]);
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
    }

    /**
     * Function that calculates and returns the x diagram coordinate for the brush range
     * for the overview diagram by the selected time interval of the main diagram.
     * Calculate to get brush extent when main diagram time interval changes.
     */
    private getXDomainByTimestamp () {
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
        let minCalcBrush = divOverviewTimeWidth * (minDiagramTimestamp - minOverviewTimeInterval);
        let maxCalcBrush = divOverviewTimeWidth * (maxDiagramTimestamp - minOverviewTimeInterval);

        return [minCalcBrush, maxCalcBrush];
    }

    /**
     * Function that calculates and returns the timestamp for the main diagram calculated
     * by the selected coordinate of the brush range.
     * @param minCalcBrush {Number} Number with the minimum coordinate of the selected brush range.
     * @param maxCalcBrush {Number} Number with the maximum coordinate of the selected brush range.
     */
    private getTimestampByCoord(minCalcBrush, maxCalcBrush) {
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
        let minDiagramTimestamp = ((minCalcBrush / diagramWidth) * diffOverviewTimeInterval) + minOverviewTimeInterval;
        let maxDiagramTimestamp = ((maxCalcBrush / diagramWidth) * diffOverviewTimeInterval) + minOverviewTimeInterval;

        return [minDiagramTimestamp, maxDiagramTimestamp];
    }

    /**
     * Function that returns the tickvalues for the x axis related to the timestep.
     * @param time {String} String with the information how the time should be visualized in the x axis.
     * @param range {Array} Array containing the minimum and maximum range.
     * @param span {Number} Number with the ticksize for the axis generation.
     */
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

    /**
     * Function that draws the x axis to the svg element.
     * @param bufferXrange {Number} Number with the distance between left edge and the beginning of the graph.
     */
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

    /**
     * Function to draw the y axis for each dataset.
     * Each uom has its own axis.
     * @param entry {DataEntry} Object containing a dataset.
     */
    private drawYaxis(entry): any {
        let showAxis = (this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis);
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

    /**
     * Function to set selected Ids that should be highlighted.
     * @param ids {Array} Array of Strings containing the Ids.
     * @param uom {String} String with the uom for the selected Ids
     */
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

    /**
     * Function that changes state of selected Ids.
     */
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

    /**
     * Function to draw the graph line for each dataset.
     * @param entry {DataEntry} Object containing a dataset.
     */
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

            // draw grah line
            this.graphBody = this.graph
                .append('g')
                .attr('clip-path', 'url(#' + querySelectorClip + ')');

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
                .data(data.filter((d) => d))
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('stroke', entry.color)
                .attr('fill', entry.color)
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', entry.lines.pointRadius);
        }
    }

    /**
     * Function that shows labeling via mousmove.
     */
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
            let yPos = firstLabel.sort((a, b) => a.y - b.y);
            yPos.forEach((p, i) => {
                if (i > 0) {
                    let last = yPos[i - 1].y;
                    yPos[i].off = Math.max(0, (last + 30) - yPos[i].y);
                    yPos[i].y += yPos[i].off;
                }
            });
            yPos.sort((a, b) => a.idx - b.idx);

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

    /**
     * Function that hides the labeling inside the graph.
     */
    private mouseoutHandler = () => {
        this.hideDiagramIndicator();
    }

    /**
     * Function starting the drag handling for the diagram.
     */
    private panStartHandler = () => {
        this.draggingMove = false;
        this.dragMoveStart = d3.event.x;
        this.dragMoveRange = this.xAxisRange;
    }

    /**
     * Function that controlls the panning (dragging) of the graph.
     */
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

    /**
     * Function that ends the dragging control.
     */
    private panEndHandler = () => {
        this.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
        this.plotGraph();
        this.dragMoveStart = null;
        this.draggingMove = false;
    }

    /**
     * Function that starts the zoom handling.
     */
    private zoomStartHandler = () => {
        this.dragging = false;
        this.dragStart = d3.mouse(this.background.node());
        this.xAxisRangeOrigin.push(this.xAxisRange);
    }

    /**
     * Function that draws a rectangle when zoom is started and the mouse is moving.
     */
    private zoomHandler = () => {
        this.dragging = true;
        this.drawDragRectangle();
    }

    /**
     * Function that ends the zoom handling and calculates the via zoom selected time interval.
     */
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

    /**
     * Function that returns the timestamp of provided x diagram coordinates.
     * @param start {Number} Number with the minimum diagram coordinate.
     * @param end {Number} Number with the maximum diagram coordinate.
     */
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

    /**
     * Function that configurates and draws the rectangle.
     */
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

    /**
     * Function that disables the drawing rectangle control.
     */
    private resetDrag() {
        if (this.dragRectG) {
            this.dragRectG.remove();
            this.dragRectG = null;
            this.dragRect = null;
        }
    }

    /**
     * Function that returns the metadata of a specific entry in the dataset.
     * @param x {Number} Number of the dataset entry.
     * @param data {DataEntry} Array with the data of each dataset entry.
     */
    private getItemForX(x: number, data: DataEntry[]) {
        const index = this.xScaleBase.invert(x);
        const bisectDate = d3.bisector((d: DataEntry) => {
            return d[0];
        }).left;
        return bisectDate(data, index);
    }

    /**
     * Function that disables the labeling.
     */
    private hideDiagramIndicator() {
        this.focusG.style('visibility', 'hidden');
        d3.selectAll('.focus-visibility')
            .attr('visibility', 'hidden');
    }

    /**
     * Function that enables the lableing of each dataset entry.
     * @param entry {DataEntry} Object containing the dataset.
     * @param idx {Number} Number with the position of the dataset entry in the data array.
     * @param xCoordMouse {Number} Number of the x coordinate of the mouse.
     * @param entryIdx {Number} Number of the index of the entry.
     */
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
            this.showTimeIndicatorLabel(item, onLeftSide, entryIdx);

            if ((xCoordMouse) > (item.xDiagCoord + labelBuffer) || (xCoordMouse) < (item.xDiagCoord - labelBuffer)) {
                // hide label if mouse to far from coordinate
                this.chVisLabel(entry, false);

                if (entry.data[idx - 1] && entry.data[idx - 1].xDiagCoord + labelBuffer >= xCoordMouse) {
                    this.showLabelValues(entry, entry.data[idx - 1], onLeftSide);
                    this.showTimeIndicatorLabel(item, onLeftSide, entryIdx);

                    this.chVisLabel(entry, true);
                }
            }
        } else {
            // hide label if no data available for time
            this.chVisLabel(entry, false);
        }
    }

    /**
     * Function to change visibility of label and white rectangle inside graph (next to mouse-cursor line).
     * @param entry {DataEntry} Object containing the dataset.
     * @param visible {Boolean} Boolean giving information about visibility of a label.
     */
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

    /**
     * Function to show the labeling inside the graph.
     * @param entry {DataEntry} Object containg the dataset.
     * @param item {DataEntry} Object of the entry in the dataset.
     * @param onLeftSide {Boolean} Boolean giving information if the mouse is on left side of the diagram.
     */
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

    /**
     * Function to show the time labeling inside the graph.
     * @param item {DataEntry} Object of the entry in the dataset.
     * @param onLeftSide {Boolean} Boolean giving information if the mouse is on left side of the diagram.
     * @param entryIdx {Number} Number of the index of the entry.
     */
    private showTimeIndicatorLabel(item: DataEntry, onLeftSide: boolean, entryIdx: number) {
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

    /**
     * Function that returns the boundings of a html element.
     * @param el {Object} Object of the html element.
     */
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

    /**
     * Function to generate uuid for a diagram
     */
    private uuidv4() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    /**
     * Function to generate components of the uuid for a diagram
     */
    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * Function that logs the error in the console.
     * @param error {Object} Object with the error.
     */
    private onError(error: any) {
        console.error(error);
    }

}
