import { ScaleLinear } from 'd3';

// input tyoe for d3-general-graph component
export interface D3GeneralInput {
    datasets: D3GeneralDatasetInput[];
    plotOptions: D3GeneralPlotOptions;
}

export interface D3GeneralDatasetInput {
    data: D3GeneralDataPoint[];
    id: string;
}

// dataset type inside d3-general-graph component
export interface D3GeneralDataset {
    data: D3GeneralDataPoint[];
    id: number;
}

export interface D3GeneralPlotOptions {
    xlabel: string;
    ylabel: string;
    date: boolean;
    graph?: D3GeneralGraphOptions;
}

export interface D3GeneralGraphOptions {
    color: string;
    lines: {
        lineWidth: number;
        pointRadius: number;
    };
}

export interface D3GeneralAxisOptions {
    xScale?: ScaleLinear<number, number>;
    yScale?: ScaleLinear<number, number>;
    xRange?: Range;
    yRange?: Range;
    date?: boolean;
}

export interface Range {
    min: number;
    max: number;
}

export interface D3GeneralDataPoint {
    x: number;
    y: number;
    xCoord?: number;
    yCoord?: number;
}
