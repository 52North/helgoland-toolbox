import { Observable } from 'rxjs';

import { Data, Dataset, Platform } from '../../model';
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from '../../model/internal/http-requests';
import { Timespan } from '../../model/internal/timeInterval';
import { DatasetApiV1 } from './api-v1.interface';

export interface DatasetApiV2 extends DatasetApiV1 {

    getPlatforms(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Platform[]>;
    getPlatform(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Platform>;

    getDatasets(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Dataset[]>;
    getDataset(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Dataset>;
    getData<T>(
        id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions
    ): Observable<Data<T>>;

    // getGeometries(id: string, apiUrl: string, params?): Observable<>;

}
