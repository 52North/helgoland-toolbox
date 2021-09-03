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

  protected highlightRect: d3.Selection<SVGGElement, any, any, any>;
  protected highlightText: d3.Selection<SVGGElement, any, any, any>;
  protected graphHelper: D3GraphHelperService = new D3GraphHelperService(this.pointSymbolDrawer);

  protected addLineWidth = 2; // value added to linewidth

  protected anchorElem: d3.Selection<SVGGElement, any, any, any>;
  protected tooltipContainer: d3.Selection<d3.BaseType, any, any, any>;

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
    if (!entry.options.pointSymbol) {
      pointElem
        .attr('opacity', 1)
        .attr('r', this.calculatePointRadius(entry));
    } else {
      this.pointSymbolDrawer.hideHovering(pointElem);
    }
  }

  public showPointHovering(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries, pointElem: d3.Selection<d3.BaseType, any, any, any>) {
    this.tooltipContainer = this.anchorElem.append('g');
    this.highlightRect = this.tooltipContainer.append('svg:rect');
    this.highlightText = this.tooltipContainer.append('g');

    // highlight hovered dot
    if (!entry.options.pointSymbol) {
      pointElem.attr('opacity', 1).attr('r', this.calculatePointRadius(entry) + 3);
    } else {
      this.pointSymbolDrawer.showHovering(pointElem);
    }

    this.setHoveringLabel(d, entry, timeseries);
  }

  public positioningPointHovering(x: number, y: number, color: string, background: any) {
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

  public showTooltip(elements: HoveringElement[], position: HoverPosition) {
    this.createTooltipContainer();
    this.positionTooltipContainer(position.x, position.y);

    const onLeftSide = this.leftSidedTooltip(position.background, position.x);

    let itemCounter = 0;
    elements.forEach(elem => {
      const rect = this.tooltipContainer.append('svg:rect')
      rect.attr('class', 'mouseHoverDotRect')
        .style('fill', 'white')
        .style('fill-opacity', 1)
        .style('stroke', elem.entry.options.color)
        .style('stroke-width', '1px')
        .style('pointer-events', 'none')
      const stringedValue = (typeof elem.dataEntry.value === 'number') ? parseFloat(elem.dataEntry.value.toPrecision(15)).toString() : elem.dataEntry.value;
      const text = this.tooltipContainer.append('text')
        .text(`${stringedValue} ${elem.entry.axisOptions.uom} ${this.timezoneSrvc.formatTzDate(elem.dataEntry.timestamp)}`)
        .attr('class', 'mouseHoverDotLabel')
        .style('pointer-events', 'none')
        .style('fill', 'black')
      this.positionTooltip(text, rect, onLeftSide, itemCounter);
      itemCounter++;
    })
  }

  protected positionTooltip(text: d3.Selection<SVGGElement, any, any, any>, rect: d3.Selection<d3.BaseType, any, any, any>, onLeftSide: boolean, itemCounter: number) {
    // padding to mouseposition
    const textPadding = 15;
    const rectPadding = 2;
    const rectW: number = this.graphHelper.getDimensions(text.node()).w;
    const rectH: number = this.graphHelper.getDimensions(text.node()).h;
    // positioning text
    const textX = onLeftSide ? 0 + textPadding : -rectW - textPadding;
    const textY = rectH + (itemCounter * (rectH + 4)) + (itemCounter * rectPadding * 2);
    text.attr('transform', `translate(${textX}, ${textY + rectPadding})`);
    // positioning rect
    const rectX = textX - rectPadding;
    const rectY = textY - rectH + 4;
    rect.attr('width', rectW + 2 * rectPadding)
      .attr('height', rectH + 2 * rectPadding)
      .attr('transform', `translate(${rectX}, ${rectY})`);
  }

  public removeTooltip() {
    if (this.tooltipContainer) {
      this.tooltipContainer.remove();
    }
  }

  protected createTooltipContainer() {
    this.tooltipContainer = this.anchorElem.append('g');
  }

  protected positionTooltipContainer(x: number, y: number) {
    this.tooltipContainer.attr('transform', 'translate(' + x + ', ' + y + ')');
  }

  protected leftSidedTooltip(background: any, x: number) {
    return (background.node().getBBox().width) / 2 > x;
  }

  protected setHoveringLabel(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries) {
    const stringedValue = (typeof d.value === 'number') ? parseFloat(d.value.toPrecision(15)).toString() : d.value;
    this.highlightText.append('text')
      .text(`${stringedValue} ${entry.axisOptions.uom} ${this.timezoneSrvc.formatTzDate(d.timestamp)}`)
      .attr('class', 'mouseHoverDotLabel')
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
