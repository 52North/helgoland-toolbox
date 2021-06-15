import { Parameter } from '@helgoland/core';
import { MultiServiceFilter } from '@helgoland/selector';

export enum ParameterType {
    CATEGORY = 'category',
    FEATURE = 'feature',
    OFFERING = 'offering',
    PHENOMENON = 'phenomenon',
    PLATFORM = 'platform',
    PROCEDURE = 'procedure',
    PROVIDER = 'provider',
    TIMESERIES = 'timeseries',
}

export interface ParameterListEntry {
    selectedFilter?: ParameterType;
    selectedItem?: Parameter;
    apiFilter: MultiServiceFilter[];
    expanded: boolean;
    possibleFilters: ParameterType[];
}