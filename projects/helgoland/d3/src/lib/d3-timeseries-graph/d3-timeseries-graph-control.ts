import { Inject, OnDestroy, OnInit } from '@angular/core';
import { Timespan } from '@helgoland/core';

import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { InternalDataEntry, YAxis } from '../model/d3-general';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph.component';

export interface D3GraphObserver {
    adjustBackground?(
        background: d3.Selection<SVGSVGElement, any, any, any>,
        graphExtent: D3GraphExtent,
        preparedData: InternalDataEntry[],
        graph: d3.Selection<SVGSVGElement, any, any, any>,
        timespan: Timespan
    ): void;
    adjustYAxis?(axis: YAxis): void;
    afterYAxisDrawn?(yaxis: YAxis, startX: number, axisHeight: number, axisWidth: number): void;
}

export interface D3GraphExtent {
    width: number;
    height: number;
    leftOffset: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

/**
 * Abstract class represents an instance of a timeseries graph control component.
 * Registers and unregister an observer in the corresponding timeseries graph control.
 *
 * Every implementation of this abstract class can be configured to the corresponding timeseries component in this way:
 *
 * @example
 * <n52-d3-timeseries-graph>
 *      <implementation-selector></implementation-selector>
 * </n52-d3-timeseries-graph>
 */
export abstract class D3TimeseriesGraphControl implements OnInit, OnDestroy, D3GraphObserver {

    constructor(
        @Inject(D3TimeseriesGraphComponent) protected d3Graph: D3TimeseriesGraphComponent,
        protected graphHelper: D3GraphHelperService
    ) { }

    public ngOnInit(): void {
        this.d3Graph.registerObserver(this);
    }

    public ngOnDestroy(): void {
        this.d3Graph.unregisterObserver(this);
    }

    public adjustYAxis?(axis: YAxis): void;

}

