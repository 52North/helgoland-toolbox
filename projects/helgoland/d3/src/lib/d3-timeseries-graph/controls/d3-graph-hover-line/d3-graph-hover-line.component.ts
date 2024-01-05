import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { DataEntry, InternalDataEntry } from '../../../model/d3-general';
import {
  D3GraphExtent,
  D3TimeseriesGraphControl,
} from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphInterface } from './../../d3-timeseries-graph.interface';

export interface HoverlineLabel {
  text: d3.Selection<SVGGElement, any, any, any>;
  rect: d3.Selection<d3.BaseType, any, any, any>;
}

const HOVERLINE_CLASS = 'hover-line';
const TIME_LABEL_CLASS = 'time-label';

@Component({
  selector: 'n52-d3-graph-hover-line',
  template: '',
  styleUrls: ['./d3-graph-hover-line.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class D3GraphHoverLineComponent extends D3TimeseriesGraphControl {
  @Input() showLabels = true;

  @Input() showTimelLabel = true;

  protected d3Graph: D3TimeseriesGraphInterface | undefined;
  protected background: d3.Selection<SVGSVGElement, any, any, any> | undefined;
  protected graphExtent: D3GraphExtent | undefined;
  protected disableHovering: boolean = false;
  protected lastDraw = new Date().getTime();
  protected drawLatency = 20;
  protected preparedData: InternalDataEntry[] | undefined;

  protected labels: Map<string, HoverlineLabel> = new Map();
  protected drawLayer: d3.Selection<SVGGElement, any, any, any> | undefined;

  constructor(
    protected override graphId: D3GraphId,
    protected override graphs: D3Graphs,
    protected override graphHelper: D3GraphHelperService,
    protected timezoneSrvc: TimezoneService,
  ) {
    super(graphId, graphs, graphHelper);
  }

  public graphInitialized(graph: D3TimeseriesGraphInterface) {
    this.d3Graph = graph;
    this.d3Graph.redrawCompleteGraph();
  }

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan,
  ) {
    if (!this.drawLayer && this.d3Graph) {
      this.drawLayer = this.d3Graph.getDrawingLayer('hovering-line-layer');
    }
    this.createHoverLine();
    this.labels.clear();
    this.background = background;
    this.graphExtent = graphExtent;
    this.preparedData = preparedData;
  }

  public override cleanUp() {
    if (this.drawLayer) {
      this.drawLayer.remove();
      this.drawLayer = undefined;
    }
  }

  public mousemoveBackground(event: MouseEvent) {
    if (!this.disableHovering) {
      this.moveHoverLineIndicator(event);
      this.showHoverLineIndicator();
    }
  }

  public mouseoutBackground(event: MouseEvent) {
    if (!this.disableHovering) {
      this.hideHoverLineIndicator();
      this.hideLabels();
    }
  }

  public dragStartBackground() {
    this.hideHoverLineIndicator();
    this.hideLabels();
    this.disableHovering = true;
  }

  public zoomStartBackground() {
    this.hideHoverLineIndicator();
    this.hideLabels();
    this.disableHovering = true;
  }

  public dragEndBackground() {
    this.disableHovering = false;
  }

  public zoomEndBackground() {
    this.disableHovering = false;
  }

  protected createHoverLine() {
    if (this.drawLayer) {
      if (this.drawLayer.select(`.${HOVERLINE_CLASS}`).empty()) {
        this.drawLayer
          .append('path')
          .attr('class', HOVERLINE_CLASS)
          .style('opacity', '0');
      }

      if (this.drawLayer.select(`.${TIME_LABEL_CLASS}`).empty()) {
        this.drawLayer
          .append('svg:text')
          .attr('class', `${TIME_LABEL_CLASS}`)
          .style('pointer-events', 'none');
      }
    }
  }

  protected hideHoverLineIndicator(): void {
    if (this.drawLayer) {
      this.drawLayer.select(`.${HOVERLINE_CLASS}`).style('opacity', '0');
      this.drawLayer.select(`.${TIME_LABEL_CLASS}`).style('opacity', '0');
    }
  }

  protected hideLabels() {
    this.labels.forEach((e) => {
      e.rect.style('opacity', '0');
      e.text.style('opacity', '0');
    });
  }

  protected showHoverLineIndicator(): void {
    if (this.drawLayer) {
      this.drawLayer.select(`.${HOVERLINE_CLASS}`).style('opacity', '1');
      this.drawLayer.select(`.${TIME_LABEL_CLASS}`).style('opacity', '1');
    }
  }

  protected moveHoverLineIndicator(event: MouseEvent): void {
    if (this.background && this.preparedData && this.graphExtent) {
      const time = new Date().getTime();
      if (this.lastDraw + this.drawLatency < time) {
        const mouse = d3.pointer(event);
        this.drawLineIndicator(mouse);
        if (this.showLabels) {
          this.preparedData.forEach((entry, entryIdx) => {
            const idx = this.getItemForX(
              mouse[0] + this.graphExtent!.leftOffset,
              entry.data,
            );
            if (idx) this.showLabel(entry, idx, mouse[0], entryIdx);
          });
        }
        this.lastDraw = time;
      }
    }
  }

  protected drawLineIndicator(mouse: [number, number]) {
    if (this.drawLayer && this.graphExtent) {
      const xPos = mouse[0] + this.graphExtent.leftOffset;

      this.drawLayer
        .select(`.${HOVERLINE_CLASS}`)
        .attr(
          'd',
          () =>
            'M' + xPos + ',' + this.graphExtent!.height + ' ' + xPos + ',' + 0,
        );

      this.drawTimeLabel(xPos);
    }
  }

  protected drawTimeLabel(xPos: number) {
    if (this.drawLayer && this.showTimelLabel && this.graphExtent) {
      const time = this.graphExtent.xScale.invert(xPos);

      // draw label
      this.drawLayer
        .select(`.${TIME_LABEL_CLASS}`)
        .text(this.timezoneSrvc.formatTzDate(time));
      const onLeftSide = this.checkLeftSide(xPos);
      const right = xPos + 2;
      const left =
        xPos -
        this.graphHelper.getDimensions(
          this.drawLayer.select(`.${TIME_LABEL_CLASS}`).node(),
        ).w -
        2;
      this.drawLayer
        .select(`.${TIME_LABEL_CLASS}`)
        .attr('x', onLeftSide ? right : left)
        .attr('y', 15);
    }
  }

  protected getItemForX(xCoord: number, data: DataEntry[]): number | undefined {
    const PixelBuffer = 5;
    const time = this.graphExtent?.xScale.invert(xCoord);
    const idx = d3.bisector((d: DataEntry) => d.timestamp).left(data, time);
    const distIdx = this.calcDist(data[idx], xCoord);
    if (idx > 0) {
      const distPrev = this.calcDist(data[idx - 1], xCoord);
      if (distPrev < distIdx) {
        if (distPrev <= PixelBuffer) {
          return idx - 1;
        }
      }
    }
    if (distIdx <= PixelBuffer) {
      return idx;
    }
    return undefined;
  }

  protected calcDist(entry: DataEntry, x: number) {
    const scale = this.graphExtent?.xScale(entry.timestamp);
    return entry && scale ? Math.abs(scale - x) : Infinity;
  }

  protected showLabel(
    entry: InternalDataEntry,
    idx: number,
    xCoordMouse: number,
    entryIdx: number,
  ) {
    const item: DataEntry = entry.data[idx];

    if (!this.labels.has(entry.internalId)) {
      this.createLabel(entry);
    }
    const label = this.labels.get(entry.internalId);
    if (label) {
      if (item !== undefined && item.yDiagCoord && item.value !== undefined) {
        this.setLabel(label, item, entry);
        this.positionLabel(label, item);
        this.displayLabel(label, true);
      } else {
        this.displayLabel(label, false);
      }
    }
  }

  /**
   * Function to change visibility of label and white rectangle inside graph (next to mouse-cursor line).
   * @param entry {DataEntry} Object containing the dataset.
   * @param visible {Boolean} Boolean giving information about visibility of a label.
   */
  protected displayLabel(label: HoverlineLabel, visible: boolean): void {
    if (visible) {
      label.text.style('opacity', '1');
      label.rect.style('opacity', '1');
    } else {
      label.text.style('opacity', '0');
      label.rect.style('opacity', '0');
    }
  }

  protected createLabel(entry: InternalDataEntry) {
    const label = this.createLineHoveringLabel(entry);
    if (label) {
      this.labels.set(entry.internalId, label);
    }
  }

  protected createLineHoveringLabel(
    entry: InternalDataEntry,
  ): HoverlineLabel | undefined {
    if (this.drawLayer) {
      const rect = this.drawLayer
        .append('svg:rect')
        .attr('class', 'hoverline-label-rect')
        .style('fill', 'white')
        .style('stroke', entry.options.color)
        .style('stroke-width', '1px')
        .style('pointer-events', 'none');
      const text = this.drawLayer.append('g');
      return { rect, text };
    }
    return undefined;
  }

  /**
   * Function to show the labeling inside the graph.
   * @param entry {DataEntry} Object containg the dataset.
   * @param item {DataEntry} Object of the entry in the dataset.
   */
  protected positionLabel(label: HoverlineLabel, item: DataEntry): void {
    const padding = 2;
    const entryX: number = this.checkLeftSide(item.xDiagCoord!)
      ? item.xDiagCoord! + 4
      : item.xDiagCoord! -
        this.graphHelper.getDimensions(label.text.node()).w -
        4;
    label.text.attr(
      'transform',
      `translate(${entryX + padding}, ${item.yDiagCoord! + padding})`,
    );
    label.rect
      .attr('x', entryX)
      .attr('y', item.yDiagCoord!)
      .attr(
        'width',
        this.graphHelper.getDimensions(label.text.node()).w + padding * 2,
      )
      .attr(
        'height',
        this.graphHelper.getDimensions(label.text.node()).h + padding * 2,
      );
  }

  protected setLabel(
    label: HoverlineLabel,
    item: DataEntry,
    entry: InternalDataEntry,
  ) {
    label.text.selectAll('*').remove();
    label.text
      .append('text')
      .text(
        `${item.value} ${entry.axisOptions.uom ? entry.axisOptions.uom : ''}`,
      )
      .attr('alignment-baseline', 'text-before-edge')
      .attr('class', 'hoverline-label-text');
  }

  /**
   * Function giving information if the mouse is on left side of the diagram.
   * @param itemCoord {number} x coordinate of the value (e.g. mouse) to be checked
   */
  protected checkLeftSide(itemCoord: number): boolean {
    const background = this.background?.node();
    if (background && this.graphExtent)
      return (
        (background.getBBox().width + this.graphExtent.leftOffset) / 2 >
        itemCoord
      );
    return false;
  }
}
