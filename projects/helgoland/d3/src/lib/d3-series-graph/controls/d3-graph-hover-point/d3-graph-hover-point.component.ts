import { Component, Input, inject, output } from '@angular/core';
import { TimezoneService } from '@helgoland/core';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import moment from 'moment';

import { D3PointSymbolDrawerService } from '../../../helper/d3-point-symbol-drawer.service';
import { D3HoveringService } from '../../../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../../../helper/hovering/d3-simple-hovering.service';
import { DataEntry } from '../../../model/d3-general';
import { D3GraphInterface } from '../../d3-graph.interface';
import {
  AdjustBackgroundOptions,
  D3GraphExtent,
  D3GraphObserver,
  D3SeriesGraphControl,
} from '../../d3-series-graph-control';
import { HighlightOutput, HighlightValue } from '../../models/d3-highlight';
import {
  BarStyle,
  GraphDataEntry,
  LineStyle,
  SeriesGraphDataset,
} from '../../models/series-graph-dataset';
import { HoveringElement } from './../../../helper/hovering/d3-hovering-service';

const MAXIMUM_POINT_DISTANCE = 10;

interface HoveredElement {
  selection: d3.Selection<d3.BaseType, any, any, any>;
  dataEntry: DataEntry;
  dataset: SeriesGraphDataset;
}

interface BarHoverElement extends HoveredElement {
  previousOpacity?: string;
}

