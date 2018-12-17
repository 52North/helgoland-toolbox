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
    Time,
    Timeseries,
    TimeseriesData,
    Timespan,
} from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as d3 from 'd3';
import moment from 'moment';

import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { HighlightOutput, HighlightValue } from '../model/d3-highlight';
import { D3PlotOptions, HoveringStyle } from '../model/d3-plot-options';

export interface DataEntry {
    yDiagCoord?: number;
    timestamp?: number;
    xDiagMin?: number;
    xDiagMax?: number;
    yDiagMin?: number;
    yDiagMax?: number;
    xDiagCoord?: number;
}

export interface InternalDataEntry {
    internalId: string;
    id: number;
    color: string;
    data: [number, number][];
    points: {
        fillColor: string
    };
    lines: {
        lineWidth: number;
        pointRadius: number;
    };
    bars: {
        lineWidth: number;
    };
    axisOptions: {
        uom: string;
        label: string;
        zeroBased: boolean;
        yAxisRange: MinMaxRange;
        autoRangeSelection: boolean;
        separateYAxis: boolean;
        parameters?: {
            feature: { id: String, label: String };
            phenomenon: { id: String, label: String };
            offering: { id: String, label: String };
        };
    };
    visible: boolean;
}

export interface DataConst extends IDataset {
    data?: Data<[number, number]>;
}

export interface YRanges {
    uom: string;
    range?: MinMaxRange; // necessary if grouped by uom
    preRange?: MinMaxRange; // necessary if grouped by uom
    originRange?: MinMaxRange; // necessary if grouped by uom
    zeroBased: boolean;
    autoRange: boolean;
    outOfrange: boolean;
    id?: string; // necessary if grouped by internalId
    ids?: string[]; // necessary if grouped by uom
    first?: boolean;
    yScale?: d3.ScaleLinear<number, number>;
    offset?: number;
    parameters: {   // additional information for the y axis label
        feature: { id: String, label: String };
        phenomenon: { id: String, label: String };
        offering: { id: String, label: String };
    };
}

interface YScale {
    buffer: number;
    yScale: d3.ScaleLinear<number, number>;
}

interface YAxisSelection {
    id: string;
    clicked: boolean;
    ids?: Array<string>;
    uom?: string;
}

interface HighlightDataset {
    id: string;
    change: boolean;
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
    public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

    @Output()
    public onClickDataPoint: EventEmitter<TimeseriesData[]> = new EventEmitter();

    @ViewChild('d3timeseries')
    public d3Elem: ElementRef;

    public highlightOutput: HighlightOutput;

    // DOM elements
    protected rawSvg: any; // d3.Selection<EnterElement, {}, null, undefined>;
    protected graph: any;
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
    private dragMoveStart: number; // [number, number];
    private dragMoveRange: [number, number];
    private mousedownBrush: boolean;
    private oldGroupYaxis: boolean;

