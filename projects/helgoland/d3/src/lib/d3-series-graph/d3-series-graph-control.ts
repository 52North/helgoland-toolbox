import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { Timespan } from '@helgoland/core';

import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3GraphId } from '../helper/d3-graph-id.service';
import { D3Graphs } from '../helper/d3-graphs.service';
import { YAxis } from '../model/d3-general';
import { SeriesGraphDataset } from '../model/dataset';
import { D3GraphInterface } from './d3-graph.interface';

export interface D3GraphObserver {
    adjustBackground?(
        background: d3.Selection<SVGSVGElement, any, any, any>,
        graphExtent: D3GraphExtent,
        preparedData: SeriesGraphDataset[],
        graph: d3.Selection<SVGSVGElement, any, any, any>,
        timespan: Timespan
    ): void;
    cleanUp?();
    mousemoveBackground?();
    mouseoverBackground?();
    mouseoutBackground?();
    dragStartBackground?();
    dragMoveBackground?();
    dragEndBackground?();
    zoomStartBackground?();
    zoomMoveBackground?();
    zoomEndBackground?();
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
export abstract class D3SeriesGraphControl implements AfterViewInit, OnDestroy, D3GraphObserver {

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

    public abstract graphInitialized(graph: D3GraphInterface);

    public adjustYAxis?(axis: YAxis): void;

    public cleanUp?(): void;

}

