export interface HighlightOutput {
    timestamp: number;
    ids: Array<HighlightValue>;
}

export interface HighlightValue {
    timestamp: number;
    value: number;
}
