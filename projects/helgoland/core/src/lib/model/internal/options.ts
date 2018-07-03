export class DatasetOptions {
    public internalId: string;
    public color: string;
    public visible = true;
    public visualize = true;
    public loading?: boolean;
    public separateYAxe ?= false;
    public zeroBasedYAxe ?= false;
    public generalize ?= false;
    public showReferenceValues: ReferenceValueOption[] = [];
    public pointRadius = 0;
    public lineWidth = 1;

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
