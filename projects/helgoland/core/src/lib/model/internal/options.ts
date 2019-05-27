import moment from 'moment';

/**
 * Options for each dataset.
 *
 * @export
 */
export class DatasetOptions {

    /**
     * internal dataset id
     *
     * @memberof DatasetOptions
     */
    public internalId: string;

    /**
     * type to display the data
     * default is 'line'
     *
     * @memberof DatasetOptions
     */
    public type: 'line' | 'bar' = 'line';

    /**
     * color of the dataset
     *
     * @memberof DatasetOptions
     */
    public color: string;

    /**
     * show or hide in the graph
     *
     * @memberof DatasetOptions
     */
    public visible: boolean = true;

    /**
     * separate y axis of datasets with same unit
     *
     * @memberof DatasetOptions
     */
    public separateYAxis?: boolean = false;

    /**
     * align graph that zero y axis is visible
     *
     * @memberof DatasetOptions
     */
    public zeroBasedYAxis?: boolean = false;

    /**
     * auto zoom when range selection
     *
     * @memberof DatasetOptions
     */
    autoRangeSelection?: boolean = false;

    /**
     * marker to request dataset data generalized
     *
     * @memberof DatasetOptions
     */
    public generalize?: boolean = false;

    /**
     * list of visible reference values
     *
     * @memberof DatasetOptions
     */
    public showReferenceValues: ReferenceValueOption[] = [];

    /**
     * radius of graphpoint
     * default is 0
     *
     * @memberof DatasetOptions
     */
    public pointRadius: number = 0;

    /**
     * the start of, where to start with the bar chart
     * See also: https://momentjs.com/docs/#/manipulating/start-of/
     * default ist 'hour'
     *
     * @memberof DatasetOptions
     */
    public barStartOf: moment.unitOfTime.StartOf = 'hour';

    /**
     * period of the bars
     *
     * @memberof DatasetOptions
     */
    public barPeriod: moment.Duration = moment.duration(1, 'hour');

    /**
     * width of graphline
     *
     * @memberof DatasetOptions
     */
    public lineWidth: number = 1;

    /**
     * dasharray to structure the line or bar chart border
     * See also here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     *
     * @memberof DatasetOptions
     */
    public lineDashArray: number | number[];

    /**
     * color of the point border
     *
     * @memberof DatasetOptions
     */
    public pointBorderColor: string;

    /**
     * width of the point border
     *
     * @memberof DatasetOptions
     */
    public pointBorderWidth: number = 0;

    /**
     * min and max range of y axis
     *
     * @memberof DatasetOptions
     */
    public yAxisRange?: MinMaxRange;

    constructor(
        internalId: string,
        color: string
    ) {
        this.internalId = internalId;
        this.color = color;
    }
}

export class ReferenceValueOption {
    public id: string;
    public color: string;
}

/**
 * numbered range with a min and a max value
 *
 * @export
 */
export interface MinMaxRange {
    min: number;
    max: number;
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
