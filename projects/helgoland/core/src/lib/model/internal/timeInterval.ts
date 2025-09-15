export abstract class TimeInterval {
  abstract toString(): string;
}

export class Timespan extends TimeInterval {
  from: number;

  to: number;

  constructor(from: number | Date, to?: number | Date) {
    super();
    this.from = from instanceof Date ? from.valueOf() : from;
    this.to = to ? (to instanceof Date ? to.valueOf() : to) : this.from;
  }

  override toString(): string {
    return `Timespan from ${new Date(this.from).toISOString()} to ${new Date(
      this.to,
    ).toISOString()}`;
  }
}

export class BufferedTime extends TimeInterval {
  timestamp: Date;
  bufferInterval: number;

  constructor(timestamp: Date, bufferInterval: number) {
    super();
    this.timestamp = timestamp;
    this.bufferInterval = bufferInterval;
  }

  override toString(): string {
    return `BufferedTime at ${this.timestamp.toISOString()} with buffer interval of ${
      this.bufferInterval
    } ms`;
  }
}
