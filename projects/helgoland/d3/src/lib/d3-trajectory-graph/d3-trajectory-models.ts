export enum D3AxisType {
    Distance,
    Time,
    Ticks
}

export interface D3GraphOptions {
    axisType: D3AxisType;
    dotted: boolean;
}

export class D3SelectionRange {
    public from: number;
    public to: number;
}
