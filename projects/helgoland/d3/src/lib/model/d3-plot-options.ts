/**
 * Plot options for D3 component.
 * @param showReferenceValues {boolean} show reference values for a graph
 * @param generalizeAllways {boolean} generalize
 * @param togglePanZoom {boolean} toggle panning (true) and zooming (false)
 * @param yaxis {boolean} show or hide y axis
 * @param grid {boolean} show or hide grid lines inside plot
 * @param hoverable {boolean} show or hide lines with values when hovering with mouse
 * @param overview {boolean} indicating if component should build overview diagram or not
 */
export interface D3PlotOptions {
    showReferenceValues?: boolean;
    generalizeAllways?: boolean;
    togglePanZoom?: boolean;
    yaxis?: boolean;
    grid?: boolean;
    hoverable?: boolean;
    overview?: boolean;
}
