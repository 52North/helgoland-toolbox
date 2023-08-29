import { Component } from "@angular/core";
import { Timespan } from "@helgoland/core";
import * as d3 from "d3";

import { D3GraphHelperService } from "../../../helper/d3-graph-helper.service";
import { D3GraphId } from "../../../helper/d3-graph-id.service";
import { D3Graphs } from "../../../helper/d3-graphs.service";
import { DataEntry, InternalDataEntry } from "../../../model/d3-general";
import { D3GraphExtent, D3TimeseriesGraphControl } from "../../d3-timeseries-graph-control";
import { D3TimeseriesGraphInterface } from "../../d3-timeseries-graph.interface";

@Component({
  selector: 'n52-d3-graph-pan-zoom-interaction',
  template: '',
  styleUrls: ['./d3-graph-pan-zoom-interaction.component.scss'],
  standalone: true
})
export class D3GraphPanZoomInteractionComponent extends D3TimeseriesGraphControl {

  protected dragging: boolean = false;
  protected dragStart: [number, number] | undefined;
  protected dragCurrent: [number, number] | undefined;
  protected draggingMove: boolean | undefined;
  protected dragMoveStart: number | undefined;
  protected dragMoveRange: [number, number] | undefined;
  protected dragTimeStart: number | undefined;
  protected plotWhileDrag: boolean | undefined;

  protected isHoverable: boolean | undefined;

  protected dragRect: any;
  protected dragRectG: any;

  protected xAxisRangeOrigin: any = [];
  protected xAxisRangePan: [number, number] | undefined;

  protected d3Graph: D3TimeseriesGraphInterface | undefined;

  protected timespan: Timespan | undefined;
  protected graphExtent: D3GraphExtent | undefined;
  protected graph: d3.Selection<SVGSVGElement, any, any, any> | undefined;
  protected preparedData: InternalDataEntry[] = [];

  constructor(
    protected override graphId: D3GraphId,
    protected override graphs: D3Graphs,
    protected override graphHelper: D3GraphHelperService
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
    this.graph = graph;
    this.preparedData = preparedData;
  }

  public zoomStartBackground(event: MouseEvent) {
    if (this.timespan)
      this.zoomStartHandler(this.timespan, event);
  }

  public zoomMoveBackground(event: MouseEvent) {
    if (this.graph && this.graphExtent)
      this.zoomHandler(this.graph, this.graphExtent, event);
  }

  public zoomEndBackground() {
    if (this.graphExtent && this.timespan)
      this.zoomEndHandler(this.timespan, this.graphExtent, this.preparedData);
  }

  public dragStartBackground(event: MouseEvent) {
    if (this.timespan)
      this.panStartHandler(this.timespan, event);
  }

  public dragMoveBackground(event: MouseEvent) {
    if (this.graphExtent && this.dragMoveRange)
      this.panMoveHandler(this.graphExtent, this.dragMoveRange, event);
  }

  public dragEndBackground(event: MouseEvent) {
    this.panEndHandler();
  }

  /**
   * Function starting the drag handling for the diagram.
   */
  protected panStartHandler(timespan: Timespan, event: MouseEvent) {
    if (this.d3Graph) {
      this.dragTimeStart = new Date().valueOf();
      this.draggingMove = false;
      this.dragMoveStart = event.x;
      this.dragMoveRange = [timespan.from, timespan.to];
      this.isHoverable = this.d3Graph.plotOptions.hoverable || false;
      this.d3Graph.plotOptions.hoverable = false;
    }
  }

