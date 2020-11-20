import { Parameter } from '@helgoland/core';
import { MultiServiceFilter } from '@helgoland/selector';

export enum ParameterType {
    CATEGORY = 'category',
    FEATURE = 'feature',
    PHENOMENON = 'phenomenon',
    PROCEDURE = 'procedure',
    TIMESERIES = 'timeseries',
    PROVIDER = 'provider'
}

export interface ParamterListEntry {
    selectedFilter?: ParameterType;
    selectedItem?: Parameter;
    apiFilter: MultiServiceFilter[];
    expanded: boolean;
    possibleFilters: ParameterType[];
}