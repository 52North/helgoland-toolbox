/**
 * Plot options for D3 component.
 *
 * @export
 * @interface D3PlotOptions
 */
export interface D3PlotOptions {

    /**
     * show reference values for a graph
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    showReferenceValues?: boolean;

    /**
     * requests the dataset data generalized
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    generalizeAllways?: boolean;

    /**
     * toggle panning (true) and zooming (false)
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    togglePanZoom?: boolean;

    /**
     * show or hide y axis
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    yaxis?: boolean;

    /**
     * show or hide grid lines inside plot
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    grid?: boolean;

    /**
     * show or hide lines with values when hovering with mouse
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    hoverable?: boolean;

    /**
     * indicating if component should build overview diagram or not
     *
     * @type {boolean}
     * @memberof D3PlotOptions
     */
    overview?: boolean;
}
