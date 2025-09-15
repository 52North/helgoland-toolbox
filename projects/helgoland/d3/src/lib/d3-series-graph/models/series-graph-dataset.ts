import { FirstLastValue, MinMaxRange, PointSymbol } from '@helgoland/core';
import { extent } from 'd3';
import { Duration, duration, unitOfTime } from 'moment';
import { Subject } from 'rxjs';

export abstract class DatasetStyle {
  constructor(
    public baseColor: string,
    public lineWidth: number,
  ) {}

  abstract clone(): DatasetStyle;
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
    public override baseColor: string,
    public pointRadius: number = 0,
    public override lineWidth: number = 1,
    public pointSymbol?: PointSymbol,
    public lineDashArray?: number | number[],
    public pointBorderColor: string = baseColor,
    public pointBorderWidth: number = 1,
  ) {
    super(baseColor, lineWidth);
  }

  clone(): LineStyle {
    return new LineStyle(
      this.baseColor,
      this.pointRadius,
      this.lineWidth,
      this.pointSymbol,
      this.lineDashArray,
      this.pointBorderColor,
      this.pointBorderWidth,
    );
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
    public override baseColor: string,
    public startOf: unitOfTime.StartOf = 'hour',
    public period: Duration = duration('PT1H'),
    public override lineWidth: number = 1,
    public lineDashArray?: number | number[],
  ) {
    super(baseColor, lineWidth);
  }

  clone(): BarStyle {
    return new BarStyle(
      this.baseColor,
      this.startOf,
      this.period,
      this.lineWidth,
      this.lineDashArray,
    );
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
    public range?: MinMaxRange,
  ) {}

  clone(): AxisSettings {
    return new AxisSettings(
      this.showSymbolOnAxis,
      this.separate,
      this.zeroBased,
      this.autoRangeSelection,
      this.range,
    );
  }
}

/**
 * Additional data entry tuple
 */
export interface GraphDataEntry {
  timestamp: number;
  value: number;
  highlight?: boolean;
  xDiagCoord?: number;
  yDiagCoord?: number;
}

export interface DatasetDescription {
  uom: string;
  phenomenonLabel?: string;
  platformLabel?: string;
  procedureLabel?: string;
  categoryLabel?: string[];
  featureLabel?: string;
  serviceLabel?: string;
  firstValue?: FirstLastValue;
  lastValue?: FirstLastValue;
}

export abstract class DatasetChild {
  stateChangeEvent: Subject<void> = new Subject();

  constructor(
    protected _id: string,
    protected _label: string,
    protected _visible: boolean,
  ) {}

  get id(): string {
    return this._id;
  }

  get visible(): boolean {
    return this._visible;
  }

  setVisible(v: boolean, update = true) {
    this._visible = v;
    if (update) {
      this.stateChangeEvent.next();
    }
  }

  get label(): string {
    return this._label;
  }

  abstract getDataExtent(): [number, number] | [undefined, undefined];
}

export class TimeseriesChild extends DatasetChild {
  constructor(
    protected override _id: string,
    protected override _label: string,
    protected override _visible: boolean,
    private _data: GraphDataEntry[],
    private _color: string,
  ) {
    super(_id, _label, _visible);
  }

  get data(): GraphDataEntry[] {
    return this._data;
  }

  setData(data: GraphDataEntry[]) {
    this._data = data;
  }

  override getDataExtent() {
    return extent<GraphDataEntry, number>(this.data, (d) =>
      typeof d.value === 'number' ? d.value : null,
    );
  }

  get color(): string {
    return this._color;
  }

  setColor(color: string) {
    this._color = color;
  }
}

export interface AreaDatasetChildDataEntry {
  timestamp: number;
  values: (number | null)[];
}

export interface AreaDatasetChildStyle {
  color: string;
}

export class AreaDatasetChild extends DatasetChild {
  private _data: AreaDatasetChildDataEntry[] = [];

