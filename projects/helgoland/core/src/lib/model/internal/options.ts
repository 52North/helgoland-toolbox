export class DatasetOptions {
    public internalId: string;
    public color: string;
    public visible = true;
    public visualize = true;
    public loading?: boolean;
    public separateYAxis?: boolean = false;
    public zeroBasedYAxis?: boolean = false;
    public generalize?: boolean = false;
    public showReferenceValues: ReferenceValueOption[] = [];
    public pointRadius = 0;
    public lineWidth = 1;
    public yAxisRange: MinMaxRange = { min: 0, max: 0 };

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
