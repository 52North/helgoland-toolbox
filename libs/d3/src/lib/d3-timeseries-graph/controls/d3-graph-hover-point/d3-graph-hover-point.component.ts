import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';

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
  private previous: HoveredElement;

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
    const [mx, my] = d3.mouse(this.background.node());
    const nearest = this.findNearest(mx + this.graphExtent.leftOffset, my);
    if (nearest) {
      this.highlight(nearest);
    }
  }

  private highlight(nearest: HoveredElement) {
    this.previous = nearest;
    const dataset = this.d3Graph.getDataset(nearest.internalEntry.internalId);
    this.hoveringService.showPointHovering(this.previous.dataEntry, this.previous.internalEntry, dataset, nearest.selection);
    this.hoveringService.positioningPointHovering(
      this.previous.dataEntry.xDiagCoord,
      this.previous.dataEntry.yDiagCoord,
      this.previous.internalEntry.options.color,
      this.background
    );

    const ids: Map<string, HighlightValue> = new Map();
    ids.set(this.previous.internalEntry.internalId, {
      timestamp: this.previous.dataEntry.timestamp,
      value: this.previous.dataEntry.value
    });

    this.onHighlightChanged.emit({
      timestamp: this.previous.dataEntry.timestamp,
      ids: ids
    });
  }

  private unhighlight() {
    if (this.previous) {
      this.hoveringService.hidePointHovering(this.previous.dataEntry, this.previous.internalEntry, this.previous.selection);
      this.previous = null;
    }
  }

  private findNearest(x: number, y: number): HoveredElement {
    let nearest: HoveredElement = null;
    let nearestDist = Infinity;

    this.preparedData.forEach(e => {
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
    });
    return nearest;
  }

  private distance(px: number, py: number, mx: number, my: number): number {
    const a = px - mx;
    const b = py - my;
    return Math.sqrt(a * a + b * b);
  }

}
