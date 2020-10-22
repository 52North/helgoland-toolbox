import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { DataEntry, InternalDataEntry } from '../../../model/d3-general';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';

interface Label {
  text: d3.Selection<d3.BaseType, any, any, any>;
  rect: d3.Selection<d3.BaseType, any, any, any>;
}

const HOVERLINE_CLASS = 'hover-line';
const TIME_LABEL_CLASS = 'time-label';

@Component({
  selector: 'n52-d3-graph-hover-line',
  template: '',
  styleUrls: ['./d3-graph-hover-line.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3GraphHoverLineComponent extends D3TimeseriesGraphControl {

  @Input() showLabels = true;

  @Input() showTimelLabel = true;

  private d3Graph: D3TimeseriesGraphComponent;
  private background: d3.Selection<SVGSVGElement, any, any, any>;
  private graphExtent: D3GraphExtent;
  private disableHovering: boolean;
  private lastDraw = new Date().getTime();
  private drawLatency = 20;
  private preparedData: InternalDataEntry[];

  private labels: Map<string, Label> = new Map();
  private drawLayer: d3.Selection<SVGGElement, any, any, any>;

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService,
    protected timezoneSrvc: TimezoneService
  ) {
    super(graphId, graphs, graphHelper);
  }

  public graphInitialized(graph: D3TimeseriesGraphComponent) {
    this.d3Graph = graph;
    this.d3Graph.redrawCompleteGraph();
  }

  public adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ) {
    if (!this.drawLayer) {
      this.drawLayer = this.d3Graph.getDrawingLayer('hovering-line-layer');
    }
    this.createHoverLine();
    this.background = background;
    this.graphExtent = graphExtent;
    this.preparedData = preparedData;
  }

  public cleanUp() {
    if (this.drawLayer) {
      this.drawLayer.remove();
      this.drawLayer = null;
    }
  }

  public mousemoveBackground() {
    if (!this.disableHovering) {
      this.moveHoverLineIndicator();
      this.showHoverLineIndicator();
    }
  }

  public mouseoutBackground() {
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

  private createHoverLine() {
    if (this.drawLayer.select(`.${HOVERLINE_CLASS}`).empty()) {
      this.drawLayer.append('path')
        .attr('class', HOVERLINE_CLASS)
        .style('opacity', '0');
    }

    if (this.drawLayer.select(`.${TIME_LABEL_CLASS}`).empty()) {
      this.drawLayer.append('svg:text')
        .attr('class', `${TIME_LABEL_CLASS}`)
        .style('pointer-events', 'none');
    }

  }

  private hideHoverLineIndicator(): void {
    this.drawLayer.select(`.${HOVERLINE_CLASS}`).style('opacity', '0');
    this.drawLayer.select(`.${TIME_LABEL_CLASS}`).style('opacity', '0');
  }

  private hideLabels() {
    this.labels.forEach(e => {
      e.rect.style('opacity', '0');
      e.text.style('opacity', '0');
    });
  }

  private showHoverLineIndicator(): void {
    this.drawLayer.select(`.${HOVERLINE_CLASS}`).style('opacity', '1');
    this.drawLayer.select(`.${TIME_LABEL_CLASS}`).style('opacity', '1');
  }

  private moveHoverLineIndicator(): void {
    const time = new Date().getTime();
    if (this.lastDraw + this.drawLatency < time) {
      const mouse = d3.mouse(this.background.node());
      this.drawLineIndicator(mouse);
      if (this.showLabels) {
        this.preparedData.forEach((entry, entryIdx) => {
          const idx = this.getItemForX(mouse[0] + this.graphExtent.leftOffset, entry.data);
          this.showLabel(entry, idx, mouse[0], entryIdx);
        });
      }
      this.lastDraw = time;
    }
  }

  private drawLineIndicator(mouse: [number, number]) {
    const xPos = mouse[0] + this.graphExtent.leftOffset;

    this.drawLayer.select(`.${HOVERLINE_CLASS}`)
      .attr('d', () => 'M' + (xPos) + ',' + this.graphExtent.height + ' ' + (xPos) + ',' + 0);

    this.drawTimeLabel(xPos);
  }

  private drawTimeLabel(xPos: number) {
    if (this.showTimelLabel) {
      const time = this.graphExtent.xScale.invert(xPos);

      // draw label
      this.drawLayer.select(`.${TIME_LABEL_CLASS}`).text(this.timezoneSrvc.formatTzDate(time));
      const onLeftSide = this.checkLeftSide(xPos);
      const right = xPos + 2;
      const left = xPos - this.graphHelper.getDimensions(this.drawLayer.select(`.${TIME_LABEL_CLASS}`).node()).w - 2;
      this.drawLayer.select(`.${TIME_LABEL_CLASS}`)
        .attr('x', onLeftSide ? right : left)
        .attr('y', 13);
    }
  }

  private getItemForX(xCoord: number, data: DataEntry[]): number {
    const PixelBuffer = 5;
    const time = this.graphExtent.xScale.invert(xCoord);
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
  }

  private calcDist(entry: DataEntry, x: number) {
    return entry ? Math.abs(this.graphExtent.xScale(entry.timestamp) - x) : Infinity;
  }

  private showLabel(entry: InternalDataEntry, idx: number, xCoordMouse: number, entryIdx: number) {
    const item: DataEntry = entry.data[idx];

    if (!this.labels.has(entry.internalId)) {
      this.createLabel(entry);
    }
    const label = this.labels.get(entry.internalId);

    if (item !== undefined && item.yDiagCoord && item.value !== undefined) {
      this.positionLabel(entry, label, item);
      this.displayLabel(label, true);
    } else {
      this.displayLabel(label, false);
    }
  }

  /**
   * Function to change visibility of label and white rectangle inside graph (next to mouse-cursor line).
   * @param entry {DataEntry} Object containing the dataset.
   * @param visible {Boolean} Boolean giving information about visibility of a label.
   */
  private displayLabel(label: Label, visible: boolean): void {
    if (visible) {
      label.text.style('opacity', '1');
      label.rect.style('opacity', '1');
    } else {
      label.text.style('opacity', '0');
      label.rect.style('opacity', '0');
    }
  }

  private createLabel(entry: InternalDataEntry) {
    const rect = this.drawLayer.append('svg:rect')
      .attr('class', 'hoverline-label-rect')
      .style('fill', 'white')
      .style('stroke', 'none')
      .style('pointer-events', 'none');
    const text = this.drawLayer.append('svg:text')
      .attr('class', 'hoverline-label-text')
      .style('pointer-events', 'none')
      .style('fill', entry.options.color)
      .style('font-weight', 'lighter');
    this.labels.set(entry.internalId, { text, rect });
  }

  /**
   * Function to show the labeling inside the graph.
   * @param entry {DataEntry} Object containg the dataset.
   * @param item {DataEntry} Object of the entry in the dataset.
   */
  private positionLabel(entry: InternalDataEntry, label: Label, item: DataEntry): void {
    label.text.text(`${item.value} ${(entry.axisOptions.uom ? entry.axisOptions.uom : '')}`);

    const entryX: number = this.checkLeftSide(item.xDiagCoord) ?
      item.xDiagCoord + 4 : item.xDiagCoord - this.graphHelper.getDimensions(label.text.node()).w - 4;

    label.text
      .attr('x', entryX)
      .attr('y', item.yDiagCoord);
    label.rect
      .attr('x', entryX)
      .attr('y', item.yDiagCoord - this.graphHelper.getDimensions(label.rect.node()).h + 3)
      .attr('width', this.graphHelper.getDimensions(label.text.node()).w)
      .attr('height', this.graphHelper.getDimensions(label.text.node()).h);
  }

  /**
   * Function giving information if the mouse is on left side of the diagram.
   * @param itemCoord {number} x coordinate of the value (e.g. mouse) to be checked
   */
  private checkLeftSide(itemCoord: number): boolean {
    return ((this.background.node().getBBox().width + this.graphExtent.leftOffset) / 2 > itemCoord) ? true : false;
  }

}


