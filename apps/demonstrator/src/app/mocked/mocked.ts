import { Injectable } from '@angular/core';
import {
    ApiV3Dataset,
    ApiV3InterfaceService,
    ApiV3ParameterFilter,
    DatasetApiV3Connector,
    HttpRequestOptions,
    HttpService,
} from '@helgoland/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import dataset from './dataset.json';

@Injectable({
    providedIn: 'root'
})
export class MockedApiV3InterfaceService extends ApiV3InterfaceService {

    public getDataset(id: string, apiUrl: string, params?: ApiV3ParameterFilter): Observable<ApiV3Dataset> {
        return of(dataset as any);
    }

    public getDatasets(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Dataset[]> {
        return of([dataset as any]);
    }

}

@Injectable({
    providedIn: 'root'
})
export class MockedDatasetApiV3Connector extends DatasetApiV3Connector {

    constructor(
        protected http: HttpService,
        protected api: MockedApiV3InterfaceService
    ) {
        super(http, api);
    }

    canHandle(url: string): Observable<boolean> {
        return of(url === 'mocked-apiv3');
    }
}
