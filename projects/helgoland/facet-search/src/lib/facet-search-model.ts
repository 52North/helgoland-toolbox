export enum ParameterFacetType {
    category = 'category',
    phenomenon = 'phenomenon',
    procedure = 'procedure',
    feature = 'feature',
    offering = 'offering'
}

export enum ParameterFacetSort {
    none = 'none',
    ascAlphabet = 'ascAlphabet',
    descAlphabet = 'descAlphabet',
    ascCount = 'ascCount',
    descCount = 'descCount',
}

export interface FacetParameter {
    label: string;
    count: number;
    selected: boolean;
}
