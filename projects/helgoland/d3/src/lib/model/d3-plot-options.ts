/**
 * Plot options for D3 component.
 *
 * @export
 */
export interface D3PlotOptions {

    /**
     * show reference values for a graph
     *
     * @memberof D3PlotOptions
     */
    showReferenceValues?: boolean;

    /**
     * requests the dataset data generalized
     *
     * @memberof D3PlotOptions
     */
    generalizeAllways?: boolean;

    /**
     * toggle panning (true) and zooming (false)
     *
     * @memberof D3PlotOptions
     */
    togglePanZoom?: boolean;

    /**
     * show or hide y axis
     *
     * @memberof D3PlotOptions
     */
    yaxis?: boolean;

    /**
     * show or hide grid lines inside plot
     *
     * @memberof D3PlotOptions
     */
    grid?: boolean;

    /**
     * show or hide lines with values when hovering with mouse
     *
     * @memberof D3PlotOptions
     */
    hoverable?: boolean;

    /**
     * indicating if component should build overview diagram or not
     *
     * @memberof D3PlotOptions
     */
    overview?: boolean;

    /**
     * show copyright label
     * position: { x: right/left, y: top/bottom }
     * default position: top left
     *
     * @memberof D3PlotOptions
     */
    copyright?: { label: string, position?: { x: string, y: string } };

    /**
     * language used in the plot
     *
     * @memberof D3PlotOptions
     */
    language?: string;

    /**
     * toggle dataset grouping by uom
     * true = group y axis by uom
     * false = single y axis for each timeseries
     *
     * @memberof D3PlotOptions
     */
    groupYaxis?: boolean;
}
