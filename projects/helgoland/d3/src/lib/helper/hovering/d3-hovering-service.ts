import { HelgolandTimeseries } from '@helgoland/core';

import { DataEntry, InternalDataEntry } from '../../model/d3-general';

export interface HoveringElement {
  dataEntry: DataEntry;
  entry: InternalDataEntry;
  timeseries: HelgolandTimeseries;
  element: d3.Selection<d3.BaseType, any, any, any>;
}

export interface HoverPosition {
  x: number;
  y: number;
  background: any;
}

export abstract class D3HoveringService {
  public abstract initPointHovering(
    elem: d3.Selection<SVGGElement, any, any, any>,
  ): void;

  public abstract hidePointHovering(
    d: DataEntry,
    entry: InternalDataEntry,
    pointElem: d3.Selection<d3.BaseType, any, any, any>,
  ): void;

  public abstract showPointHovering(
    d: DataEntry,
    entry: InternalDataEntry,
    timeseries: HelgolandTimeseries,
    pointElem: d3.Selection<d3.BaseType, any, any, any>,
  ): void;

  public abstract positioningPointHovering(
    x: number,
    y: number,
    color: string,
    background: any,
  ): void;

  public abstract showTooltip(
    elements: HoveringElement[],
    position: HoverPosition,
  ): void;

  public abstract removeTooltip(): void;
}
