import {
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { BaseType } from 'd3';

import { D3GraphInterface } from '../../d3-graph.interface';
import {
  AdjustBackgroundOptions,
  D3GraphExtent,
  D3GraphObserver,
  D3SeriesGraphControl,
} from '../../d3-series-graph-control';
import { D3Copyright } from '../../models/d3-plot-options';

@Component({
  selector: 'n52-d3-graph-copyright',
  template: '',
  styleUrls: ['./d3-graph-copyright.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class D3GraphCopyrightComponent
  extends D3SeriesGraphControl
  implements OnChanges, OnDestroy, D3GraphObserver
{
  /**
   * Copyright, which should be shown on the graph
   */
  readonly copyright = input<D3Copyright>();

  protected d3Graph: D3GraphInterface | undefined;
  protected copyrightLayer:
    | d3.Selection<SVGGElement, any, any, any>
    | undefined;

  protected labelRect: d3.Selection<BaseType, any, any, any> | undefined;
  protected labelText: d3.Selection<BaseType, any, any, any> | undefined;
  protected background: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected graphExtent: D3GraphExtent | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['copyright'] && this.copyright()) {
      this.setText();
    }
  }

  graphInitialized(graph: D3GraphInterface) {
    this.d3Graph = graph;
  }

  adjustBackground(options: AdjustBackgroundOptions) {
    this.background = options.background;
    this.graphExtent = options.graphExtent;
    if (this.copyright() && this.d3Graph) {
      this.clearLayer();
      this.copyrightLayer = this.d3Graph.getDrawingLayer('copyright', true);
      this.createLabelRect();
      this.createLabelText();
      this.setText();
    }
  }

  override cleanUp() {
    this.clearLayer();
  }

  protected clearLayer() {
    if (this.copyrightLayer) {
      this.copyrightLayer.remove();
      this.copyrightLayer = undefined;
    }
  }

  protected createLabelText() {
    if (this.copyrightLayer) {
      const copyright = this.copyright();
      if (copyright?.link) {
        this.labelText = this.copyrightLayer
          .append('a')
          .attr('href', copyright.link)
          .attr('target', '_blank')
          .attr('rel', 'noopener noreferrer')
          .append('svg:text')
          .attr('class', 'copyright-text')
          .style('pointer-events', 'all');
      } else {
        this.labelText = this.copyrightLayer
          .append('svg:text')
          .attr('class', 'copyright-text')
          .style('pointer-events', 'none');
      }
    }
  }

  protected createLabelRect() {
    if (this.copyrightLayer) {
      this.labelRect = this.copyrightLayer
        .append('svg:rect')
        .attr('class', 'copyright-rect')
        .style('fill', 'none')
        .style('stroke', 'none')
        .style('pointer-events', 'none');
    }
  }

  protected setText() {
    const copyright = this.copyright();
    if (
      this.background &&
      this.labelText &&
      copyright &&
      this.graphExtent &&
      this.labelRect
    ) {
      const backgroundDim = this.graphHelper.getDimensions(
        this.background.node(),
      );
      let x = 3;
      let y = 3;
      this.labelText.text(copyright.label);
      if (copyright.positionX === 'right') {
        x =
          backgroundDim.w -
          this.graphExtent.margin.right -
          this.graphHelper.getDimensions(this.labelText.node()).w;
      }
      if (copyright.positionY === 'bottom') {
        y = backgroundDim.h - this.graphExtent.margin.top * 2;
      }
      const yTransform =
        y + this.graphHelper.getDimensions(this.labelText.node()).h - 3;
      const xTransform = this.graphExtent.leftOffset + x;
      this.labelText.attr(
        'transform',
        'translate(' + xTransform + ', ' + yTransform + ')',
      );

      this.labelRect
        .attr('width', this.graphHelper.getDimensions(this.labelText.node()).w)
        .attr('height', this.graphHelper.getDimensions(this.labelText.node()).h)
        .attr('transform', 'translate(' + xTransform + ', ' + y + ')');
    }
  }
}
