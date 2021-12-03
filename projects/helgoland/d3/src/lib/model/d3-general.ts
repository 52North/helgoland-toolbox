import { MinMaxRange } from '@helgoland/core';
import { ScaleLinear } from 'd3';

import { SeriesGraphDataset } from '../d3-series-graph/models/series-graph-dataset';

export interface DataEntry {
    timestamp: number;
    value: number;
    xDiagCoord?: number;
    yDiagCoord?: number;
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
