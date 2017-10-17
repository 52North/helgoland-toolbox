export abstract class TimeInterval {

}

export class Timespan extends TimeInterval {

    public from: number;

    public to: number;

    constructor(from: number, to: number) {
        super();
        this.from = from;
        this.to = to;
    }
}

export class BufferedTime extends TimeInterval {
    public timestamp: Date;
    public bufferInterval: number;

    constructor(timestamp: Date, bufferInterval: number) {
        super();
        this.timestamp = timestamp;
        this.bufferInterval = bufferInterval;
    }
}
