/**
 * Plot options for D3 component.
 *
 * @export
 */
export interface D3PlotOptions {

    /**
     * Show stepper for every Y-axis. This stepper allows to change the range of the axis.
     */
    yAxisStepper?: boolean;

    /**
     * show reference values for a graph
     */
    showReferenceValues?: boolean;

    /**
     * requests the dataset data generalized
     */
    generalizeAllways?: boolean;

    /**
     * toggle panning (true) and zooming (false)
     */
    togglePanZoom?: boolean;

    /**
     * show or hide y axis
     */
    yaxis?: boolean;

    /**
     * show or hide grid lines inside plot
     */
    grid?: boolean;

    /**
     * show or hide lines with values when hovering with mouse
     */
    hoverable?: boolean;

    /**
     * style when hovering with mouse
     */
    hoverStyle?: HoveringStyle;

    /**
     * indicating if component should build overview diagram or not
     */
    overview?: boolean;

    /**
     * show copyright label
     *
     * default position is top left
     */
    copyright?: D3Copyright;

    /**
    * toggle dataset grouping by uom
    * true = group y axis by uom
    * false = single y axis for each timeseries
    */
    groupYaxis?: boolean;

    /**
    * show the label of the xaxis
    */
    showTimeLabel?: boolean | string;

    /**
    * Request the data with expanded=true, to get valueBeforeTimespan/valueAfterTimespan
    */
    requestBeforeAfterValues?: boolean;

    /**
     * Buffering factor for the get Data requests, which will be added before and after the timespan for every get data request.
     */
    timespanBufferFactor?: number;

    /**
     * Sends request only, when the corresponding dataset has values inside the request timespan. So the first and last values must cover the timespan.
     */
    sendDataRequestOnlyIfDatasetTimespanCovered?: boolean;

    /**
     * Configures an optional timerange label with start and end under the diagram
     */
    timeRangeLabel?: {
        show: boolean;
        format?: string;
    }
}

export interface D3Copyright {
    label: string;
    link?: string;
    positionX?: 'right' | 'left';
    positionY?: 'top' | 'bottom';
}

export enum HoveringStyle {
    none = 'none',
    line = 'line',
    point = 'point'
}
