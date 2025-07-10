import { SeriesGraphDataset } from '../../d3-series-graph/models/series-graph-dataset';
import { DataEntry } from '../../model/d3-general';

export interface HoveringElement {
  dataEntry: DataEntry;
  entry: SeriesGraphDataset;
  element: d3.Selection<d3.BaseType, any, any, any>;
}

export interface HoverPosition {
  x: number;
  y: number;
  background: any;
}

export abstract class D3HoveringService {
  abstract initPointHovering(
    elem: d3.Selection<SVGGElement, any, any, any>,
  ): void;

  abstract hidePointHovering(
    d: DataEntry,
    entry: SeriesGraphDataset,
    pointElem: d3.Selection<d3.BaseType, any, any, any>,
  ): void;

  abstract showPointHovering(
    d: DataEntry,
    entry: SeriesGraphDataset,
    pointElem: d3.Selection<d3.BaseType, any, any, any>,
  ): void;

  abstract positioningPointHovering(
    x: number,
    y: number,
    color: string,
    background: any,
  ): void;

  abstract showTooltip(
    elements: HoveringElement[],
    position: HoverPosition,
  ): void;

  abstract removeTooltip(): void;
}
