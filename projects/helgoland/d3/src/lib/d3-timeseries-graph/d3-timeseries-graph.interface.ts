import { Timespan } from '@helgoland/core';

import { D3PlotOptions } from '../model/d3-plot-options';
import { D3GraphObserver } from './d3-timeseries-graph-control';

export interface D3TimeseriesGraphInterface {
    plotOptions: D3PlotOptions;
    setTimespan(timespan: Timespan): void;
    drawBaseGraph(): void;
    changeTime(from: number, to: number): void;
    /**
     * Function to plot the whole graph and its dependencies
     * (graph line, graph axes, event handlers)
     */
    redrawCompleteGraph(): void;
    getDrawingLayer(id: string, front?: boolean): d3.Selection<SVGGElement, any, any, any>;
    registerObserver(obs: D3GraphObserver);
    unregisterObserver(obs: D3GraphObserver);
}