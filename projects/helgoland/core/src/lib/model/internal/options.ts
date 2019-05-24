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
     * type to display the data - line is default
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
     *
     * @memberof DatasetOptions
     */
    public pointRadius: number = 0;

    /**
     * width of graphline
     *
     * @memberof DatasetOptions
     */
    public lineWidth: number = 1;

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
