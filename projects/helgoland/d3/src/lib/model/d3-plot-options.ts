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
     * style when hovering with mouse
     *
     * @memberof D3PlotOptions
     */
    hoverStyle?: HoveringStyle;

    /**
     * indicating if component should build overview diagram or not
     *
     * @memberof D3PlotOptions
     */
    overview?: boolean;

    /**
     * show copyright label
     *
     * default position is top left
     *
     * @memberof D3PlotOptions
     */
    copyright?: D3Copyright;

    /**
    * toggle dataset grouping by uom
    * true = group y axis by uom
    * false = single y axis for each timeseries
    *
    * @memberof D3PlotOptions
    */
    groupYaxis?: boolean;

    /**
    * show the label of the xaxis
    *
    * @memberof D3PlotOptions
    */
    showTimeLabel?: boolean;

}

export interface D3Copyright {
    label: string;
    positionX?: 'right' | 'left';
    positionY?: 'top' | 'bottom';
}

export enum HoveringStyle {
    line = 'line',
    point = 'point', // default
    new = 'new'
}
