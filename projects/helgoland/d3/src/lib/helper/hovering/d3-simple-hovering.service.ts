import 'moment-timezone';

import { Injectable } from '@angular/core';
import { HelgolandTimeseries, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';

import { DataEntry, InternalDataEntry } from '../../model/d3-general';
import { D3PointSymbolDrawerService } from '../d3-point-symbol-drawer.service';
import { D3GraphHelperService } from './../d3-graph-helper.service';
import { D3HoveringService, HoveringElement, HoverPosition } from './d3-hovering-service';

@Injectable()
export class D3SimpleHoveringService extends D3HoveringService {

  protected highlightRect: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected highlightText: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected graphHelper: D3GraphHelperService = new D3GraphHelperService(this.pointSymbolDrawer);

  protected addLineWidth = 2; // value added to linewidth

  protected anchorElem: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected tooltipContainer: d3.Selection<SVGGElement, any, any, any> | undefined;

  constructor(
    protected timezoneSrvc: TimezoneService,
    protected pointSymbolDrawer: D3PointSymbolDrawerService
  ) {
    super();
  }

  public initPointHovering(elem: d3.Selection<SVGGElement, any, any, any>) {
    this.anchorElem = elem;
  }

  public hidePointHovering(d: DataEntry, entry: InternalDataEntry, pointElem: d3.Selection<d3.BaseType, any, any, any>) {
    this.removeTooltip();
    // unhighlight hovered dot
    if (!entry.options.pointSymbol || entry.options.type === 'bar') {
      pointElem
        .attr('opacity', 1)
        .attr('r', this.calculatePointRadius(entry));
    } else {
      this.pointSymbolDrawer.hideHovering(pointElem);
    }
  }

  public showPointHovering(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries, pointElem: d3.Selection<d3.BaseType, any, any, any>) {
    if (this.anchorElem) {
      this.tooltipContainer = this.anchorElem.append('g');
      this.highlightRect = this.tooltipContainer.append('svg:rect');
      this.highlightText = this.tooltipContainer.append('g');

      // highlight hovered dot
      if (!entry.options.pointSymbol || entry.options.type === 'bar') {
        pointElem.attr('opacity', 1).attr('r', this.calculatePointRadius(entry) + 3);
      } else {
        this.pointSymbolDrawer.showHovering(pointElem);
      }

      this.setHoveringLabel(this.highlightText, d, entry, timeseries);
    }
  }

  public positioningPointHovering(x: number, y: number, color: string, background: any) {
    if (this.highlightText && this.highlightRect) {
      this.highlightRect
        .attr('class', 'mouseHoverDotRect')
        .style('fill', 'white')
        .style('fill-opacity', 1)
        .style('stroke', color)
        .style('stroke-width', '1px')
        .style('pointer-events', 'none')
      this.positionTooltipContainer(x, y);
      this.positionTooltip(this.highlightText, this.highlightRect, this.leftSidedTooltip(background, x), 0);
    }
  }

  public showTooltip(elements: HoveringElement[], position: HoverPosition) {
    if (this.anchorElem) {
      this.tooltipContainer = this.anchorElem.append('g');
      this.positionTooltipContainer(position.x, position.y);
  
      const onLeftSide = this.leftSidedTooltip(position.background, position.x);
  
      let itemCounter = 0;
      elements.forEach(elem => {
        const rect: d3.Selection<SVGGElement, any, any, any> = this.tooltipContainer!.append('svg:rect')
        rect.attr('class', 'mouseHoverDotRect')
          .style('fill', 'white')
          .style('fill-opacity', 1)
          .style('stroke', elem.entry.options.color)
          .style('stroke-width', '1px')
          .style('pointer-events', 'none')
        const textContainer = this.tooltipContainer!.append('g');
        this.setHoveringLabel(textContainer, elem.dataEntry, elem.entry, elem.timeseries);
        this.positionTooltip(textContainer, rect, onLeftSide, itemCounter);
        itemCounter++;
      })
    }
  }

  protected positionTooltip(text: d3.Selection<SVGGElement, any, any, any>, rect: d3.Selection<SVGGElement, any, any, any>, onLeftSide: boolean, itemCounter: number) {
    // padding to mouseposition
    const textPadding = 15;
    const rectPadding = 2;
    const rectW: number = this.graphHelper.getDimensions(text.node()).w;
    const rectH: number = this.graphHelper.getDimensions(text.node()).h;
    // positioning text
    const textX = onLeftSide ? 0 + textPadding : -rectW - textPadding;
    const textY = rectPadding;
    text.attr('transform', `translate(${textX}, ${textY})`);
    // positioning rect
    const rectX = textX - rectPadding;
    const rectY = 0;
    rect.attr('width', rectW + 2 * rectPadding)
      .attr('height', rectH + 2 * rectPadding)
      .attr('transform', `translate(${rectX}, ${rectY})`);
  }

  public removeTooltip() {
    if (this.tooltipContainer) {
      this.tooltipContainer.remove();
    }
  }

  protected positionTooltipContainer(x: number, y: number) {
    this.tooltipContainer?.attr('transform', 'translate(' + x + ', ' + y + ')');
  }

  protected leftSidedTooltip(background: any, x: number) {
    return (background.node().getBBox().width) / 2 > x;
  }

  protected setHoveringLabel(textContainer: d3.Selection<SVGGElement, any, any, any>, d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries) {
    const stringedValue = (typeof d.value === 'number') ? parseFloat(d.value.toPrecision(15)).toString() : d.value;
    textContainer.append('text')
      .text(`${stringedValue} ${entry.axisOptions.uom} ${this.timezoneSrvc.formatTzDate(d.timestamp)}`)
      .attr('class', 'mouseHoverDotLabel')
      .attr('alignment-baseline', 'text-before-edge')
      .style('pointer-events', 'none')
      .style('fill', 'black');
  }

  protected calculatePointRadius(entry: InternalDataEntry) {
    if (entry.selected) {
      return entry.options.pointRadius > 0 ? entry.options.pointRadius + this.addLineWidth : entry.options.pointRadius;
    } else {
      return entry.options.pointRadius;
    }
  }

}
