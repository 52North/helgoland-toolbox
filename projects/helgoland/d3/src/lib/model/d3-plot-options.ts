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
     *
     * default position is top left
     *
     * @memberof D3PlotOptions
     */
    copyright?: D3Copyright;

}

export interface D3Copyright {
    label: string;
    positionX?: 'right' | 'left';
    positionY?: 'top' | 'bottom';
}
