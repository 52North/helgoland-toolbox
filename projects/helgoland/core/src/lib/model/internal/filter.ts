import { ParameterFilter } from './../internal/http-requests';

export class Filter {
  url: string | undefined;
  service: string | undefined;
  itemId: string | undefined;
  filter: ParameterFilter | undefined;
}