    // data types
    protected preparedData = []; // : DataSeries[]
    protected datasetMap: Map<string, DataConst> = new Map();
    protected listOfUoms: string[] = [];
    protected yRangesEachUom: YRanges[] = []; // y array of objects containing ranges for each uom
    protected dataYranges: YRanges[] = []; // y array of objects containing ranges of all datasets
    private xAxisRange: Timespan; // x domain range
    private xAxisRangeOrigin: any = []; // x domain range
    private xAxisRangePan: [number, number]; // x domain range
    private listOfSeparation = Array();
    private yAxisSelect;

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
    private opac = {
        default: 0,
        hover: 0.3,
        click: 0.5
    };
    private addLineWidth = 2; // value added to linewidth
    private loadingCounter = 0;
    private currentTimeId: string;

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

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: DatasetApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected timeFormatLocaleService: D3TimeFormatLocaleService,
        protected colorService: ColorService,
        protected translateService: TranslateService
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc, translateService);
    }

    public ngAfterViewInit(): void {
        this.currentTimeId = this.uuidv4();
        // this.dotsObjects = [];

        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.graphFocus = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.mousedownBrush = false;
        this.plotGraph();
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
        this.dataYranges = [];
        this.xAxisRangeOrigin = [];
        this.datasetMap.delete(internalId);
        let spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
        if (spliceIdx >= 0) {
            this.preparedData.splice(spliceIdx, 1);
            if (this.preparedData.length <= 0) {
                this.yRangesEachUom = [];
                this.plotGraph();
            } else {
                this.preparedData.forEach((entry, idx) => {
                    this.processData(entry);
                });
            }
        }
    }
    protected setSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (!tsData.selected || tsData.selected === undefined) {
            tsData.selected = true;
            tsData.lines.lineWidth += this.addLineWidth;
            tsData.lines.pointRadius > 0 ? tsData.lines.pointRadius += this.addLineWidth : tsData.lines.pointRadius += 0;
            tsData.bars.lineWidth += this.addLineWidth;

            if (tsData.axisOptions.separateYAxis || !this.plotOptions.groupYaxis) {
                this.checkYselector(tsData.internalId, tsData.axisOptions.uom);
                if (this.yAxisSelect[internalId]) {
                    this.yAxisSelect[internalId].clicked = true;
                }
            } else {
                let identifier = tsData.axisOptions.uom;
                let existingUom = this.yRangesEachUom.find(el => el.uom === identifier);

                if (existingUom.ids.findIndex(el => el === internalId) >= 0) {
                    this.checkYselector(identifier, tsData.axisOptions.uom);
                    this.yAxisSelect[identifier].clicked = true;
                    this.yAxisSelect[identifier].ids.push(internalId);

                    // check axis for uom of dataset with selected internalId
                    if (existingUom !== undefined && existingUom.ids !== undefined) {
                        // only highlight axis of uom if all datasets with this uom are highlighted
                        // count datasets for specific uom
                        if (this.yAxisSelect[identifier].ids.length !== existingUom.ids.length) {
                            this.yAxisSelect[identifier].clicked = false;
                        } else {
                            this.yAxisSelect[identifier].clicked = true;
                        }
                    }
                }
            }
        }
        this.plotGraph();
    }
    protected removeSelectedId(internalId: string): void {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        if (tsData.selected || tsData.selected === undefined) {
            tsData.selected = false;
            tsData.lines.lineWidth -= this.addLineWidth;
            tsData.lines.pointRadius > 0 ? tsData.lines.pointRadius -= this.addLineWidth : tsData.lines.pointRadius -= 0;
            tsData.bars.lineWidth -= this.addLineWidth;

            if (tsData.axisOptions.separateYAxis || !this.plotOptions.groupYaxis) {
                this.checkYselector(tsData.internalId, tsData.axisOptions.uom);
                if (this.yAxisSelect[tsData.internalId]) {
                    this.yAxisSelect[tsData.internalId].clicked = false;
                    if (this.yAxisSelect[tsData.internalId]) {
                        this.yAxisSelect[tsData.internalId].ids = [];
                    }
                }
            } else {
                let identifier = tsData.axisOptions.uom;
                this.checkYselector(identifier, tsData.axisOptions.uom);
                this.yAxisSelect[identifier].ids = this.yAxisSelect[identifier].ids.filter(el => el !== internalId);
                this.yAxisSelect[identifier].clicked = false;
            }
        }
        this.plotGraph();
    }
    protected presenterOptionsChanged(options: D3PlotOptions): void {
        this.oldGroupYaxis = this.plotOptions.groupYaxis;
        if (this.plotOptions.hoverStyle !== HoveringStyle.point && options.hoverStyle === HoveringStyle.point) {
            d3.select('g.d3line').attr('visibility', 'visible');
        }
        Object.assign(this.plotOptions, options);
        if (this.rawSvg && this.yRangesEachUom) {
            this.plotGraph();
        }
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

            this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                {
                    format: 'flot',
                    expanded: this.plotOptions.showReferenceValues || this.plotOptions.requestBeforeAfterValues,
                    generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                },
                { forceUpdate: force }
            ).subscribe(
                (result) => this.prepareTsData(dataset, result),
                (error) => this.onError(error),
                () => this.onCompleteLoadingData()
            );
        }
    }

    private onCompleteLoadingData(): void {
        this.loadingCounter--;
        if (this.loadingCounter === 0) { this.onContentLoading.emit(false); }
    }

    /**
     * Function to prepare each dataset for the graph and adding it to an array of datasets.
     * @param dataset {IDataset} Object of the whole dataset
     */
    private prepareTsData(dataset: IDataset, data: Data<[number, number]>): void {

        // add surrounding entries to the set
        if (data.valueBeforeTimespan) { data.values.unshift(data.valueBeforeTimespan); }
        if (data.valueAfterTimespan) { data.values.push(data.valueAfterTimespan); }

        this.datasetMap.get(dataset.internalId).data = data;
        const datasetIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
        const styles = this.datasetOptions.get(dataset.internalId);

        // TODO: change uom for testing
        // if (this.preparedData.length > 0) {
        //     dataset.uom = 'mc';
        // }

        // generate random color, if color is not defined
        if (styles.color === undefined) {
            styles.color = this.colorService.getColor();
        }

        // end of check for datasets
        const dataEntry: InternalDataEntry = {
            internalId: dataset.internalId,
            id: (datasetIdx >= 0 ? datasetIdx : this.preparedData.length),
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
                yAxisRange: styles.yAxisRange,
                autoRangeSelection: styles.autoRangeSelection,
                separateYAxis: styles.separateYAxis,
                parameters: {
                    feature: dataset.parameters.feature,
                    phenomenon: dataset.parameters.phenomenon,
                    offering: dataset.parameters.offering
                }
            },
            visible: styles.visible
        };

        let separationIdx: number = this.listOfSeparation.findIndex((id) => id === dataset.internalId);
        if (styles.separateYAxis) {
            if (separationIdx < 0) {
                this.listOfSeparation.push(dataset.internalId);
            }
        } else {
            this.listOfSeparation = this.listOfSeparation.filter(entry => entry !== dataset.internalId);
        }

        // alternative linewWidth = this.plotOptions.selected.includes(dataset.uom)
        if (this.selectedDatasetIds.indexOf(dataset.internalId) >= 0) {
            dataEntry.lines.lineWidth += this.addLineWidth;
            dataEntry.lines.pointRadius > 0 ? dataEntry.lines.pointRadius += this.addLineWidth : dataEntry.lines.pointRadius += 0;
            dataEntry.bars.lineWidth += this.addLineWidth;

            if (styles.separateYAxis) {
                this.checkYselector(dataEntry.internalId, dataEntry.axisOptions.uom);
                if (this.yAxisSelect[dataEntry.internalId]) {
                    this.yAxisSelect[dataEntry.internalId].clicked = true;
                    this.yAxisSelect[dataEntry.internalId].ids.push(dataEntry.internalId);
                }
            }
        }

        // check selected datasets for highlighting
        if (this.yAxisSelect) {
            if (styles.separateYAxis) {
                if (this.yAxisSelect[dataEntry.axisOptions.uom]) {
                    let idx = this.yAxisSelect[dataEntry.axisOptions.uom].ids.findIndex(el => el === dataEntry.internalId);
                    if (idx >= 0) {
                        this.yAxisSelect[dataEntry.axisOptions.uom].ids.splice(idx, 1);
                    }
                    let counted = this.countGroupedDatasets(dataEntry.axisOptions.uom, dataEntry.internalId);
                    if (this.yAxisSelect[dataEntry.axisOptions.uom].ids.length === counted) {
                        this.yAxisSelect[dataEntry.axisOptions.uom].clicked = true;
                    }
                }
            } else {
                if (this.yAxisSelect[dataEntry.internalId] && this.yAxisSelect[dataEntry.axisOptions.uom]) {
                    if (this.yAxisSelect[dataEntry.internalId].clicked) {
                        this.yAxisSelect[dataEntry.axisOptions.uom].ids.push(dataEntry.internalId);
                    } else {
                        this.yAxisSelect[dataEntry.axisOptions.uom].clicked = false;
                    }
                    delete this.yAxisSelect[dataEntry.internalId];
                }
            }
        }

        if (datasetIdx >= 0) {
            this.preparedData[datasetIdx] = dataEntry;
        } else {
            this.preparedData.push(dataEntry);
        }
        this.addReferenceValueData(dataset.internalId, styles, data, dataset.uom);
        this.processData(dataEntry);
    }

    /**
     * Function to add referencevaluedata to the dataset (e.g. mean).
     * @param internalId {String} String with the id of a dataset
     * @param styles {DatasetOptions} Object containing information for dataset styling
     * @param data {Data} Array of Arrays containing the measurement-data of the dataset
     * @param uomO {String} String with the uom of a dataset
     */
    private addReferenceValueData(internalId: string, styles: DatasetOptions, data: Data<[number, number]>, uomO: string): void {
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
     */
    protected processData(dataEntry: InternalDataEntry): void {
        let calculatedRange: MinMaxRange;
        let calculatedPreRange: MinMaxRange;
        let calculatedOriginRange: MinMaxRange;
        let predefinedRange: MinMaxRange;
        if (dataEntry.axisOptions.yAxisRange && dataEntry.axisOptions.yAxisRange.min !== dataEntry.axisOptions.yAxisRange.max) {
            predefinedRange = dataEntry.axisOptions.yAxisRange;
        }
        let autoDataExtent: boolean = dataEntry.axisOptions.autoRangeSelection;

        // get min and max value of data
        const dataExtent = d3.extent<[number, number], number>(dataEntry.data, (datum, index, array) => {
            return datum[1]; // datum[0] = timestamp -- datum[1] = value
        });

        calculatedOriginRange = { min: dataExtent[0], max: dataExtent[1] };

        let setDataExtent = false;

        // calculate out of predefined range
        if (predefinedRange && !this.plotOptions.overview) {
            if (predefinedRange.min > predefinedRange.max) {
                calculatedRange = { min: predefinedRange.max, max: predefinedRange.min };
                calculatedPreRange = { min: predefinedRange.max, max: predefinedRange.min };
            } else {
                calculatedRange = { min: predefinedRange.min, max: predefinedRange.max };
                calculatedPreRange = { min: predefinedRange.min, max: predefinedRange.max };
            }
            if (predefinedRange.min > dataExtent[1] || predefinedRange.max < dataExtent[0]) {
                setDataExtent = autoDataExtent ? false : true;
            }
        } else {
            setDataExtent = true;
        }

        if (setDataExtent) {
            calculatedRange = { min: dataExtent[0], max: dataExtent[1] };
            this.extendRange(calculatedRange);
        }

        // if style option 'zero based y-axis' is checked,
        // the axis will be aligned to top 0 (with data below 0) or to bottom 0 (with data above 0)
        // let zeroBasedValue = -1;
        if (dataEntry.axisOptions.zeroBased && !this.plotOptions.overview) {
            if (dataExtent[1] <= 0) {
                calculatedRange.max = 0;
                if (calculatedPreRange) { calculatedPreRange.max = 0; }
            }
            if (dataExtent[0] >= 0) {
                calculatedRange.min = 0;
                if (calculatedPreRange) { calculatedPreRange.min = 0; }
            }
        }

        const newDatasetIdx = this.preparedData.findIndex((e) => e.internalId === dataEntry.internalId);

        // set range, uom and id for each dataset
        if (dataEntry.visible) {
            this.dataYranges[newDatasetIdx] = {
                uom: dataEntry.axisOptions.uom,
                id: dataEntry.internalId,
                zeroBased: dataEntry.axisOptions.zeroBased,
                outOfrange: setDataExtent,
                autoRange: autoDataExtent,
                parameters: dataEntry.axisOptions.parameters
            };
            if (isFinite(calculatedRange.min) && isFinite(calculatedRange.max)) {
                this.dataYranges[newDatasetIdx].range = calculatedRange;
                this.dataYranges[newDatasetIdx].preRange = calculatedPreRange;
                this.dataYranges[newDatasetIdx].originRange = calculatedOriginRange;
            }
        } else {
            this.dataYranges[newDatasetIdx] = null;
        }

        // set range and array of IDs for each uom to generate y-axis later on
        this.yRangesEachUom = [];
        this.dataYranges.forEach((obj) => {
            if (obj !== null) {
                let idx: number = this.yRangesEachUom.findIndex((e) => e.uom === obj.uom);
                let yrangeObj: YRanges = {
                    uom: obj.uom,
                    range: obj.range,
                    preRange: obj.preRange,
                    originRange: obj.originRange,
                    ids: [obj.id],
                    zeroBased: obj.zeroBased,
                    outOfrange: obj.outOfrange,
                    autoRange: obj.autoRange,
                    parameters: obj.parameters
                };

                if (idx >= 0) {
                    if (this.yRangesEachUom[idx].range) {
                        if (obj.range) {
                            if (this.yRangesEachUom[idx].autoRange || obj.autoRange) {
                                if (obj.preRange && this.yRangesEachUom[idx].preRange) {
                                    this.checkCurrentLatest(idx, obj, 'preRange');
                                    this.yRangesEachUom[idx].range = this.yRangesEachUom[idx].preRange;
                                } else {
                                    this.checkCurrentLatest(idx, obj, 'range');
                                }
                                this.yRangesEachUom[idx].autoRange = true;
                            } else {
                                if (obj.outOfrange !== this.yRangesEachUom[idx].outOfrange) {
                                    this.checkCurrentLatest(idx, obj, 'originRange');
                                    this.yRangesEachUom[idx].range = this.yRangesEachUom[idx].originRange;
                                } else {
                                    this.checkCurrentLatest(idx, obj, 'range');
                                }
                            }
                        }
                    } else {
                        this.takeLatest(idx, obj, 'range');
                    }

                    this.yRangesEachUom[idx].ids.push(obj.id);

                } else {
                    this.yRangesEachUom.push(yrangeObj);
                }
            }
        });
        if (this.graph) {
            this.plotGraph();
        }
    }

    protected extendRange(range: MinMaxRange): void {
        if (range.min === range.max) {
            range.min = range.min - 1;
            range.max = range.max + 1;
        }
    }

    private checkCurrentLatest(idx, obj, pos): void {
        if (this.yRangesEachUom[idx][pos].min > obj[pos].min && !isNaN(obj[pos].min)) {
            this.yRangesEachUom[idx][pos].min = obj[pos].min;
        }
        if (this.yRangesEachUom[idx][pos].max < obj[pos].max && !isNaN(obj[pos].max)) {
            this.yRangesEachUom[idx][pos].max = obj[pos].max;
        }
    }

    private takeLatest(idx, obj, pos): void {
        this.yRangesEachUom[idx][pos] = obj[pos];
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
     * Function that returns the value range for building the y axis for each uom of every dataset.
     * @param uom {String} String that is the uom of a dataset
     */
    private getyAxisRange(uom: string): MinMaxRange {
        let rangeObj = this.yRangesEachUom.find(el => el.uom === uom);
        if (rangeObj) {
            // check for zero based y axis
            // if (rangeObj.zeroBased) {
            //     if (rangeObj.zeroBasedValue === 0) {
            //         range.min = 0;
            //     } else {
            //         range.max = 0;
            //     }
            // }
            const range: MinMaxRange = rangeObj.range;
            return range;
        }
        return null; // error: uom does not exist
    }

    /**
     * Function to plot the graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    protected plotGraph(): void {
        this.highlightOutput = {
            'timestamp': 0,
            'ids': []
        };
        if (!this.yRangesEachUom) { return; }

        this.preparedData.forEach((entry) => {
            let idx: number = this.listOfUoms.findIndex((uom) => uom === entry.axisOptions.uom);
            if (idx < 0) { this.listOfUoms.push(entry.axisOptions.uom); }
        });

        // adapt axis highlighting, when changing grouping of y axis
        if (this.oldGroupYaxis !== this.plotOptions.groupYaxis) {
            this.changeYselection();
        }

        this.height = this.calculateHeight();
        this.width = this.calculateWidth();
        this.graph.selectAll('*').remove();
        this.graphFocus.selectAll('*').remove();

        this.bufferSum = 0;
        this.yScaleBase = null;

        // get range of x and y axis
        this.xAxisRange = this.timespan;

        // #####################################################
        let yAxisArray: YRanges[] = [];
        if (this.plotOptions.groupYaxis || this.plotOptions.groupYaxis === undefined) {
            yAxisArray = this.yRangesEachUom;
            // push all listOfSeparation into yAxisArray
            if (this.listOfSeparation.length > 0) {
                this.listOfSeparation.forEach((sepId) => {
                    let newEl: YRanges = this.dataYranges.find((el) => el !== null && el.id === sepId);
                    if (newEl && (yAxisArray.findIndex(el => el.id === newEl.id) < 0)) {
                        // if all dataset for specific uom are separated from grouping, the yaxis of this uom will be removed from axis
                        let existingUom = yAxisArray.findIndex(el => el.uom === newEl.uom && (el.ids !== undefined || el.ids.length === 0));
                        if (existingUom >= 0) {
                            // delete id from ids
                            let deleteId = yAxisArray[existingUom].ids.findIndex(id => id === sepId);
                            if (deleteId >= 0) { yAxisArray[existingUom].ids.splice(deleteId, 1); }
                            if (yAxisArray[existingUom].ids.length === 0) {
                                // delete yAxisArray[existingUom]
                                yAxisArray.splice(existingUom, 1);
                            }
                        }
                        yAxisArray.push(newEl);
                    }
                });
            }
        } else {
            yAxisArray = this.dataYranges;
        }

        yAxisArray.forEach((entry) => {
            if (entry !== null) {
                entry.first = (this.yScaleBase === null);
                entry.offset = this.bufferSum;

                let yAxisResult = this.drawYaxis(entry);
                if (this.yScaleBase === null) {
                    this.yScaleBase = yAxisResult.yScale;
                    this.bufferSum = yAxisResult.buffer;
                } else {
                    this.bufferSum = yAxisResult.buffer;
                }
                entry.yScale = yAxisResult.yScale;
            }
        });

        if (!this.yScaleBase) {
            return;
        }

        // draw x and y axis
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

        this.drawAllGraphLines();
        this.addTimespanJumpButtons();

        // #####################################################
        // create background rect
        if (!this.plotOptions.overview) {
            // execute when it is not an overview diagram
            // mouse events hovering
            if (this.plotOptions.hoverable) {
                if (this.plotOptions.hoverStyle === HoveringStyle.line) {
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
                            .style('fill', entry.color)
                            .style('font-weight', 'lighter');

                        this.focuslabelTime = this.focusG.append('svg:text')
                            .style('pointer-events', 'none')
                            .attr('class', 'mouse-focus-time');
                    });
                }
                if (this.plotOptions.hoverStyle === HoveringStyle.point) {
                    // create voronoi net for point-hovering
                    this.createHoveringNet(this.preparedData);
                    this.createHoveringNet(this.preparedData);
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
    }

    protected createHoveringNet(inputData): void {
        let data = inputData.map(function (series, i) {
            series.data = series.data.map(function (point) {
                point.series = i;
                return point;
            });
            return series;
        });

        let x = d3.scaleLinear(), // d3.scale.linear(),
            y = d3.scaleLinear();

        let vertices: [number, number][] = d3.merge(data.map(function (cl, lineIndex) {
            /**
             * cl = { data: [], label: internalId }
             * point = each point in a dataset
            */
            let outputLine = cl.data.map(function (point, pointIndex) {
                let outputPoint = [x(point.xDiagCoord), y(point.yDiagCoord), lineIndex, pointIndex, point, cl];
                return outputPoint; // adding series index to point because data is being flattened
            });
            return outputLine;
        }));

        let wrap = this.rawSvg.selectAll('g.d3line').data([this.preparedData]);
        let gEnter = wrap.enter().append('g').attr('class', 'd3line').append('g');
        gEnter.append('g').attr('class', 'point-paths');

        let left = this.bufferSum, // + this.margin.left,
            top = this.margin.top,
            right = this.background.node().getBBox().width + this.bufferSum, // + this.margin.left,
            bottom = this.margin.top + this.background.node().getBBox().height;

        // filter dataset - delete all entries that are NaN
        let verticesFiltered = vertices.filter(d => !isNaN(d[0]) || !isNaN(d[1]));
        let Diffvoronoi = d3.voronoi()
            .extent([[left, top], [right, bottom]]);
        let diffVoronoi2 = Diffvoronoi.polygons(verticesFiltered);

        let pointPaths = wrap.select('.point-paths').selectAll('path')
            .data(diffVoronoi2);
        pointPaths
            .enter().append('path')
            .attr('class', function (d, i) {
                return 'path-' + i;
            });
        pointPaths.exit().remove();  // comment to avoid no hovering for only one graph
        pointPaths   // comment to avoid no hovering for only one graph
            .attr('clip-path', function (d) {
                if (d !== undefined) {
                    return 'url(#clip-' + d.data[5].internalId.substring(d.data[5].internalId.length - 2, d.data[5].internalId.length) + '-' + d[0] + ')';
                }
            })
            .attr('d', function (d) {
                if (d !== undefined) {
                    return 'M' + d.join(' ') + 'Z';
                }
            })
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
            .on('mousemove', (d) => {
                if (d !== undefined) {
                    let coords = d3.mouse(this.background.node());
                    let dataset = d.data[4];
                    let dist = this.calcDistanceHovering(dataset, coords);
                    if (dist <= 8) {
                        let rectBack = this.background.node().getBBox();
                        if (coords[0] >= 0 && coords[0] <= rectBack.width && coords[1] >= 0 && coords[1] <= rectBack.height) {
                            // highlight hovered dot
                            d3.select('#dot-' + dataset[0] + '-' + d.data[5].id + '')
                                .attr('opacity', 0.8)
                                .attr('r', '8px');

                            this.highlightRect
                                .style('visibility', 'visible');
                            this.highlightText
                                .style('visibility', 'visible');

                            // create text for hovering label
                            let dotLabel = this.highlightText
                                .text(dataset[1] + ' ' + d.data[5].axisOptions.uom + '\n' + moment(dataset[0]).format('DD.MM.YY HH:mm')) // d[0] = timestamp, d[1] = data
                                .attr('class', 'mouseHoverDotLabel')
                                .style('pointer-events', 'none')
                                .style('fill', 'black'); // d.data[5].color);

                            let onLeftSide = false;
                            if ((this.background.node().getBBox().width + this.bufferSum) / 2 > coords[0]) { onLeftSide = true; }

                            let rectX: number = dataset.xDiagCoord + 15;
                            let rectY: number = dataset.yDiagCoord;
                            let rectW: number = this.getDimensions(dotLabel.node()).w + 8;
                            let rectH: number = this.getDimensions(dotLabel.node()).h; // + 4;

                            if (!onLeftSide) {
                                rectX = dataset.xDiagCoord - 15 - rectW;
                                rectY = dataset.yDiagCoord;
                            }

                            if ((coords[1] + rectH + 4) > this.background.node().getBBox().height) {
                                // when label below x axis
                                console.log('Translate label to a higher place. - not yet implemented');
                            }

                            // create hovering label
                            let dotRectangle = this.highlightRect
                                .attr('class', 'mouseHoverDotRect')
                                .style('fill', 'white')
                                .style('fill-opacity', 1)
                                .style('stroke', d.data[5].color)
                                .style('stroke-width', '1px')
                                .style('pointer-events', 'none')
                                .attr('width', rectW)
                                .attr('height', rectH)
                                .attr('transform', 'translate(' + rectX + ', ' + rectY + ')');

                            let labelX: number = dataset.xDiagCoord + 4 + 15;
                            let labelY: number = dataset.yDiagCoord + this.getDimensions(dotRectangle.node()).h - 4;

                            if (!onLeftSide) {
                                labelX = dataset.xDiagCoord - rectW + 4 - 15;
                                labelY = dataset.yDiagCoord + this.getDimensions(dotRectangle.node()).h - 4;
                            }

                            this.highlightText
                                .attr('transform', 'translate(' + labelX + ', ' + labelY + ')');

                            // generate output of highlighted data
                            let idOutput: HighlightValue = {
                                'timestamp': dataset[0],
                                'value': dataset[1]
                            };
                            this.highlightOutput = {
                                'timestamp': dataset[0],
                                'ids': []
                            };
                            this.highlightOutput.ids[d.data[5].internalId] = idOutput;
                            this.onHighlightChanged.emit(this.highlightOutput);

                        }
                    } else {
                        // unhighlight hovered dot
                        d3.select('#dot-' + dataset[0] + '-' + d.data[5].id + '')
                            .attr('opacity', 1)
                            .attr('r', d.data[5].lines.pointRadius);

                        // make label invisible
                        this.highlightRect
                            .style('visibility', 'hidden');
                        this.highlightText
                            .style('visibility', 'hidden');
                    }

                }
            })
            .on('mouseout', (d) => {
                if (d !== undefined) {
                    let dataset = d.data[4];

                    // unhighlight hovered dot
                    d3.select('#dot-' + dataset[0] + '-' + d.data[5].id + '')
                        .attr('opacity', 1)
                        .attr('r', d.data[5].lines.pointRadius);

                    // make label invisible
                    this.highlightRect
                        .style('visibility', 'hidden');
                    this.highlightText
                        .style('visibility', 'hidden');
                }
            })
            .on('mousedown', (d) => { this.clickDataPoint(d); });

        if (this.plotOptions.togglePanZoom === false) {
            pointPaths
                .call(d3.zoom()
                    .on('start', this.zoomStartHandler)
                    .on('zoom', this.zoomHandler)
                    .on('end', this.zoomEndHandler)
                );
        } else {
            pointPaths
                .call(d3.drag()
                    .on('start', this.panStartHandler)
                    .on('drag', this.panMoveHandler)
                    .on('end', this.panEndHandler));
        }
    }

    /**
     * Function to calculate distance between mouse and a hovered point.
     * @param dataset {} Coordinates of the hovered point.
     * @param coords {} Coordinates of the mouse.
     */
    private calcDistanceHovering(dataset, coords: [number, number]): number {
        let mX = coords[0] + this.bufferSum,
            mY = coords[1], // + this.margin.top,
            pX = dataset.xDiagCoord,
            pY = dataset.yDiagCoord;
        // calculate distance between point and mouse when hovering
        return Math.sqrt(Math.pow((pX - mX), 2) + Math.pow((pY - mY), 2));
    }

    private clickDataPoint(d) {
        if (d !== undefined) {
            let coords = d3.mouse(this.background.node());
            let dataset = d.data[4];
            let dist = this.calcDistanceHovering(dataset, coords);
            if (dist <= 8) {
                let dataEntry: DataEntry = d.data[4];
                let internalDataEntry: InternalDataEntry = d.data[5];
                const timepoint = dataEntry.timestamp;
                const externalId: InternalDatasetId = this.datasetIdResolver.resolveInternalId(internalDataEntry.internalId);
                const apiurl = externalId.url;
                const timespan = this.parsePointToSpan(timepoint);

                // request all timeseries that have data for the same offering and feature
                this.api.getTimeseries(apiurl,
                    {
                        offering: internalDataEntry.axisOptions.parameters.offering.id,
                        feature: internalDataEntry.axisOptions.parameters.feature.id
                    }).subscribe(
                        (tsArray) => {
                            const timeseries = [];
                            tsArray.forEach(ts => {
                                timeseries.push(ts.id);
                            });

                            // request ts data by timeseries ID for specific offering and feature
                            this.api.getTimeseriesData(apiurl, {
                                timespan: timespan,
                                timeseries: timeseries
                            }).subscribe(
                                (tsData) => {
                                    this.onClickDataPoint.emit(tsData);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        },
                        (error) => {
                            console.log(error);
                        }
                    );

            }
        }
    }

    private parsePointToSpan(timepoint) {
        const timeDate: Date = new Date(timepoint);
        return 'PT1s/' + timeDate.toISOString();
        // return 'PT1h/' + timeDate.toISOString();
    }

    private addTimespanJumpButtons(): void {
        let dataVisible = false;
        let formerTimestamp = null;
        let laterTimestamp = null;
        if (this.plotOptions.requestBeforeAfterValues) {
            this.preparedData.forEach((entry: InternalDataEntry) => {
                const firstIdxInTimespan = entry.data.findIndex(e => (this.timespan.from < e[0] && this.timespan.to > e[0]) && isFinite(e[1]));
                if (firstIdxInTimespan < 0) {
                    const lastIdxInTimespan = entry.data.findIndex(e => (e[0] > this.timespan.from && e[0] > this.timespan.to) && isFinite(e[1]));
                    if (lastIdxInTimespan >= 0) {
                        laterTimestamp = entry.data[entry.data.length - 1][0];
                    }
                    const temp = entry.data.findIndex(e => (e[0] < this.timespan.from && e[0] < this.timespan.to) && isFinite(e[1]));
                    if (temp >= 0) {
                        formerTimestamp = entry.data[entry.data.length - 1][0];
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
     * Draws for every preprared data entry the graph line.
     */
    protected drawAllGraphLines(): void {
        this.focusG = this.graphFocus.append('g');
        if ((this.plotOptions.hoverStyle === HoveringStyle.point) && !this.plotOptions.overview) {
            // create label for point hovering
            this.highlightRect = this.focusG.append('svg:rect');
            this.highlightText = this.focusG.append('svg:text');
        }
        this.preparedData.forEach((entry) => this.drawGraphLine(entry));
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
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

        if (this.plotOptions.grid) {
            // draw the x grid lines
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(xAxis
                    .tickSize(-this.height)
                    .tickFormat(() => '')
                );
        }

        // draw upper axis as border
        this.graph.append('svg:g')
            .attr('class', 'x axis')
            .call(d3.axisTop(this.xScaleBase).ticks(0).tickSize(0));

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
     * @param entry {DataEntry} Object containing a dataset.
     */
    private drawYaxis(entry): YScale {
        let showAxis = (this.plotOptions.overview ? false : (this.plotOptions.yaxis === undefined ? true : this.plotOptions.yaxis));
        // check for y axis grouping
        let range;
        if (this.plotOptions.groupYaxis || this.plotOptions.groupYaxis === undefined) {
            let uomIdx = this.listOfUoms.findIndex((uom) => uom === entry.uom);
            if (uomIdx >= 0 && entry.ids && entry.ids.length > 1) {
                range = this.getyAxisRange(entry.uom);
            } else if (entry.ids && entry.ids.length === 1) {
                // if entry is grouped but has only one id => use range of this dataset
                let entryElem = this.dataYranges.find((el) => el !== null && el.id === entry.ids[0]);
                if (entryElem && entryElem.preRange) {
                    range = entryElem.preRange;
                } else { range = entryElem.range; }
            } else {
                // if not entry.uom but separated id
                let entryElem = this.dataYranges.find((el) => el !== null && el.id === entry.id);
                if (entryElem && entryElem.preRange) {
                    range = entryElem.preRange;
                } else { range = entryElem.range; }
            }

        } else {
            let entryElem = this.dataYranges.find((el) => el !== null && el.id === entry.id);
            if (entryElem) { range = entryElem.range; }
        }

        let yMin = -1;
        let yMax = 1;
        if (range !== undefined && range !== null) {
            yMin = range.min;
            yMax = range.max;
        }

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
                .attr('class', 'yaxisTextLabel')
                .style('font', '18px times')
                .style('text-anchor', 'middle')
                .style('fill', 'black')
                .text((entry.id ? (entry.uom + ' @ ' + entry.parameters.feature.label) : entry.uom));
            // .text((entry.id ? (entry.parameters.station + ' (' + entry.uom + ' ' + entry.parameters.phenomenon + ')') : entry.uom));

            this.graph.selectAll('.yaxisTextLabel')
                .call(this.wrapText, (axis.node().getBBox().height - 10), this.height / 2);

            const axisWidth = axis.node().getBBox().width + 10 + this.getDimensions(text.node()).h;
            // if yAxis should not be visible, buffer will be set to 0
            buffer = (showAxis ? entry.offset + (axisWidth < this.margin.left ? this.margin.left : axisWidth) : 0);
            const axisWidthDiv = (axisWidth < this.margin.left ? this.margin.left : axisWidth);

            if (!entry.first) {
                axis.attr('transform', 'translate(' + buffer + ', 0)');
            } else {
                buffer = axisWidthDiv - this.margin.left;
                axis.attr('transform', 'translate(' + buffer + ', 0)');
            }

            let textOff = - (this.bufferSum);
            if (entry.first) {
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

                if (entry.ids) {
                    entry.ids.forEach((entryID) => {
                        let dataentry = this.preparedData.find(el => el.internalId === entryID);
                        if (dataentry) {
                            this.graph.append('circle')
                                .attr('class', 'axisDots')
                                .attr('id', 'axisdot-' + entry.id)
                                .attr('stroke', dataentry.color)
                                .attr('fill', dataentry.color)
                                .attr('cx', startOfPoints.x)
                                .attr('cy', startOfPoints.y - pointOffset)
                                .attr('r', axisradius);
                            pointOffset += axisradius * 3;
                        }
                    });
                } else {
                    let dataentry = this.preparedData.find(el => el.internalId === entry.id);
                    if (dataentry) {
                        this.graph.append('circle')
                            .attr('class', 'axisDots')
                            .attr('id', 'axisdot-' + entry.id)
                            .attr('stroke', dataentry.color)
                            .attr('fill', dataentry.color)
                            .attr('cx', startOfPoints.x)
                            .attr('cy', startOfPoints.y - pointOffset)
                            .attr('r', axisradius);
                    }
                }
            }

            // set id to uom, if group yaxis is toggled, else set id to dataset id
            let id: string = (entry.id ? entry.id : entry.uom);
            this.checkYselector(id, entry.uom);

            const axisDiv = this.graph.append('rect')
                // .attr('id', 'yaxis' + id)
                .attr('class', 'axisDiv')
                .attr('width', axisWidthDiv)
                .attr('height', this.height)
                .attr('fill', 'grey')
                .attr('opacity', (this.yAxisSelect[id].clicked ? this.opac.click : this.opac.default))
                .on('mouseover', (d, i, k) => {
                    d3.select(k[0])
                        .attr('opacity', this.opac.hover);
                })
                .on('mouseout', (d, i, k) => {
                    if (!this.yAxisSelect[id].clicked) {
                        d3.select(k[0])
                            .attr('opacity', this.opac.default);
                    } else {
                        d3.select(k[0])
                            .attr('opacity', this.opac.click);
                    }
                })
                .on('mouseup', (d, i, k) => {
                    if (!this.yAxisSelect[id].clicked) {
                        d3.select(k[0])
                            .attr('opacity', this.opac.default);
                    } else {
                        d3.select(k[0])
                            .attr('opacity', this.opac.click);
                    }
                    this.yAxisSelect[id].clicked = !this.yAxisSelect[id].clicked;

                    let entryArray = [];
                    if (entry.id) {
                        entryArray.push(entry.id);
                    } else {
                        entryArray = entry.ids;
                    }
                    this.highlightLine(entryArray);
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
        if (this.yRangesEachUom.length === 1) {
            this.graph.append('svg:g')
                .attr('class', 'grid')
                .attr('transform', 'translate(' + buffer + ', 0)')
                .call(d3.axisLeft(yScale)
                    .ticks(5)
                    .tickSize(-this.width + buffer)
                    .tickFormat(() => '')
                );
        }

        return {
            buffer,
            yScale
        };
    }

    /**
     * Function to check whether object yAxisSelect exists with selected uom.
     * If it does not exist, it will be created.
     * @param identifier {String} String providing the selected uom or the selected dataset ID.
     */
    private checkYselector(identifier: string, uom: string): void {
        if (this.yAxisSelect === undefined) {
            this.yAxisSelect = {};
        }

        let selector: YAxisSelection = {
            id: identifier,
            ids: (this.yAxisSelect[identifier] !== undefined ? this.yAxisSelect[identifier].ids : []),
            uom: uom,
            clicked: (this.yAxisSelect[identifier] !== undefined ? this.yAxisSelect[identifier].clicked : false)
        };

        this.yAxisSelect[identifier] = selector;
    }

    /**
     * Function to adapt y axis highlighting to selected TS or selected uom
     */
    private changeYselection(): void {
        let groupList = {};
        if (this.yAxisSelect) {
            if (!this.plotOptions.groupYaxis) {
                // before: group
                for (let key in this.yAxisSelect) {
                    if (this.yAxisSelect.hasOwnProperty(key)) {
                        let el = this.yAxisSelect[key];
                        if (el.ids.length > 0) {
                            el.ids.forEach((id) => {
                                let dataEl = this.preparedData.find((entry) => entry.internalId === id);
                                let newSelector: YAxisSelection = {
                                    id: id,
                                    ids: [id],
                                    clicked: true,
                                    uom: dataEl.axisOptions.uom
                                };
                                groupList[id] = newSelector;
                            });
                        } else if (el.clicked && el.uom !== el.id) {
                            let dataEl = this.preparedData.find((entry) => entry.internalId === el.id);
                            let newSelector: YAxisSelection = {
                                id: el.id,
                                ids: [el.id],
                                clicked: true,
                                uom: dataEl.axisOptions.uom
                            };
                            groupList[el.id] = newSelector;
                        }
                    }
                }
            } else {
                // before: no group
                for (let key in this.yAxisSelect) {
                    if (this.yAxisSelect.hasOwnProperty(key)) {
                        let el = this.yAxisSelect[key];
                        let dataEl = this.preparedData.find((entry) => entry.internalId === el.id);
                        let selectionID;
                        if (dataEl && dataEl.axisOptions.separateYAxis) {
                            // selection is dataset with internalId
                            selectionID = dataEl.internalId;
                        } else {
                            // selection is uom
                            selectionID = el.uom;
                        }
                        if (!groupList[selectionID]) {
                            let currentUom: YAxisSelection = {
                                id: selectionID,
                                ids: [],
                                clicked: false,
                                uom: el.uom
                            };
                            groupList[selectionID] = currentUom;
                        }

                        if (el.clicked) {
                            groupList[selectionID].ids.push(el.id);
                        }

                        if (el.uom === selectionID) {
                            // execute for grouped uom
                            let groupedDatasets = this.countGroupedDatasets(selectionID, el.uom);
                            if (groupList[selectionID].ids.length === groupedDatasets) {
                                groupList[selectionID].clicked = true;
                            }
                        } else if (el.clicked) {
                            // execute for ungrouped dataset
                            groupList[selectionID].clicked = true;
                        }
                    }
                }
            }
            this.yAxisSelect = {}; // unselect all - y axis
            this.yAxisSelect = groupList;
        }
        this.oldGroupYaxis = this.plotOptions.groupYaxis;
    }

    /**
     * Function that returns the amount of datasets that are grouped with the same uom
     * @param uom {String} uom
     * @param id {String} internalId of the dataset that can be skipped
     * returns {Number} amount of datasets with the given uom
     */
    private countGroupedDatasets(uom: string, id: string): number {
        let arrayUomCount = 0;
        this.dataYranges.forEach(el => {
            if (el !== null && el.uom === uom && el.id !== id) {
                let idx = this.preparedData.findIndex(ds => ds.internalId === el.id && ds.axisOptions.separateYAxis === false);
                if (idx >= 0) { arrayUomCount++; }
            }
        });
        return arrayUomCount;
    }

    /**
     * Function to set selected Ids that should be highlighted.
     * @param ids {Array} Array of Strings containing the Ids.
     * @param uom {String} String with the uom for the selected Ids
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
    protected drawGraphLine(entry: InternalDataEntry): void {
        // const getYaxisRange = this.yRangesEachUom.find((obj) => obj.ids.indexOf(entry.internalId) > -1);
        // check for y axis grouping
        let getYaxisRange = this.getYaxisRange(entry);

        if (entry.data.length > 0) {
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
                    .defined((d) => !isNaN(d[1]))
                    .x((d) => {
                        d.timestamp = d[0];
                        const xDiagCoord = xScaleBase(d[0]);
                        if (!isNaN(xDiagCoord)) {
                            d.xDiagCoord = xDiagCoord;
                            return xDiagCoord;
                        }
                    })
                    .y((d) => {
                        const yDiagCoord = yScaleBase(d[1]);
                        if (!isNaN(yDiagCoord)) {
                            d.yDiagCoord = yDiagCoord;
                            return yDiagCoord;
                        }
                    })
                    .curve(d3.curveLinear);

                this.graphBody
                    .append('svg:path')
                    .datum(entry.data)
                    .attr('class', 'line')
                    .attr('fill', 'none')
                    .attr('stroke', entry.color)
                    .attr('stroke-width', entry.lines.lineWidth)
                    .attr('d', line);

                this.graphBody.selectAll('.graphDots')
                    .data(entry.data.filter((d) => !isNaN(d[1])))
                    .enter().append('circle')
                    .attr('class', 'graphDots')
                    .attr('id', function (d) {
                        return 'dot-' + d[0] + '-' + entry.id + '';
                    })
                    .attr('stroke', entry.color)
                    .attr('fill', entry.color)
                    .attr('cx', line.x())
                    .attr('cy', line.y())
                    .attr('r', entry.lines.pointRadius);
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

    protected getYaxisRange(entry: InternalDataEntry): YRanges {
        // check if entry dataset should be separated or entry datasets should be grouped
        if (!entry.axisOptions.separateYAxis && (this.plotOptions.groupYaxis || this.plotOptions.groupYaxis === undefined)) {
            return this.yRangesEachUom.find((obj) => {
                if (obj !== null && obj.uom === entry.axisOptions.uom) {
                    return true;
                } // uom does exist in this.yRangesEachUom
            });
        } else {
            return this.dataYranges.find((obj) => {
                if (obj !== null && obj.id === entry.internalId) {
                    return true;
                } // id does exist in this.dataYranges
            });
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
        const bisectDate = d3.bisector((d: DataEntry) => {
            return d[0];
        }).left;
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
    private showDiagramIndicator = (entry, idx: number, xCoordMouse: number, entryIdx: number): void => {
        const item: DataEntry = entry.data[idx];
        this.labelXCoord[entryIdx] = null;
        this.distLabelXCoord[entryIdx] = null;

        if (item !== undefined && item.yDiagCoord && item[1] !== undefined) {
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
    private chVisLabel(entry, visible: boolean, entryIdx: number): void {
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
    private showLabelValues(entry, item: DataEntry): void {
        let id = 1;
        let onLeftSide: boolean = this.checkLeftSide(item.xDiagCoord);
        if (entry.focusLabel) {
            entry.focusLabel.text(item[id] + (entry.axisOptions.uom ? entry.axisOptions.uom : ''));
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
                'timestamp': item[0],
                'value': item[1]
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
        let min = d3.min(this.distLabelXCoord);
        let idxOfMin = this.distLabelXCoord.findIndex((elem) => elem === min);
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
        textObj.each(function (u, i, d) {
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

}
