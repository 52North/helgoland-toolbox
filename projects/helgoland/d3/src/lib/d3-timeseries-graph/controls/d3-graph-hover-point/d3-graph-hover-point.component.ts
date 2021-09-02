import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import moment from 'moment';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { D3PointSymbolDrawerService } from '../../../helper/d3-point-symbol-drawer.service';
import { D3HoveringService } from '../../../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../../../helper/hovering/d3-simple-hovering.service';
import { DataEntry, InternalDataEntry } from '../../../model/d3-general';
import { HighlightOutput } from '../../../model/d3-highlight';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';
import { HoveringElement } from './../../../helper/hovering/d3-hovering-service';
import { HighlightValue } from './../../../model/d3-highlight';

const MAXIMUM_POINT_DISTANCE = 10;

interface HoveredElement {
  selection: d3.Selection<d3.BaseType, any, any, any>;
  dataEntry: DataEntry;
  internalEntry: InternalDataEntry;
}

interface BarHoverElement extends HoveredElement {
  previousOpacity?: string;
}

@Component({
  selector: 'n52-d3-graph-hover-point',
  template: '',
  styleUrls: ['./d3-graph-hover-point.component.scss']
})
export class D3GraphHoverPointComponent extends D3TimeseriesGraphControl {

  @Input() public hoveringService: D3HoveringService = new D3SimpleHoveringService(this.timezoneSrvc, this.pointSymbolDrawer);

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

  private d3Graph: D3TimeseriesGraphComponent;
  private drawLayer: d3.Selection<SVGGElement, any, any, any>;
  private background: d3.Selection<SVGSVGElement, any, any, any>;
  private disableHovering: boolean;
  private preparedData: InternalDataEntry[];
  private graphExtent: D3GraphExtent;
  private graphLayer: d3.Selection<SVGSVGElement, any, any, any>;
  private previousPoint: HoveredElement;