  /**
   * Function that controlls the panning (dragging) of the graph.
   */
  protected panMoveHandler(graphExtent: D3GraphExtent, dragMoveRange: [number, number], event: MouseEvent) {
    this.draggingMove = true;
    if (this.dragMoveStart && this.draggingMove && this.dragTimeStart && this.d3Graph) {
      const timeDiff = (new Date().valueOf() - this.dragTimeStart) >= 50;
      if (!this.plotWhileDrag && timeDiff) {
        this.plotWhileDrag = true;
        this.dragTimeStart = new Date().valueOf();
        const diff = -(event.x - this.dragMoveStart); // d3.event.subject.x);
        const amountTimestamp = dragMoveRange[1] - dragMoveRange[0];
        const ratioTimestampDiagCoord = amountTimestamp / graphExtent.width;
        const newTimeMin = dragMoveRange[0] + (ratioTimestampDiagCoord * diff);
        const newTimeMax = dragMoveRange[1] + (ratioTimestampDiagCoord * diff);

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
    if (this.xAxisRangePan && this.d3Graph) {
      this.d3Graph.plotOptions.hoverable = this.isHoverable;
      this.d3Graph.changeTime(this.xAxisRangePan[0], this.xAxisRangePan[1]);
      this.dragMoveStart = undefined;
      this.draggingMove = false;
      this.xAxisRangePan = undefined;
      this.dragTimeStart = undefined;
    }
  }

  /**
  * Function that starts the zoom handling.
  */
  protected zoomStartHandler(timespan: Timespan, event: MouseEvent) {
    this.dragging = false;
    // dependent on point or line hovering
    this.dragStart = d3.pointer(event);
    this.xAxisRangeOrigin.push([timespan.from, timespan.to]);
  }

  /**
   * Function that draws a rectangle when zoom is started and the mouse is moving.
   */
  protected zoomHandler(d3GraphElem: d3.Selection<SVGSVGElement, any, any, any>, graphExtent: D3GraphExtent, event: MouseEvent) {
    this.dragging = true;
    this.drawDragRectangle(d3GraphElem, graphExtent, event);
  }

  /**
   * Function that ends the zoom handling and calculates the via zoom selected time interval.
   */
  protected zoomEndHandler(timespan: Timespan, graphExtent: D3GraphExtent, preparedData: InternalDataEntry[]) {
    if (!this.d3Graph) return;
    if (!this.dragStart || !this.dragging) {
      if (this.xAxisRangeOrigin[0]) {
        // back to origin range (from - to)
        this.d3Graph.changeTime(this.xAxisRangeOrigin[0][0], this.xAxisRangeOrigin[0][1]);
        this.xAxisRangeOrigin = [];
        this.d3Graph.redrawCompleteGraph();
      }
    } else if (this.dragCurrent) {
      let newTimespan: [number, number];
      if (this.dragStart[0] <= this.dragCurrent[0]) {
        newTimespan = this.getxDomain(this.dragStart[0], this.dragCurrent[0], graphExtent, preparedData);
      } else {
        newTimespan = this.getxDomain(this.dragCurrent[0], this.dragStart[0], graphExtent, preparedData);
      }
      this.d3Graph.changeTime(newTimespan[0], newTimespan[1]);
    }
    this.dragStart = undefined;
    this.dragging = false;
    this.resetDrag();
  }

  /**
 * Function that returns the timestamp of provided x diagram coordinates.
 * @param start {Number} Number with the minimum diagram coordinate.
 * @param end {Number} Number with the maximum diagram coordinate.
 */
  protected getxDomain(start: number, end: number, graphExtent: D3GraphExtent, preparedData: InternalDataEntry[]): [number, number] {
    const domMinArr: DataEntry[] = [];
    const domMaxArr: DataEntry[] = [];
    let domMin: number = Number.NEGATIVE_INFINITY;
    let domMax: number = Number.POSITIVE_INFINITY;
    let lowestMin = Number.POSITIVE_INFINITY;
    let lowestMax = Number.POSITIVE_INFINITY;

    start += graphExtent.leftOffset;
    end += graphExtent.leftOffset;

    preparedData.forEach((entry) => {
      const matchStart = entry.data.find((elem, index, array) => {
        if (elem.xDiagCoord && elem.xDiagCoord >= start) {
          return array[index] !== undefined;
        }
        return undefined;
      });
      if (matchStart) domMinArr.push(matchStart);
      const matchEnd = entry.data.find((elem, index, array) => {
        if (elem.xDiagCoord && elem.xDiagCoord >= end) {
          return array[index] !== undefined;
        }
        return undefined;
      });
      if (matchEnd) domMaxArr.push(matchEnd);
    });

    for (let i = 0; i <= domMinArr.length - 1; i++) {
      if (domMinArr[i] != null) {
        const minCoord = domMinArr[i].xDiagCoord;
        if (minCoord && minCoord < lowestMin) {
          lowestMin = minCoord;
          domMin = domMinArr[i].timestamp;
        }
      }
    }
    for (let j = 0; j <= domMaxArr.length - 1; j++) {
      if (domMaxArr[j] != null) {
        const maxCoord = domMaxArr[j].xDiagCoord;
        if (maxCoord && maxCoord < lowestMax) {
          lowestMax = maxCoord;
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
    graphExtent: D3GraphExtent,
    event: MouseEvent
  ): void {
    if (!this.dragStart) { return; }
    this.dragCurrent = d3.pointer(event);

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
