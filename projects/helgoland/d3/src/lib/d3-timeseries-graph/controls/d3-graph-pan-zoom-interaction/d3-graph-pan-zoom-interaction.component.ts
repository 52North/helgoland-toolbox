import { Component } from '@angular/core';
import { Timespan } from '@helgoland/core';
import * as d3 from 'd3';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { InternalDataEntry } from '../../../model/d3-general';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphInterface } from '../../d3-timeseries-graph.interface';

@Component({
  selector: 'n52-d3-graph-pan-zoom-interaction',
  template: '',
  styleUrls: ['./d3-graph-pan-zoom-interaction.component.scss']
})
export class D3GraphPanZoomInteractionComponent extends D3TimeseriesGraphControl {

  protected dragging: boolean;
  protected dragStart: [number, number];
  protected dragCurrent: [number, number];
  protected draggingMove: boolean;
  protected dragMoveStart: number;
  protected dragMoveRange: [number, number];
  protected dragTimeStart: number;
  protected plotWhileDrag: boolean;

  protected isHoverable: boolean;

  protected dragRect: any;
  protected dragRectG: any;

  protected xAxisRangeOrigin: any = [];
  protected xAxisRangePan: [number, number];

  protected d3Graph: D3TimeseriesGraphInterface;

  protected timespan: Timespan;
  protected graphExtent: D3GraphExtent;
  protected background: d3.Selection<SVGSVGElement, any, any, any>;
  protected graph: d3.Selection<SVGSVGElement, any, any, any>;
  protected preparedData: InternalDataEntry[];

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService
  ) {
    super(graphId, graphs, graphHelper);
  }

  public graphInitialized(graph: D3TimeseriesGraphInterface) {
    this.d3Graph = graph;
  }

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ) {
    this.timespan = timespan;
    this.graphExtent = graphExtent;
    this.background = background;
    this.graph = graph;
    this.preparedData = preparedData;
  }

  public zoomStartBackground() {
    this.zoomStartHandler(this.timespan, this.background);
  }

  public zoomMoveBackground() {
    this.zoomHandler(this.graph, this.background, this.graphExtent);
  }

  public zoomEndBackground() {
    this.zoomEndHandler(this.timespan, this.graphExtent, this.preparedData);
  }

  public dragStartBackground() {
    this.panStartHandler();
  }

  public dragMoveBackground() {
    this.panMoveHandler();
  }

  public dragEndBackground() {
    this.panEndHandler();
  }

  /**
   * Function starting the drag handling for the diagram.
   */
  protected panStartHandler() {
    this.dragTimeStart = new Date().valueOf();
    this.draggingMove = false;
    this.dragMoveStart = d3.event.x;
    this.dragMoveRange = [this.timespan.from, this.timespan.to];
    this.isHoverable = this.d3Graph.plotOptions.hoverable;
    this.d3Graph.plotOptions.hoverable = false;
  }

  /**
   * Function that controlls the panning (dragging) of the graph.
   */
  protected panMoveHandler() {
    this.draggingMove = true;
    const timeDiff = (new Date().valueOf() - this.dragTimeStart) >= 50;
    if (this.dragMoveStart && this.draggingMove && timeDiff) {
      if (!this.plotWhileDrag) {
        this.plotWhileDrag = true;
        this.dragTimeStart = new Date().valueOf();
        const diff = -(d3.event.x - this.dragMoveStart); // d3.event.subject.x);
        const amountTimestamp = this.dragMoveRange[1] - this.dragMoveRange[0];
        const ratioTimestampDiagCoord = amountTimestamp / this.graphExtent.width;
        const newTimeMin = this.dragMoveRange[0] + (ratioTimestampDiagCoord * diff);
        const newTimeMax = this.dragMoveRange[1] + (ratioTimestampDiagCoord * diff);

        this.xAxisRangePan = [newTimeMin, newTimeMax];
        this.d3Graph.setTimespan({ from: this.xAxisRangePan[0], to: this.xAxisRangePan[1] });
        this.d3Graph.drawBaseGraph();
        this.plotWhileDrag = false;
      }
    }
  }

  /**
   * Function that ends the dragging control.
   */
  protected panEndHandler() {
    this.d3Graph.plotOptions.hoverable = this.isHoverable;
    if (this.xAxisRangePan) {
      this.d3Graph.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
      this.dragMoveStart = null;
      this.draggingMove = false;
      this.xAxisRangePan = null;
      this.dragTimeStart = null;
    }
  }

  /**
 * Function that starts the zoom handling.
 */
  protected zoomStartHandler(timespan: Timespan, backgroundElem: d3.Selection<SVGSVGElement, any, any, any>) {
    this.dragging = false;
    // dependent on point or line hovering
    this.dragStart = d3.mouse(backgroundElem.node());
    this.xAxisRangeOrigin.push([timespan.from, timespan.to]);
  }

  /**
   * Function that draws a rectangle when zoom is started and the mouse is moving.
   */
  protected zoomHandler(d3GraphElem: d3.Selection<SVGSVGElement, any, any, any>, backgroundElem: d3.Selection<SVGSVGElement, any, any, any>, graphExtent: D3GraphExtent) {
    this.dragging = true;
    this.drawDragRectangle(d3GraphElem, backgroundElem, graphExtent);
  }

  /**
   * Function that ends the zoom handling and calculates the via zoom selected time interval.
   */
  protected zoomEndHandler(timespan: Timespan, graphExtent: D3GraphExtent, preparedData: any) {
    if (!this.dragStart || !this.dragging) {
      if (this.xAxisRangeOrigin[0]) {
        // back to origin range (from - to)
        this.d3Graph.changeTime(this.xAxisRangeOrigin[0][0], this.xAxisRangeOrigin[0][1]);
        this.xAxisRangeOrigin = [];
        this.d3Graph.redrawCompleteGraph();
      }
    } else {
      let newTimespan: [number, number];
      if (this.dragStart[0] <= this.dragCurrent[0]) {
        newTimespan = this.getxDomain(this.dragStart[0], this.dragCurrent[0], graphExtent, preparedData);
      } else {
        newTimespan = this.getxDomain(this.dragCurrent[0], this.dragStart[0], graphExtent, preparedData);
      }
      this.d3Graph.changeTime(newTimespan[0], newTimespan[1]);
    }
    this.dragStart = null;
    this.dragging = false;
    this.resetDrag();
  }

  /**
 * Function that returns the timestamp of provided x diagram coordinates.
 * @param start {Number} Number with the minimum diagram coordinate.
 * @param end {Number} Number with the maximum diagram coordinate.
 */
  protected getxDomain(start: number, end: number, graphExtent: D3GraphExtent, preparedData: any): [number, number] {
    const domMinArr = [];
    const domMaxArr = [];
    let domMin: number;
    let domMax: number;
    let tmp;
    let lowestMin = Number.POSITIVE_INFINITY;
    let lowestMax = Number.POSITIVE_INFINITY;

    start += graphExtent.leftOffset;
    end += graphExtent.leftOffset;

    preparedData.forEach((entry) => {
      domMinArr.push(entry.data.find((elem, index, array) => {
        if (elem.xDiagCoord) {
          if (elem.xDiagCoord >= start) {
            return array[index] !== undefined;
          }
        }
      }));
      domMaxArr.push(entry.data.find((elem, index, array) => {
        if (elem.xDiagCoord >= end) {
          return array[index] !== undefined;
        }
      }));
    });

    for (let i = 0; i <= domMinArr.length - 1; i++) {
      if (domMinArr[i] != null) {
        tmp = domMinArr[i].xDiagCoord;
        if (tmp < lowestMin) {
          lowestMin = tmp;
          domMin = domMinArr[i].timestamp;
        }
      }
    }
    for (let j = 0; j <= domMaxArr.length - 1; j++) {
      if (domMaxArr[j] != null) {
        tmp = domMaxArr[j].xDiagCoord;
        if (tmp < lowestMax) {
          lowestMax = tmp;
          domMax = domMaxArr[j].timestamp;
        }
      }
    }
    return [domMin, domMax];
  }

  /**
   * Function that configurates and draws the rectangle.
   */
  protected drawDragRectangle(
    d3GraphElem: d3.Selection<SVGSVGElement, any, any, any>,
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent
  ): void {
    if (!this.dragStart) { return; }
    this.dragCurrent = d3.mouse(background.node());

    const x1 = Math.min(this.dragStart[0], this.dragCurrent[0]);
    const x2 = Math.max(this.dragStart[0], this.dragCurrent[0]);

    if (!this.dragRect && !this.dragRectG) {

      this.dragRectG = d3GraphElem.append('g')
        .style('fill-opacity', .2)
        .style('fill', 'blue');

      this.dragRect = this.dragRectG.append('rect')
        .attr('width', x2 - x1)
        .attr('height', graphExtent.height)
        .attr('x', x1 + graphExtent.leftOffset)
        .attr('class', 'mouse-drag')
        .style('pointer-events', 'none');
    } else {
      this.dragRect.attr('width', x2 - x1)
        .attr('x', x1 + graphExtent.leftOffset);
    }
  }

  /**
   * Function that disables the drawing rectangle control.
   */
  protected resetDrag(): void {
    if (this.dragRectG) {
      this.dragRectG.remove();
      this.dragRectG = null;
      this.dragRect = null;
    }
  }

}