  private previousBars: BarHoverElement[] = [];

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService,
    protected timezoneSrvc: TimezoneService,
    protected pointSymbolDrawer: D3PointSymbolDrawerService
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
      this.drawLayer = this.d3Graph.getDrawingLayer('hovering-point-layer');
      this.hoveringService.initPointHovering(this.drawLayer);
    }
    this.background = background;
    this.graphExtent = graphExtent;
    this.preparedData = preparedData;
    this.graphLayer = graph;
  }

  public mousemoveBackground() {
    if (!this.disableHovering) {
      this.mouseMoved();
    }
  }

  public mouseoutBackground() {
    this.unhighlight();
  }

  public dragStartBackground() {
    this.unhighlight();
    this.disableHovering = true;
  }

  public zoomStartBackground() {
    this.unhighlight();
    this.disableHovering = true;
  }

  public dragEndBackground() {
    this.disableHovering = false;
  }

  public zoomEndBackground() {
    this.disableHovering = false;
  }

  private mouseMoved() {
    this.unhighlight();
    const pos = this.getCurrentMousePosition();
    const nearestPoint = this.findNearestPoint(pos.x, pos.y);
    if (nearestPoint) {
      this.highlightPoint(nearestPoint);
    } else {
      const time = this.graphExtent.xScale.invert(pos.x).getTime();
      const nearestBar = this.findNearestBar(time, this.graphExtent.height - pos.y);
      if (nearestBar) {
        this.highlightBars(nearestBar);
      }
    }
  }

  private highlightPoint(nearestPoint: HoveredElement) {
    this.previousPoint = nearestPoint;
    const dataset = this.d3Graph.getDataset(nearestPoint.internalEntry.internalId);
    this.hoveringService.showPointHovering(this.previousPoint.dataEntry, this.previousPoint.internalEntry, dataset, nearestPoint.selection);
    this.hoveringService.positioningPointHovering(
      this.previousPoint.dataEntry.xDiagCoord,
      this.previousPoint.dataEntry.yDiagCoord,
      this.previousPoint.internalEntry.options.color,
      this.background
    );

    const ids: Map<string, HighlightValue> = new Map();
    ids.set(this.previousPoint.internalEntry.internalId, {
      timestamp: this.previousPoint.dataEntry.timestamp,
      value: this.previousPoint.dataEntry.value
    });

    this.onHighlightChanged.emit({
      timestamp: this.previousPoint.dataEntry.timestamp,
      ids: ids
    });
  }

  private highlightBars(nearestBars: BarHoverElement[]) {
    const elements: HoveringElement[] = [];
    // add hovering tooltip to array
    nearestBars.forEach(nearestBar => {
      this.previousBars.push(nearestBar);
      nearestBar.previousOpacity = nearestBar.selection.style('fill-opacity');
      const dataset = this.d3Graph.getDataset(nearestBar.internalEntry.internalId);
      elements.push({
        dataEntry: nearestBar.dataEntry,
        entry: nearestBar.internalEntry,
        timeseries: dataset,
        element: nearestBar.selection
      })
      // this.hoveringService.showPointHovering(nearestBar.dataEntry, nearestBar.internalEntry, dataset, nearestBar.selection);
      // centered on bar
      // const barX = Number.parseFloat(nearestBar.selection.attr('x'));
      // const barY = Number.parseFloat(nearestBar.selection.attr('y'));
      // const barHeight = Number.parseFloat(nearestBar.selection.attr('height'));
      // const barWidth = Number.parseFloat(nearestBar.selection.attr('width'));
      // const x = barX + barWidth / 2;
      // const y = barY + barHeight / 2;

      // mouse position
      nearestBar.selection.style('fill-opacity', '0.6');
    });
    const pos = this.getCurrentMousePosition();
    this.hoveringService.showTooltip(elements, { x: pos.x, y: pos.y, background: this.background });
  }

  private unhighlight() {
    if (this.previousPoint) {
      this.hoveringService.hidePointHovering(this.previousPoint.dataEntry, this.previousPoint.internalEntry, this.previousPoint.selection);
      this.previousPoint = null;
    }
    if (this.previousBars.length) {
      for (let i = this.previousBars.length - 1; i >= 0; i--) {
        const bar = this.previousBars[i];
        this.hoveringService.hidePointHovering(bar.dataEntry, bar.internalEntry, bar.selection);
        bar.selection.style('fill-opacity', bar.previousOpacity);
        this.previousBars.splice(i, 1);
      }
    }
    this.hoveringService.removeTooltip();
  }

  private findNearestPoint(x: number, y: number): HoveredElement {
    let nearest: HoveredElement = null;
    let nearestDist = Infinity;

    this.preparedData.forEach(e => {
      if (e.options.type === 'line') {
        const delaunay = Delaunay.from(e.data, d => d.xDiagCoord, d => d.yDiagCoord);
        const idx = delaunay.find(x, y);

        if (idx != null && !isNaN(idx)) {
          const datum = e.data[idx];
          const distance = this.distance(datum.xDiagCoord, datum.yDiagCoord, x, y);
          if (distance <= MAXIMUM_POINT_DISTANCE && distance < nearestDist) {
            const id = `dot-${datum.timestamp}-${e.hoverId}`;
            nearest = {
              selection: this.graphLayer.select(`#${id}`),
              internalEntry: e,
              dataEntry: datum
            };
            nearestDist = distance;
          }
        }
      }
    });
    return nearest;
  }

  private findNearestBar(time: number, height: number): BarHoverElement[] {
    const nearest: BarHoverElement[] = [];
    this.preparedData.every(e => {
      if (e.options.type === 'bar') {
        const shiftedTime = moment(time).subtract(e.options.barPeriod).valueOf();
        const idx = e.data.findIndex(d => d.timestamp > shiftedTime);
        if (idx > -1 && e.data[idx]) {
          const id = `bar-${e.data[idx].timestamp}-${e.hoverId}`;
          const match = this.graphLayer.select(`#${id}`);
          const barHeight = match.attr('height') && Number.parseFloat(match.attr('height'));
          if (barHeight > height) {
            nearest.push({
              selection: match,
              internalEntry: e,
              dataEntry: e.data[idx]
            });
            return true;
          }
        }
      }
      return true;
    });
    return nearest;
  }

  private getCurrentMousePosition(): { x: number, y: number } {
    const [x, y] = d3.mouse(this.background.node());
    return { x: x + this.graphExtent.leftOffset, y };
  }

  private distance(px: number, py: number, mx: number, my: number): number {
    const a = px - mx;
    const b = py - my;
    return Math.sqrt(a * a + b * b);
  }

}
