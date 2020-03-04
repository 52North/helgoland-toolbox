import { Component, ViewEncapsulation } from '@angular/core';
import { Timespan } from '@helgoland/core';
import * as d3 from 'd3';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { InternalDataEntry } from '../../../model/d3-general';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';

@Component({
  selector: 'n52-d3-graph-hover-line',
  template: '',
  styleUrls: ['./d3-graph-hover-line.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3GraphHoverLineComponent extends D3TimeseriesGraphControl {

  private d3Graph: D3TimeseriesGraphComponent;
  private background: d3.Selection<SVGSVGElement, any, any, any>;
  private graphExtent: D3GraphExtent;
  private disableHovering: boolean;

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService
  ) {
    super(graphId, graphs, graphHelper);
  }

  public graphInitialized(graph: D3TimeseriesGraphComponent) {
    this.d3Graph = graph;
  }

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ) {
    this.createHoverLine(graph);
    this.background = background;
    this.graphExtent = graphExtent;
  }

  public mousemoveBackground() {
    if (!this.disableHovering) {
      this.moveHoverLineIndicator();
    }
  }

  public mouseoverBackground() {
    if (!this.disableHovering) {
      this.showHoverLineIndicator();
    }
  }

  public mouseoutBackground() {
    if (!this.disableHovering) {
      this.hideHoverLineIndicator();
    }
  }

  public dragStartBackground() {
    this.hideHoverLineIndicator();
    this.disableHovering = true;
  }

  public zoomStartBackground() {
    this.hideHoverLineIndicator();
    this.disableHovering = true;
  }

  public dragEndBackground() {
    this.disableHovering = false;
  }

  public zoomEndBackground() {
    this.disableHovering = false;
  }

  private createHoverLine(graph: d3.Selection<SVGSVGElement, any, any, any>) {
    let layer = d3.selectAll('#hovering-line-layer');
    if (layer.empty()) {
      layer = this.d3Graph.getDrawingLayer();
      layer.attr('id', 'hovering-line-layer');
      layer.append('path')
        .attr('class', 'hovering-line')
        .style('opacity', '0');
    }
  }

  private hideHoverLineIndicator(): void {
    d3.select('.hovering-line')
      .style('opacity', '0');
  }

  private showHoverLineIndicator(): void {
    d3.select('.hovering-line')
      .style('opacity', '1');
  }

  private moveHoverLineIndicator(): void {
    const mouse = d3.mouse(this.background.node());
    d3.selectAll('.hovering-line')
      .attr('d', () => 'M' + (mouse[0] + this.graphExtent.leftOffset) + ',' + this.graphExtent.height + ' ' + (mouse[0] + this.graphExtent.leftOffset) + ',' + 0);
  }
}


