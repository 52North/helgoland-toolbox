import { Injectable } from '@angular/core';
import { FilteredProvider, ParameterFilter } from '@helgoland/core';

export interface ListSelectorParameter {
    header: string;
    type: string;
    isDisabled?: boolean;
    headerAddition?: string;
    filterList?: ParameterFilter[];
}

@Injectable()
export class ListSelectorService {
    public cache: Map<string, ListSelectorParameter[]> = new Map<string, ListSelectorParameter[]>();
    public providerList: FilteredProvider[];
}
