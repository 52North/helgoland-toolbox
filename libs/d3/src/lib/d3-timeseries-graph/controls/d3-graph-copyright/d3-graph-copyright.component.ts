import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Timespan } from '@helgoland/core';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { InternalDataEntry } from '../../../model/d3-general';
import { D3Copyright } from '../../../model/d3-plot-options';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';
import { BaseType } from 'd3';

@Component({
  selector: 'n52-d3-graph-copyright',
  template: '',
  styleUrls: ['./d3-graph-copyright.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3GraphCopyrightComponent extends D3TimeseriesGraphControl implements OnChanges {

  /**
   * Copyright, which should be shown on the graph
   */
  @Input() copyright: D3Copyright;

  private d3Graph: D3TimeseriesGraphComponent;
  private copyrightLayer: d3.Selection<SVGGElement, any, any, any>;

  private labelRect: d3.Selection<BaseType, any, any, any>;
  private labelText: d3.Selection<BaseType, any, any, any>;
  private background: d3.Selection<SVGSVGElement, any, any, any>;
  private graphExtent: D3GraphExtent;

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService
  ) {
    super(graphId, graphs, graphHelper);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.copyright && this.copyright) {
      this.setText();
    }
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
  ): void {
    this.background = background;
    this.graphExtent = graphExtent;
    if (this.copyright) {
      if (!this.copyrightLayer) {
        this.copyrightLayer = this.d3Graph.getDrawingLayer('copyright');
        this.createLabelRect();
        this.createLabelText();
        this.setText();
      }
    }
  }

  private createLabelText() {
    if (this.copyright.link) {
      this.labelText = this.copyrightLayer.append('a')
        .attr('href', this.copyright.link)
        .attr('target', '_blank')
        .attr('rel', 'noopener noreferrer')
        .append('svg:text')
        .attr('class', 'copyright-text')
        .style('pointer-events', 'all');
    } else {
      this.labelText = this.copyrightLayer.append('svg:text')
        .attr('class', 'copyright-text')
        .style('pointer-events', 'none');
    }
  }

  private createLabelRect() {
    this.labelRect = this.copyrightLayer.append('svg:rect')
      .attr('class', 'copyright-rect')
      .style('fill', 'none')
      .style('stroke', 'none')
      .style('pointer-events', 'none');
  }

  private setText() {
    if (this.copyrightLayer) {
      const backgroundDim = this.graphHelper.getDimensions(this.background.node());
      let x = 3;
      let y = 3;
      this.labelText.text(this.copyright.label);
      if (this.copyright.positionX === 'right') {
        x = backgroundDim.w - this.graphExtent.margin.right - this.graphHelper.getDimensions(this.labelText.node()).w;
      }
      if (this.copyright.positionY === 'bottom') {
        y = backgroundDim.h - this.graphExtent.margin.top * 2;
      }
      const yTransform = y + this.graphHelper.getDimensions(this.labelText.node()).h - 3;
      const xTransform = this.graphExtent.leftOffset + x;
      this.labelText
        .attr('transform', 'translate(' + xTransform + ', ' + yTransform + ')');

      this.labelRect.attr('width', this.graphHelper.getDimensions(this.labelText.node()).w)
        .attr('height', this.graphHelper.getDimensions(this.labelText.node()).h)
        .attr('transform', 'translate(' + xTransform + ', ' + y + ')');
    }
  }
}
