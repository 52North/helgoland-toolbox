import { Observable } from 'rxjs/Observable';

import { Data } from '../../model/api/data';
import { Dataset } from '../../model/api/dataset';
import { Platform } from '../../model/api/platform';
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from '../../model/internal/http-requests';
import { Timespan } from '../../model/internal/timeInterval';
import { ApiV1 } from './api-v1.interface';

export interface ApiV2 extends ApiV1 {

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
