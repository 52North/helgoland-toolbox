import { Data, HelgolandTimeseries, MinMaxRange, TimeValueTuple } from '@helgoland/core';
import { ScaleLinear } from 'd3';

import { SeriesGraphDataset } from './dataset';

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

export interface DataEntry {
    timestamp: number;
    value: number;
    xDiagCoord?: number;
    yDiagCoord?: number;
}

export interface DataConst extends HelgolandTimeseries {
    data?: Data<TimeValueTuple>;
}

export interface YRanges {
    uom: string;
    range?: MinMaxRange;
    outOfrange: boolean;
    id?: string; // necessary if grouped by internalId
    ids?: string[]; // necessary if grouped by uom
    first?: boolean;
    yScale?: d3.ScaleLinear<number, number>;
    offset?: number;
    parameters: {   // additional information for the y axis label
        feature?: { id: String, label: String };
        phenomenon?: { id: String, label: String };
        offering?: { id: String, label: String };
    };
}

export interface YAxis {
    uom: string;
    range: MinMaxRange;
    fixedMin: boolean;
    fixedMax: boolean;
    ids: string[];
    seperate: boolean;
    selected: boolean;
    label?: string;
    first?: boolean;
    offset?: number;
    yScale?: d3.ScaleLinear<number, number>;
}

export interface YAxisSettings {
    visualMin: number;
    visualMax: number;
    fixedMin: boolean;
    fixedMax: boolean;
    entry: SeriesGraphDataset;
}
