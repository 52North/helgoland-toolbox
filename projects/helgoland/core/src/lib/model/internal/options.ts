/**
 * Options for each Dataset.
 * @param internalId {string} dataset id
 * @param color {string} color of the dataset
 * @param loading {boolean} loading
 * @param visible {boolean} show graph
 * @param separateYAxis {boolean} separate y axis of datasets with same unit
 * @param zeroBasedYAxis {boolean} align graph that zero y axis is visible
 * @param generalize {boolean} generalize
 * @param showReferenceValues {boolean} show reference values
 * @param pointRadius {number} radius of graphpoint
 * @param lineWidth {number} width of graphline
 * @param yAxisRange {MinMaxRange} min and max ramge of y axis
 */
export class DatasetOptions {
    public internalId: string;
    public color: string;
    public visible = true;
    public loading?: boolean;
    public separateYAxis?: boolean = false;
    public zeroBasedYAxis?: boolean = false;
    public generalize?: boolean = false;
    public showReferenceValues: ReferenceValueOption[] = [];
    public pointRadius = 0;
    public lineWidth = 1;
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
