import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Timespan } from '@helgoland/core';

import { InternalDataEntry } from '../../../model/d3-general';
import { D3Copyright } from '../../../model/d3-plot-options';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';

@Component({
  selector: 'n52-d3-graph-copyright',
  template: '',
  styleUrls: ['./d3-graph-copyright.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3GraphCopyrightComponent extends D3TimeseriesGraphControl {

  /**
   * Copyright, which should be shown on the graph
   */
  @Input() copyright: D3Copyright;

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ): void {
    if (this.copyright) {
      let backgroundDim = this.graphHelper.getDimensions(background.node());
      let x = 0;
      let y = 3;
      const copyright = graph.append('g');
      let copyrightLabel = copyright.append('svg:text')
        .text(this.copyright.label)
        .attr('class', 'copyright')
        .style('pointer-events', 'none');
      if (this.copyright.positionX === 'right') {
        x = backgroundDim.w - graphExtent.margin.right - this.graphHelper.getDimensions(copyrightLabel.node()).w;
      }
      if (this.copyright.positionY === 'bottom') {
        y = backgroundDim.h - graphExtent.margin.top * 2;
      }
      let yTransform = y + this.graphHelper.getDimensions(copyrightLabel.node()).h - 3;
      let xTransform = graphExtent.leftOffset + x;
      copyrightLabel
        .attr('transform', 'translate(' + xTransform + ', ' + yTransform + ')');
      copyright.append('svg:rect')
        .attr('class', 'copyright')
        .style('fill', 'none')
        .style('stroke', 'none')
        .style('pointer-events', 'none')
        .attr('width', this.graphHelper.getDimensions(copyrightLabel.node()).w)
        .attr('height', this.graphHelper.getDimensions(copyrightLabel.node()).h)
        .attr('transform', 'translate(' + xTransform + ', ' + y + ')');
    }
  }
}
