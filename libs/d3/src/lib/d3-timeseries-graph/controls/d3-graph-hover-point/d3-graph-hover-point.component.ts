import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import moment from 'moment';

import { D3GraphHelperService } from '../../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../../helper/d3-graph-id.service';
import { D3Graphs } from '../../../helper/d3-graphs.service';
import { D3HoveringService } from '../../../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../../../helper/hovering/d3-simple-hovering.service';
import { DataEntry, InternalDataEntry } from '../../../model/d3-general';
import { HighlightOutput } from '../../../model/d3-highlight';
import { D3GraphExtent, D3TimeseriesGraphControl } from '../../d3-timeseries-graph-control';
import { D3TimeseriesGraphComponent } from '../../d3-timeseries-graph.component';
import { HighlightValue } from './../../../model/d3-highlight';

const MAXIMUM_POINT_DISTANCE = 10;

interface HoveredElement {
  selection: d3.Selection<d3.BaseType, any, any, any>;
  dataEntry: DataEntry;
  internalEntry: InternalDataEntry;
}

@Component({
  selector: 'n52-d3-graph-hover-point',
  template: '',
  styleUrls: ['./d3-graph-hover-point.component.scss']
})
export class D3GraphHoverPointComponent extends D3TimeseriesGraphControl {

  @Input() public hoveringService: D3HoveringService = new D3SimpleHoveringService(this.timezoneSrvc);

  @Output() public onHighlightChanged: EventEmitter<HighlightOutput> = new EventEmitter();

  private d3Graph: D3TimeseriesGraphComponent;
  private drawLayer: d3.Selection<SVGGElement, any, any, any>;
  private background: d3.Selection<SVGSVGElement, any, any, any>;
  private disableHovering: boolean;
  private preparedData: InternalDataEntry[];
  private graphExtent: D3GraphExtent;
  private graphLayer: d3.Selection<SVGSVGElement, any, any, any>;
  private previousPoint: HoveredElement;

  private previousBar: HoveredElement;
  private prevBarOpacity: string;

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
        this.highlightBar(nearestBar);
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

  private highlightBar(nearestBar: HoveredElement) {
    this.previousBar = nearestBar;
    this.prevBarOpacity = this.previousBar.selection.style('fill-opacity');
    const dataset = this.d3Graph.getDataset(this.previousBar.internalEntry.internalId);
    this.hoveringService.showPointHovering(this.previousBar.dataEntry, this.previousBar.internalEntry, dataset, this.previousBar.selection);

    // centered on bar
    // const barX = Number.parseFloat(nearestBar.selection.attr('x'));
    // const barY = Number.parseFloat(nearestBar.selection.attr('y'));
    // const barHeight = Number.parseFloat(nearestBar.selection.attr('height'));
    // const barWidth = Number.parseFloat(nearestBar.selection.attr('width'));
    // const x = barX + barWidth / 2;
    // const y = barY + barHeight / 2;

    // mouse position
    const pos = this.getCurrentMousePosition();
    this.hoveringService.positioningPointHovering(
      pos.x,
      pos.y,
      this.previousBar.internalEntry.options.color,
      this.background
    );
    this.previousBar.selection.style('fill-opacity', '0.6');
  }

  private unhighlight() {
    if (this.previousPoint) {
      this.hoveringService.hidePointHovering(this.previousPoint.dataEntry, this.previousPoint.internalEntry, this.previousPoint.selection);
      this.previousPoint = null;
    }
    if (this.previousBar) {
      this.hoveringService.hidePointHovering(this.previousBar.dataEntry, this.previousBar.internalEntry, this.previousBar.selection);
      this.previousBar.selection.style('fill-opacity', this.prevBarOpacity);
      this.previousBar = null;
    }
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

  private findNearestBar(time: number, height: number): HoveredElement {
    let nearest;
    this.preparedData.some(e => {
      if (e.options.type === 'bar') {
        time = moment(time).subtract(e.options.barPeriod).valueOf();
        const idx = e.data.findIndex(d => d.timestamp > time);
        if (idx > -1 && e.data[idx]) {
          const id = `bar-${e.data[idx].timestamp}-${e.hoverId}`;
          const match = this.graphLayer.select(`#${id}`);
          const barHeight = match.attr('height') && Number.parseFloat(match.attr('height'));
          if (barHeight > height) {
            nearest = {
              selection: match,
              internalEntry: e,
              dataEntry: e.data[idx]
            };
            return true;
          }
        }
      }
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