  constructor(
    protected override _id: string,
    protected override _label: string,
    protected override _visible: boolean,
    private _styles: AreaDatasetChildStyle[],
  ) {
    super(_id, _label, _visible);
  }

  public get data() {
    return this._data;
  }

  public get styles(): AreaDatasetChildStyle[] {
    return this._styles;
  }

  override getDataExtent() {
    const values: number[] = [];
    this._data.forEach((e) => {
      e.values.forEach((v) => {
        if (v !== null) {
          values.push(v);
        }
      });
    });
    return extent(values);
  }

  setData(data: AreaDatasetChildDataEntry[]) {
    this._data = data;
  }
}

export class SeriesGraphDataset<T extends DatasetStyle = DatasetStyle> {
  private _data: GraphDataEntry[] = [];
  private _dataLoading: boolean = false;

  private _children: DatasetChild[] = [];

  stateChangeEvent: Subject<SeriesGraphDataset> = new Subject();
  dataChangeEvent: Subject<SeriesGraphDataset> = new Subject();
  deleteEvent: Subject<SeriesGraphDataset> = new Subject();

  additional?: any;

  constructor(
    private _id: string,
    private _style: T,
    private _yaxis: AxisSettings,
    private _visible: boolean,
    private _selected: boolean,
    private _description: DatasetDescription,
  ) {}

  clone(): SeriesGraphDataset {
    return new SeriesGraphDataset(
      this.id,
      this.style.clone(),
      this.yAxis.clone(),
      this.visible,
      this.selected,
      {
        categoryLabel: this.description.categoryLabel,
        featureLabel: this.description.featureLabel,
        firstValue: this.description.firstValue,
        lastValue: this.description.lastValue,
        phenomenonLabel: this.description.phenomenonLabel,
        platformLabel: this.description.platformLabel,
        procedureLabel: this.description.procedureLabel,
        uom: this.description.uom,
      },
    );
  }

  get dataLoading(): boolean {
    return this._dataLoading;
  }

  setDataLoading(loading: boolean) {
    this._dataLoading = loading;
  }

  get selected(): boolean {
    return this._selected;
  }

  setSelected(selected: boolean, update = true) {
    this._selected = selected;
    update && this.stateChangeEvent.next(this);
  }

  get visible(): boolean {
    return this._visible;
  }

  setVisible(visible: boolean, update = true) {
    this._visible = visible;
    update && this.stateChangeEvent.next(this);
  }

  get style(): T {
    return this._style;
  }

  setStyle(style: T, update = true) {
    this._style = style;
    update && this.stateChangeEvent.next(this);
  }

  get yAxis(): AxisSettings {
    return this._yaxis;
  }

  setYAxis(yaxis: AxisSettings, update = true) {
    this._yaxis = yaxis;
    update && this.stateChangeEvent.next(this);
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
    this.dataChangeEvent.next(this);
  }

  hasData(): boolean {
    return this._data.length > 0;
  }

  addNewData(timestamp: number, value: number, highlight?: boolean) {
    this._data.push({ timestamp, value, highlight });
    this.description.lastValue = { timestamp, value };
    this.dataChangeEvent.next(this);
  }

  deleted(): void {
    this.deleteEvent.next(this);
  }

  get children(): DatasetChild[] {
    return this._children;
  }

  addChild(child: DatasetChild) {
    if (!this.hasChild(child)) {
      this._children.push(child);
      child.stateChangeEvent.subscribe(() => this.stateChangeEvent.next(this));
    } else {
      console.error(`A child with the id ${child.id} still exists`);
    }
  }

  hasChild(child: DatasetChild): boolean {
    return this._children.findIndex((e) => e.id === child.id) >= 0;
  }

  removeChild(child: DatasetChild) {
    const idx = this._children.findIndex((e) => e.id === child.id);
    if (idx >= 0) {
      delete this._children[idx];
    }
  }
}
