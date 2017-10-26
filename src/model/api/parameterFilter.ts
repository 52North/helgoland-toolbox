export interface ParameterFilter {
    service?: string;
    phenomenon?: string;
    valueTypes?: string;
    platformTypes?: string;
    expanded?: boolean;
    lang?: string;
    [key: string]: any;
}

export interface DataParameterFilter extends ParameterFilter {
    format?: string;
    timespan?: string;
    generalize?: boolean;
}
