import { Injectable } from '@angular/core';
import { FilteredProvider, HelgolandParameterFilter } from '@helgoland/core';

interface ExtendedFilter extends HelgolandParameterFilter {
    [key: string]: any;
}

export interface ListSelectorParameter {
    header: string;
    type: string;
    selected?: string;
    isDisabled?: boolean;
    headerAddition?: string;
    filterList?: ExtendedFilter[];
}

@Injectable()
export class ListSelectorService {
    public cache: Map<string, ListSelectorParameter[]> = new Map<string, ListSelectorParameter[]>();
    public providerList: FilteredProvider[];
}
