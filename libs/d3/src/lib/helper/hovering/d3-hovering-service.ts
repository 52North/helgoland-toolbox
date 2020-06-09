import { HelgolandTimeseries } from '@helgoland/core';

import { DataEntry, InternalDataEntry } from '../../model/d3-general';

export abstract class D3HoveringService {

    public abstract initPointHovering(elem: d3.Selection<SVGGElement, any, any, any>);

    public abstract hidePointHovering(d: DataEntry, entry: InternalDataEntry);

    public abstract showPointHovering(d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries);

    public abstract positioningPointHovering(x: number, y: number, color: string, background: any);

}
