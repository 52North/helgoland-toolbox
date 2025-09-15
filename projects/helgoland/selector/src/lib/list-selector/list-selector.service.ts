import { Injectable } from '@angular/core';
import { FilteredProvider } from '@helgoland/core';

import {
  MultiServiceFilter,
  MultiServiceFilterEndpoint,
} from '../multi-service-filter-selector/multi-service-filter-selector.component';

export interface ListSelectorParameter {
  header: string;
  type: MultiServiceFilterEndpoint;
  selected?: string;
  isDisabled?: boolean;
  headerAddition?: string;
  filterList: MultiServiceFilter[];
}

@Injectable()
export class ListSelectorService {
  cache: Map<string, ListSelectorParameter[]> = new Map<
    string,
    ListSelectorParameter[]
  >();
  providerList: FilteredProvider[] = [];
}
