export interface AxesOptions extends jquery.flot.axisOptions {
    uom?: string;
    label?: string;
    hideLabel?: boolean;
    internalIds?: string[];
    tsColors?: string[];
    timezone?: string;
    additionalWidth?: number;
    panRange?: boolean;
}
