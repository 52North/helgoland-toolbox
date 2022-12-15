import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { Timespan } from '@helgoland/core';

import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3GraphId } from '../helper/d3-graph-id.service';
import { InternalDataEntry, YAxis } from '../model/d3-general';
import { D3Graphs } from './../helper/d3-graphs.service';
import { D3TimeseriesGraphInterface } from './d3-timeseries-graph.interface';

export interface D3GraphObserver {
    adjustBackground?(
        background: d3.Selection<SVGSVGElement, any, any, any>,
        graphExtent: D3GraphExtent,
        preparedData: InternalDataEntry[],
        graph: d3.Selection<SVGGElement, any, any, any>,
        timespan: Timespan
    ): void;
    cleanUp?(): void;
    mousemoveBackground?(): void;
    mouseoverBackground?(): void;
    mouseoutBackground?(): void;
    dragStartBackground?(): void;
    dragMoveBackground?(): void;
    dragEndBackground?(): void;
    zoomStartBackground?(): void;
    zoomMoveBackground?(): void;
    zoomEndBackground?(): void;
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
    xScale: d3.ScaleTime<number, number>;
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
@Directive()
export abstract class D3TimeseriesGraphControl implements AfterViewInit, OnDestroy, D3GraphObserver {

    constructor(
        protected graphId: D3GraphId,
        protected graphs: D3Graphs,
        protected graphHelper: D3GraphHelperService
    ) { }

    public ngAfterViewInit(): void {
        this.graphId.getId().subscribe(graphId => this.graphs.getGraph(graphId).subscribe(graph => {
            // needs to be registered first, to react then on the callbacks
            graph.registerObserver(this);
            this.graphInitialized(graph);
        }));
    }

    public ngOnDestroy(): void {
        this.graphId.getId().subscribe(graphId => this.graphs.getGraph(graphId).subscribe(graph => graph.unregisterObserver(this)));
        if (this.cleanUp) {
            this.cleanUp();
        }
    }

    public abstract graphInitialized(graph: D3TimeseriesGraphInterface): void;

    public adjustYAxis?(axis: YAxis): void;

    public cleanUp?(): void;

}

