import { Observable } from 'rxjs';

import { Category } from '../../model/dataset-api/category';
import { Service } from '../../model/dataset-api/service';
import { Station } from '../../model/dataset-api/station';
import { ParameterFilter } from '../../model/internal/http-requests';

export interface IHelgolandServiceConnector {
    getStations(url: string, filter: ParameterFilter): Observable<Station[]>;
    getStation(id: string, url: string, filter: ParameterFilter): Observable<Station>;

    getCategories(url: string, filter: ParameterFilter): Observable<Category[]>;
    getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category>;

    getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]>;
}

export interface IHelgolandServiceConnectorHandler extends IHelgolandServiceConnector {
    canHandle(url: string): Observable<boolean>;
}
