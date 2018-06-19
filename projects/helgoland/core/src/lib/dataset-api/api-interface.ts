import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Category } from '../model/dataset-api/category';
import { Data } from '../model/dataset-api/data';
import { Dataset, Timeseries, TimeseriesExtras } from '../model/dataset-api/dataset';
import { Feature } from '../model/dataset-api/feature';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Platform } from '../model/dataset-api/platform';
import { Procedure } from '../model/dataset-api/procedure';
import { Service } from '../model/dataset-api/service';
import { Station } from '../model/dataset-api/station';
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { HttpService, HttpServiceMetadata } from './http.service';
import { DatasetApiV2 } from './interfaces/api-v2.interface';

export class UriParameterCoder implements HttpParameterCodec {

    public encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    public encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    public decodeKey(key: string): string {
        return key;
    }

    public decodeValue(value: string): string {
        return value;
    }
}

export abstract class DatasetApiInterface implements DatasetApiV2 {

    constructor(
        protected httpService: HttpService,
        protected translate: TranslateService
    ) { }

    public abstract getPlatforms(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Platform[]>;
    public abstract getPlatform(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Platform>;
    public abstract getDatasets(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Dataset[]>;
    public abstract getDataset(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Dataset>;
    public abstract getData<T>(
        id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions
    ): Observable<Data<T>>;
    public abstract getServices(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Service[]>;
    public abstract getService(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Service>;
    public abstract getStations(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Station[]>;
    public abstract getStation(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Station>;
    public abstract getTimeseries(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Timeseries[]>;
    public abstract getSingleTimeseries(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Timeseries>;
    public abstract getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras>;
    public abstract getTsData<T>(
        id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions
    ): Observable<Data<T>>;
    public abstract getCategories(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Category[]>;
    public abstract getCategory(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Category>;
    public abstract getPhenomena(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Phenomenon[]>;
    public abstract getPhenomenon(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Phenomenon>;
    public abstract getOfferings(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Offering[]>;
    public abstract getOffering(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Offering>;
    public abstract getFeatures(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Feature[]>;
    public abstract getFeature(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Feature>;
    public abstract getProcedures(
        apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Procedure[]>;
    public abstract getProcedure(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Procedure>;

    protected createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) { requestUrl += '/' + id; }
        return requestUrl;
    }

    protected requestApi<T>(url: string, params: ParameterFilter = {}, options: HttpServiceMetadata = {}): Observable<T> {
        return this.httpService.client(options).get<T>(url, { params: this.prepareParams(params) });
    }

    protected prepareParams(params: ParameterFilter): HttpParams {
        if (this.translate && this.translate.currentLang) {
            params.locale = this.translate.currentLang;
        }
        let httpParams = new HttpParams({
            encoder: new UriParameterCoder()
        });
        Object.getOwnPropertyNames(params)
            .forEach((key) => httpParams = httpParams.set(key, params[key]));
        return httpParams;
    }
}
