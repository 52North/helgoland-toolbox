import 'moment-timezone';

import { Injectable } from '@angular/core';
import { HelgolandTimeseries } from '@helgoland/core';
import * as d3 from 'd3';
import moment from 'moment';

import { DataEntry, InternalDataEntry } from '../../model/d3-general';
import { D3GraphHelperService } from './../d3-graph-helper.service';
import { D3HoveringService } from './d3-hovering-service';

@Injectable()
export class D3SimpleHoveringService extends D3HoveringService {

  protected highlightRect: d3.Selection<SVGGElement, any, any, any>;
  protected highlightText: d3.Selection<SVGGElement, any, any, any>;
  protected graphHelper: D3GraphHelperService = new D3GraphHelperService();

  protected addLineWidth = 2; // value added to linewidth

  public initPointHovering(elem: d3.Selection<SVGGElement, any, any, any>) {
    this.highlightRect = elem.append('svg:rect');
    this.highlightText = elem.append('g');
  }

  public hidePointHovering(d: DataEntry, entry: InternalDataEntry) {
    if (this.highlightRect) { this.highlightRect.style('visibility', 'hidden'); }
    if (this.highlightText) { this.highlightText.selectAll('*').remove(); }
    // unhighlight hovered dot
    d3.select('#dot-' + d.timestamp + '-' + entry.id)
      .attr('opacity', 1)
      .attr('r', this.calculatePointRadius(entry));
  }

  public showPointHovering(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries) {
    if (this.highlightRect) { this.highlightRect.style('visibility', 'visible'); }
    if (this.highlightText) { this.highlightText.style('visibility', 'visible'); }

    // highlight hovered dot
    d3.select('#dot-' + d.timestamp + '-' + entry.id)
      .attr('opacity', 0.8)
      .attr('r', this.calculatePointRadius(entry) + 3);

    this.setHoveringLabel(d, entry, timeseries);
  }

  public positioningPointHovering(x: number, y: number, color: string, background: any) {
    let onLeftSide = this.leftSidedTooltip(background, x);
    let rectX: number = x + 15; // offset for right-side tooltip
    let rectY: number = y;
    let rectW: number = this.graphHelper.getDimensions(this.highlightText.node()).w;
    let rectH: number = this.graphHelper.getDimensions(this.highlightText.node()).h;
    if (!onLeftSide) {
      rectX = x - rectW - 10;
      rectY = y;
    }
    if ((y + rectH + 4) > background.node().getBBox().height) {
      rectY = rectY - rectH;
    }
    // create hovering label
    this.highlightRect
      .attr('class', 'mouseHoverDotRect')
      .style('fill', 'white')
      .style('fill-opacity', 1)
      .style('stroke', color)
      .style('stroke-width', '1px')
      .style('pointer-events', 'none')
      .attr('width', rectW)
      .attr('height', rectH)
      .attr('transform', 'translate(' + rectX + ', ' + rectY + ')');
    let labelX: number = x + 4 + 15;
    let labelY: number = y + 13;
    if (!onLeftSide) {
      labelX = x - rectW + 4 - 15;
    }
    if ((y + rectH + 4) > background.node().getBBox().height) {
      labelY = labelY - rectH;
    }
    this.highlightText.attr('transform', 'translate(' + rectX + ', ' + labelY + ')');
    // this.lastHoverPositioning = new Date().getTime();
  }

  protected leftSidedTooltip(background: any, x: number) {
    return (background.node().getBBox().width) / 2 > x;
  }

  protected setHoveringLabel(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries) {
    let stringedValue = (typeof d.value === 'number') ? parseFloat(d.value.toPrecision(15)).toString() : d.value;
    this.highlightText.append('text')
      .text(`${stringedValue} ${entry.axisOptions.uom} ${moment.tz(d.timestamp, moment.tz.guess()).format('DD.MM.YY HH:mm zz')}`)
      .attr('class', 'mouseHoverDotLabel')
      .style('pointer-events', 'none')
      .style('fill', 'black');
    // TODO: multi line tooltip
    // this.highlightText.append('text').attr('dy', '1em').text('line 2');
    // this.highlightText.append('text').attr('dy', '1em').text('line 3');
  }

  protected calculatePointRadius(entry: InternalDataEntry) {
    if (entry.selected) {
      return entry.options.pointRadius > 0 ? entry.options.pointRadius + this.addLineWidth : entry.options.pointRadius;
    } else {
      return entry.options.pointRadius;
    }
  }

}
