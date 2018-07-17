/**
 * Options for each dataset.
 *
 * @export
 * @class DatasetOptions
 */
export class DatasetOptions {

    /**
     * internal dataset id
     *
     * @type {string}
     * @memberof DatasetOptions
     */
    public internalId: string;

    /**
     * color of the dataset
     *
     * @type {string}
     * @memberof DatasetOptions
     */
    public color: string;

    /**
     * show or hide in the graph
     *
     * @type {boolean}
     * @memberof DatasetOptions
     */
    public visible: boolean = true;

    public loading?: boolean;

    /**
     * separate y axis of datasets with same unit
     *
     * @type {boolean}
     * @memberof DatasetOptions
     */
    public separateYAxis?: boolean = false;

    /**
     * align graph that zero y axis is visible
     *
     * @type {boolean}
     * @memberof DatasetOptions
     */
    public zeroBasedYAxis?: boolean = false;

    /**
     * marker to request dataset data generalized
     *
     * @type {boolean}
     * @memberof DatasetOptions
     */
    public generalize?: boolean = false;

    /**
     * list of visible reference values
     *
     * @type {ReferenceValueOption[]}
     * @memberof DatasetOptions
     */
    public showReferenceValues: ReferenceValueOption[] = [];

    /**
     * radius of graphpoint
     *
     * @type {number}
     * @memberof DatasetOptions
     */
    public pointRadius: number = 0;

    /**
     * width of graphline
     *
     * @type {number}
     * @memberof DatasetOptions
     */
    public lineWidth: number = 1;

    /**
     * min and max range of y axis
     *
     * @type {MinMaxRange}
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
 * @interface MinMaxRange
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
