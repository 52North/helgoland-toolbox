export interface HighlightOutput {
    timestamp: number;
    ids: Map<string, HighlightValue>;
}

export interface HighlightValue {
    timestamp: number;
    value: number;
}
