import { ParameterFilter } from './../internal/http-requests';

export interface Provider {
  id: string;
  url: string;
}

export interface FilteredProvider extends Provider {
  filter: ParameterFilter;
}
