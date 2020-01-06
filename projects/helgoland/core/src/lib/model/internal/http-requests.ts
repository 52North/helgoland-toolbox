export interface ParameterFilter {
    service?: string;
    category?: string;
    offering?: string;
    phenomenon?: string;
    procedure?: string;
    feature?: string;
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

export interface HttpRequestOptions {
    forceUpdate?: boolean;
    basicAuthToken?: string;
    expirationAtMs?: number;
}
