import { ParameterFilter } from './../internal/http-requests';

export class Filter {
    public url: string;
    public service: string;
    public itemId: string;
    public filter: ParameterFilter;
}
