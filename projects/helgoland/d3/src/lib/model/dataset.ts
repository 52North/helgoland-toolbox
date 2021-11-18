import { EventEmitter } from '@angular/core';
import { FirstLastValue, MinMaxRange, PointSymbol } from '@helgoland/core';
import { Duration, duration, unitOfTime } from 'moment';

export abstract class DatasetStyle {
    constructor(
        public baseColor: string,
        public lineWidth: number
    ) { }
}

export class LineStyle extends DatasetStyle {
    /**
     *Creates an instance of LineStyle.
     * @param {string} baseColor 
     * @param {number} [pointRadius=0] radius of graphpoint
     * @param {number} [lineWidth=1] width of graphline
     * @param {PointSymbol} [pointSymbol] 
     * @param {(number | number[])} [lineDashArray] dasharray to structure the line or bar chart border. See also here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     */
    constructor(
        public baseColor: string,
        public pointRadius: number = 0,
        public lineWidth: number = 1,
        public pointSymbol?: PointSymbol,
        public lineDashArray?: number | number[],
    ) {
        super(baseColor, lineWidth);
    }
}

export class BarStyle extends DatasetStyle {

    /**
     *Creates an instance of BarStyle.
     * @param {string} baseColor
     * @param {string} [barStartOf='hour'] the start of, where to start with the bar chart. See also: https://momentjs.com/docs/#/manipulating/start-of/
     * @param {string} [barPeriod='PT1H'] period of the bars defined as moment.duration. See also: https://momentjs.com/docs/#/durations/ default is 'PT1H' which means one hour duration
     * @param {number} [lineWidth=1] width of bar border line
     * @param {(number | number[])} [lineDashArray] dasharray to structure bar chart border. See also here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     * @memberof BarStyle
     */
    constructor(
        public baseColor: string,
        public startOf: unitOfTime.StartOf = 'hour',
        public period: Duration = duration('PT1H'),
        public lineWidth: number = 1,
        public lineDashArray?: number | number[],
    ) {
        super(baseColor, lineWidth);
    }
}

export class AxisSettings {

    /**
     * Creates an instance of AxisSettings.
     * @param {string} label Y-Axis label if no link to an existing dataset is given
     * @param {boolean} [separate=false] separate y axis of datasets with same unit
     * @param {boolean} [zeroBased=false] align graph that zero y axis is visible
     * @param {boolean} [autoRangeSelection=false] auto zoom when range selection
     * @param {MinMaxRange} [range] min and max range of y axis
     */
    constructor(
        public showSymbolOnAxis: boolean = true,
        public separate: boolean = false,
        public zeroBased: boolean = false,
        public autoRangeSelection: boolean = false,
        public range?: MinMaxRange
    ) { }
}

/**
 * Additional data entry tuple
 */
export interface GraphDataEntry {
    timestamp: number;
    value: number;
}

export interface DatasetDescription {
    uom: string,
    phenomenonLabel: string;
    platformLabel: string;
    procedureLabel: string;
    categoryLabel: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
}

export class DatasetChild {

    public stateChangeEvent: EventEmitter<void> = new EventEmitter(); // TODO: use Observable

    constructor(
        private _id: string,
        private _label: string,
        private _visible: boolean,
        private _data: GraphDataEntry[],
        private _color: string
    ) { }

    public get id(): string {
        return this._id;
    }

    public get visible(): boolean {
        return this._visible;
    }

    public setVisible(v: boolean, update = true) {
        this._visible = v;
        if (update) {
            this.stateChangeEvent.emit();
        }
    }

    public get data(): GraphDataEntry[] {
        return this._data;
    }

    public setData(data: GraphDataEntry[]) {
        this._data = data;
    }

    public get color(): string {
        return this._color;
    }

    public setColor(color: string) {
        this._color = color;
    }

    public get label(): string {
        return this._label;
    }

}

export class DatasetEntry {

    private _data: GraphDataEntry[] = [];
    private _dataLoading: boolean = false;

    private _overviewData: GraphDataEntry[] = [];
    private _overviewDataLoading: boolean = false;

    private _children: DatasetChild[] = [];

    public stateChangeEvent: EventEmitter<DatasetEntry> = new EventEmitter();
    public dataChangeEvent: EventEmitter<DatasetEntry> = new EventEmitter();
    public overviewDataChangeEvent: EventEmitter<DatasetEntry> = new EventEmitter();
    public deleteEvent: EventEmitter<DatasetEntry> = new EventEmitter();

    constructor(
        private _id: string,
        private _style: DatasetStyle,
        private _yaxis: AxisSettings,
        private _visible: boolean,
        private _selected: boolean,
        private _description: DatasetDescription
    ) { }

    get dataLoading(): boolean {
        return this._dataLoading;
    }

    setDataLoading(loading: boolean) {
        this._dataLoading = loading;
    }

    get overviewDataLoading(): boolean {
        return this._overviewDataLoading;
    }

    setOverviewDataLoading(loading: boolean) {
        this._overviewDataLoading = loading;
    }

    get selected(): boolean {
        return this._selected;
    }

    setSelected(selected: boolean, update = true) {
        this._selected = selected;
        update && this.stateChangeEvent.emit(this);
    }

    get visible(): boolean {
        return this._visible;
    }

    setVisible(visible: boolean) {
        this._visible = visible;
        this.stateChangeEvent.emit(this);
    }

    get style(): DatasetStyle {
        return this._style;
    }

    setStyle(style: DatasetStyle) {
        this._style = style;
        this.stateChangeEvent.emit(this);
    }

    get yAxis(): AxisSettings {
        return this._yaxis;
    }

    setYAxis(yaxis: AxisSettings) {
        this._yaxis = yaxis;
        this.stateChangeEvent.emit(this);
    }

    get id(): string {
        return this._id;
    }

    get description(): DatasetDescription {
        return this._description;
    }

    get data(): GraphDataEntry[] {
        return this._data;
    }

    setData(data: GraphDataEntry[]) {
        this._data = data;
        this.dataChangeEvent.emit(this);
    }

    hasData(): boolean {
        return this._data.length > 0;
    }

    get overviewData(): GraphDataEntry[] {
        return this._overviewData;
    }

    setOverviewData(data: GraphDataEntry[]) {
        this._overviewData = data;
        this.overviewDataChangeEvent.emit(this);
    }

    hasOverviewData(): boolean {
        return this._overviewData.length > 0;
    }

    addNewData(data: GraphDataEntry | GraphDataEntry[]) {
        if (data instanceof Array) {
            if (data.length > 0) {
                this._data.push(...data);
                this._overviewData.push(...data);
                this.description.lastValue = data[data.length - 1];
            }
        } else {
            this._data.push(data);
            this._overviewData.push(data);
            this.description.lastValue = data;
        }
        this.dataChangeEvent.emit(this);
        this.overviewDataChangeEvent.emit(this);
    }

    deleted(): void {
        this.deleteEvent.emit(this);
    }

    get children(): DatasetChild[] {
        return this._children;
    }

    addChild(child: DatasetChild) {
        if (!this.hasChild(child)) {
            this._children.push(child);
            child.stateChangeEvent.subscribe(() => this.stateChangeEvent.emit(this));
        } else {
            console.error(`A child with the id ${child.id} still exists`);
        }
    }

    hasChild(child: DatasetChild): boolean {
        return this._children.findIndex(e => e.id === child.id) >= 0;
    }

    removeChild(child: DatasetChild) {
        const idx = this._children.findIndex(e => e.id === child.id);
        if (idx >= 0) {
            delete this._children[idx];
        }
    }
}
