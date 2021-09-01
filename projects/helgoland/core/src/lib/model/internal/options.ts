/**
 * Options for each dataset.
 *
 * @export
 */
export class DatasetOptions {

    /**
     * internal dataset id
     */
    public internalId: string;

    /**
     * type to display the data
     * default is 'line'
     */
    public type: 'line' | 'bar' = 'line';

    /**
     * color of the dataset
     */
    public color: string;

    /**
     * show or hide in the graph
     */
    public visible: boolean = true;

    /**
     * separate y axis of datasets with same unit
     */
    public separateYAxis?: boolean = false;

    /**
     * align graph that zero y axis is visible
     */
    public zeroBasedYAxis?: boolean = false;

    /**
     * auto zoom when range selection
     */
    public autoRangeSelection?: boolean = false;

    /**
     * marker to request dataset data generalized
     */
    public generalize?: boolean = false;

    /**
     * list of visible reference values
     */
    public showReferenceValues: ReferenceValueOption[] = [];

    /**
     * radius of graphpoint
     * default is 0
     */
    public pointRadius: number = 0;

    /**
     * the start of, where to start with the bar chart
     * See also: https://momentjs.com/docs/#/manipulating/start-of/
     * default is 'hour'
     */
    public barStartOf: string = 'hour';

    /**
     * period of the bars
     * defined as moment.duration by a string
     * See also: https://momentjs.com/docs/#/durations/
     * default is 'PT1H' which means one hour duration
     */
    public barPeriod: string = 'PT1H';

    /**
     * width of graphline
     */
    public lineWidth: number = 1;

    /**
     * dasharray to structure the line or bar chart border
     * See also here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     */
    public lineDashArray: number | number[];

    /**
     * color of the point border
     */
    public pointBorderColor: string;

    /**
     * width of the point border
     */
    public pointBorderWidth: number = 0;

    /**
     * min and max range of y axis
     */
    public yAxisRange?: MinMaxRange;

    public pointSymbol?: PointSymbol;

    constructor(
        internalId: string,
        color: string
    ) {
        this.internalId = internalId;
        this.color = color;
    }
}

export interface ReferenceValueOption {
    id: string;
    color: string;
}

/**
 * numbered range with a min and a max value
 *
 * @export
 */
export interface MinMaxRange {
    min?: number;
    max?: number;
}

export class TimedDatasetOptions extends DatasetOptions {
    public timestamp: number;

    constructor(
        internalId: string,
        color: string,
        timestamp: number
    ) {
        super(internalId, color);
        this.timestamp = timestamp;
    }
}

export enum PointSymbolType {
    cross = 'cross',
    diamond = 'diamond',
    square = 'square',
    star = 'star',
    triangle = 'triangle',
    wye = 'wye'
}
export interface PointSymbol {
    type: PointSymbolType;
    size: number;
}
