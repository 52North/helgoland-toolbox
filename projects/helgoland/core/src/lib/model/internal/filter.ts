import { ParameterFilter } from './../internal/http-requests';

export class Filter {
  public url: string | undefined;
  public service: string | undefined;
  public itemId: string | undefined;
  public filter: ParameterFilter | undefined;
}
