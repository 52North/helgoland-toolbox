import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Timespan } from '@helgoland/core';
import * as d3 from 'd3';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { InternalDataEntry } from '../../../model/d3-general';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';

@Component({
  selector: 'n52-d3-graph-overview-selection',
  template: '',
  styleUrls: ['./d3-graph-overview-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3GraphOverviewSelectionComponent extends D3TimeseriesGraphControl {

  // difference to timespan/timeInterval --> if brush, then this is the timespan of the main-diagram
  @Input() public mainTimeInterval: Timespan;

  private mousedownBrush: boolean;
  private graphComp: D3TimeseriesGraphComponent;
  overview: d3.Selection<SVGSVGElement, any, any, any>;
  drawLayer: d3.Selection<SVGGElement, any, any, any>;

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService
  ) {
    super(graphId, graphs, graphHelper);
  }

  public graphInitialized(graph: D3TimeseriesGraphComponent) {
    this.graphComp = graph;
  }

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ) {
    if (!this.drawLayer) {
      this.drawLayer = this.graphComp.getDrawingLayer('overview-layer', true);
    }

    this.drawLayer.selectAll('*').remove();
    this.drawLayer.append<SVGSVGElement>('svg:rect')
      .attr('width', graphExtent.width - graphExtent.leftOffset)
      .attr('height', graphExtent.height)
      .attr('id', 'backgroundRect')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('pointer-events', 'all')
      .attr('transform', 'translate(' + graphExtent.leftOffset + ', 0)');

    const interval: [number, number] = this.getXDomainByTimestamp(timespan, graphExtent.width);
    const overviewTimespanInterval = [interval[0], interval[1]];

    // create brush
    const brush = d3.brushX()
      .extent([[0, 0], [graphExtent.width, graphExtent.height]])
      .on('end', () => {
        // on mouseclick change time after brush was moved
        if (this.mousedownBrush) {
          const timeByCoord: [number, number] = this.getTimestampByCoord(d3.event.selection[0], d3.event.selection[1], timespan, graphExtent.width);
          this.graphComp.changeTime(timeByCoord[0], timeByCoord[1]);
        }
        this.mousedownBrush = false;
      });

    // add brush to svg
    this.overview = this.drawLayer.append<SVGSVGElement>('g')
      .attr('width', graphExtent.width)
      .attr('height', graphExtent.height)
      .attr('pointer-events', 'all')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, overviewTimespanInterval);

    /**
     * add event to selection to prevent unnecessary re-rendering of brush
     * add style of brush selection here
     * e.g. 'fill' for color,
     * 'stroke' for borderline-color,
     * 'stroke-dasharray' for customizing borderline-style
     */
    this.overview.selectAll('.selection')
      .attr('stroke', 'none')
      .on('mousedown', () => this.mousedownBrush = true);

    // do not allow clear selection
    this.overview.selectAll('.overlay').remove();

    // add event to resizing handle to allow change time on resize
    this.overview.selectAll('.handle')
      .attr('stroke', 'none')
      .on('mousedown', () => this.mousedownBrush = true);
  }

  /**
   * Function that calculates and returns the x diagram coordinate for the brush range
   * for the overview diagram by the selected time interval of the main diagram.
   * Calculate to get brush extent when main diagram time interval changes.
   */
  private getXDomainByTimestamp(timespan: Timespan, width: number): [number, number] {
    /**
     * calculate range of brush with timestamp and not diagram coordinates
     * formula:
     * brush_min =
     * (overview_width / (overview_max - overview_min)) * (brush_min - overview_min)
     * brus_max =
     * (overview_width / (overview_max - overview_min)) * (brush_max - overview_min)
     */

    const minOverviewTimeInterval = timespan.from;
    const maxOverviewTimeInterval = timespan.to;
    const minDiagramTimestamp = this.mainTimeInterval.from;
    const maxDiagramTimestamp = this.mainTimeInterval.to;

    const diffOverviewTimeInterval = maxOverviewTimeInterval - minOverviewTimeInterval;
    const divOverviewTimeWidth = width / diffOverviewTimeInterval;
    const minCalcBrush: number = divOverviewTimeWidth * (minDiagramTimestamp - minOverviewTimeInterval);
    const maxCalcBrush: number = divOverviewTimeWidth * (maxDiagramTimestamp - minOverviewTimeInterval);

    return [minCalcBrush, maxCalcBrush];
  }

  /**
   * Function that calculates and returns the timestamp for the main diagram calculated
   * by the selected coordinate of the brush range.
   * @param minCalcBrush {Number} Number with the minimum coordinate of the selected brush range.
   * @param maxCalcBrush {Number} Number with the maximum coordinate of the selected brush range.
   */
  private getTimestampByCoord(minCalcBrush: number, maxCalcBrush: number, timespan: Timespan, width: number): [number, number] {
    /**
     * calculate range of brush with timestamp and not diagram coordinates
     * formula:
     * minDiagramTimestamp =
     * ((minCalcBrush / overview_width) * (overview_max - overview_min)) + overview_min
     * maxDiagramTimestamp =
     * ((maxCalcBrush / overview_width) * (overview_max - overview_min)) + overview_min
     */

    const minOverviewTimeInterval = timespan.from;
    const maxOverviewTimeInterval = timespan.to;

    const diffOverviewTimeInterval = maxOverviewTimeInterval - minOverviewTimeInterval;
    const minDiagramTimestamp: number = ((minCalcBrush / width) * diffOverviewTimeInterval) + minOverviewTimeInterval;
    const maxDiagramTimestamp: number = ((maxCalcBrush / width) * diffOverviewTimeInterval) + minOverviewTimeInterval;

    return [minDiagramTimestamp, maxDiagramTimestamp];
  }

}
