import { Injectable } from '@angular/core';

import { FilteredProvider } from './../../../model/internal/provider';
import { ListSelectorParameter } from './list-selector.component';

@Injectable()
export class ListSelectorService {
    public cache: Map<string, ListSelectorParameter[]> = new Map<string, ListSelectorParameter[]>();
    public providerList: FilteredProvider[];
}