@Component({
  selector: 'n52-d3-graph-hover-point',
  template: '',
  styleUrls: ['./d3-graph-hover-point.component.scss'],
  standalone: true,
})
export class D3GraphHoverPointComponent
  extends D3SeriesGraphControl
  implements D3GraphObserver
{
  protected timezoneSrvc = inject(TimezoneService);
  protected pointSymbolDrawer = inject(D3PointSymbolDrawerService);

  @Input() public hoveringService: D3HoveringService =
    new D3SimpleHoveringService();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onHighlightChanged = output<HighlightOutput>();

  protected d3Graph: D3GraphInterface | undefined;
  protected drawLayer: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected background: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected disableHovering: boolean = false;
  protected datasets: SeriesGraphDataset[] | undefined;
  protected graphExtent: D3GraphExtent | undefined;
  protected graphLayer: d3.Selection<SVGGElement, any, any, any> | undefined;
  protected previousPoint: HoveredElement | undefined;

  protected previousBars: BarHoverElement[] = [];
  protected data: Map<string, GraphDataEntry[]> | undefined;

  public graphInitialized(graph: D3GraphInterface) {
    this.d3Graph = graph;
    this.d3Graph.redrawCompleteGraph();
  }

  adjustBackground(options: AdjustBackgroundOptions) {
    if (!this.drawLayer && this.d3Graph) {
      this.drawLayer = this.d3Graph.getDrawingLayer('hovering-point-layer');
      if (this.hoveringService) {
        this.hoveringService.initPointHovering(this.drawLayer);
      }
    }
    this.background = options.background;
    this.graphExtent = options.graphExtent;
    this.datasets = options.preparedDatasets;
    this.graphLayer = options.graph;
    this.data = options.preparedData;
  }

  public mousemoveBackground(event: MouseEvent) {
    if (!this.disableHovering) {
      this.mouseMoved(event);
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

  protected mouseMoved(event: MouseEvent) {
    this.unhighlight();
    const pos = this.getCurrentMousePosition(event);
    if (pos && this.graphExtent && this.data?.size) {
      const nearestPoint = this.findNearestPoint(pos.x, pos.y);
      if (nearestPoint) {
        this.highlightPoint(nearestPoint);
      } else {
        const time = this.graphExtent.xScale.invert(pos.x).getTime();
        const nearestBar = this.findNearestBar(
          time,
          this.graphExtent.height - pos.y,
        );
        if (nearestBar.length) {
          this.highlightBars(nearestBar, event);
        }
      }
    }
  }

  protected highlightPoint(nearestPoint: HoveredElement) {
    this.previousPoint = nearestPoint;
    this.hoveringService.showPointHovering(
      this.previousPoint.dataEntry,
      this.previousPoint.dataset,
      nearestPoint.selection,
    );
    if (
      this.previousPoint.dataEntry.xDiagCoord &&
      this.previousPoint.dataEntry.yDiagCoord
    ) {
      this.hoveringService.positioningPointHovering(
        this.previousPoint.dataEntry.xDiagCoord,
        this.previousPoint.dataEntry.yDiagCoord,
        this.previousPoint.dataset.style.baseColor,
        this.background,
      );
    }

    const ids: Map<string, HighlightValue> = new Map();
    ids.set(this.previousPoint.dataset.id, {
      timestamp: this.previousPoint.dataEntry.timestamp,
      value: this.previousPoint.dataEntry.value,
    });

    this.onHighlightChanged.emit({
      timestamp: this.previousPoint.dataEntry.timestamp,
      ids: ids,
    });
  }

  protected highlightBars(
    nearestBars: BarHoverElement[],
    event: MouseEvent,
  ): void {
    const elements: HoveringElement[] = [];
    // add hovering tooltip to array
    nearestBars.forEach((nearestBar) => {
      this.previousBars.push(nearestBar);
      nearestBar.previousOpacity = nearestBar.selection.style('fill-opacity');
      elements.push({
        dataEntry: nearestBar.dataEntry,
        entry: nearestBar.dataset,
        element: nearestBar.selection,
      });
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
    const pos = this.getCurrentMousePosition(event);
    if (pos) {
      this.hoveringService.showTooltip(elements, {
        x: pos.x,
        y: pos.y,
        background: this.background,
      });
    }
  }

  protected unhighlight() {
    if (this.previousPoint) {
      this.hoveringService.hidePointHovering(
        this.previousPoint.dataEntry,
        this.previousPoint.dataset,
        this.previousPoint.selection,
      );
      this.previousPoint = undefined;
    }
    if (this.previousBars.length) {
      for (let i = this.previousBars.length - 1; i >= 0; i--) {
        const bar = this.previousBars[i];
        this.hoveringService.hidePointHovering(
          bar.dataEntry,
          bar.dataset,
          bar.selection,
        );
        if (bar.previousOpacity !== undefined) {
          bar.selection.style('fill-opacity', bar.previousOpacity);
        }
        this.previousBars.splice(i, 1);
      }
    }
    this.hoveringService.removeTooltip();
  }

  protected findNearestPoint(x: number, y: number): HoveredElement | undefined {
    let nearest: HoveredElement | undefined = undefined;
    let nearestDist = Infinity;

    this.datasets?.forEach((ds, i) => {
      if (ds.style instanceof LineStyle && ds.visible) {
        const data = this.data!.get(ds.id)!;
        const delaunay = Delaunay.from(
          data,
          (d) => d.xDiagCoord!,
          (d) => d.yDiagCoord!,
        );
        const idx = delaunay.find(x, y);

        if (idx != null && !isNaN(idx) && this.graphLayer) {
          const datum = data[idx] as DataEntry;
          const distance = this.distance(
            datum.xDiagCoord!,
            datum.yDiagCoord!,
            x,
            y,
          );
          if (distance <= MAXIMUM_POINT_DISTANCE && distance < nearestDist) {
            const id = `dot-${datum.timestamp}-${i}`;
            nearest = {
              selection: this.graphLayer.select(`#${id}`),
              dataset: ds,
              dataEntry: datum,
            };
            nearestDist = distance;
          }
        }
      }
    });
    return nearest;
  }

  protected findNearestBar(time: number, height: number): BarHoverElement[] {
    const nearest: BarHoverElement[] = [];
    this.datasets?.every((ds, i) => {
      if (ds.style instanceof BarStyle) {
        const data = this.data!.get(ds.id)!;
        const shiftedTime = moment(time).subtract(ds.style.period).valueOf();
        const idx = data.findIndex((d) => d.timestamp > shiftedTime);
        if (idx > -1 && data[idx] && this.graphLayer) {
          const id = `bar-${data[idx].timestamp}-${i}`;
          const match = this.graphLayer.select(`#${id}`);
          const barHeight =
            (match.attr('height') && Number.parseFloat(match.attr('height'))) ||
            0;
          if (barHeight > height) {
            nearest.push({
              selection: match,
              dataset: ds,
              dataEntry: data[idx],
            });
            return true;
          }
        }
      }
      return true;
    });
    return nearest;
  }

  protected getCurrentMousePosition(
    event?: MouseEvent,
  ): { x: number; y: number } | undefined {
    if (this.graphExtent) {
      const [x, y] = d3.pointer(event);
      return { x: x + this.graphExtent.leftOffset, y };
    }
    return undefined;
  }

  protected distance(px: number, py: number, mx: number, my: number): number {
    const a = px - mx;
    const b = py - my;
    return Math.sqrt(a * a + b * b);
  }
}
