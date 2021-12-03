import { DataEntry } from '../../model/d3-general';
import { SeriesGraphDataset } from '../../d3-series-graph/models/series-graph-dataset';

export interface HoveringElement {
    dataEntry: DataEntry;
    entry: SeriesGraphDataset;
    element: d3.Selection<d3.BaseType, any, any, any>
}

export interface HoverPosition {
    x: number;
    y: number;
    background: any;
}

export abstract class D3HoveringService {

    public abstract initPointHovering(elem: d3.Selection<SVGGElement, any, any, any>);

    public abstract hidePointHovering(d: DataEntry, entry: SeriesGraphDataset, pointElem: d3.Selection<d3.BaseType, any, any, any>);

    public abstract showPointHovering(d: DataEntry, entry: SeriesGraphDataset, pointElem: d3.Selection<d3.BaseType, any, any, any>);

    public abstract positioningPointHovering(x: number, y: number, color: string, background: any);

    public abstract showTooltip(elements: HoveringElement[], position: HoverPosition);

    public abstract removeTooltip();

}
