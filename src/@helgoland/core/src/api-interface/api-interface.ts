import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Category } from '../model/api/category';
import { Data } from '../model/api/data';
import { Dataset, Timeseries, TimeseriesExtras } from '../model/api/dataset';
import { Feature } from '../model/api/feature';
import { Offering } from '../model/api/offering';
import { DataParameterFilter, ParameterFilter } from '../model/api/parameterFilter';
import { Phenomenon } from '../model/api/phenomenon';
import { Platform } from '../model/api/platform';
import { Procedure } from '../model/api/procedure';
import { Service } from '../model/api/service';
import { Station } from '../model/api/station';
import { Timespan } from '../model/internal/timeInterval';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { ApiV2 } from './interfaces/api-v2.interface';

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

export abstract class ApiInterface implements ApiV2 {

    constructor(
        protected http: HttpClient,
        protected translate: TranslateService
    ) { }

    public abstract getPlatforms(apiUrl: string, params?: ParameterFilter): Observable<Platform[]>;
    public abstract getPlatform(id: string, apiUrl: string, params?: ParameterFilter): Observable<Platform>;
    public abstract getDatasets(apiUrl: string, params?: ParameterFilter): Observable<Dataset[]>;
    public abstract getDataset(id: string, apiUrl: string, params?: ParameterFilter): Observable<Dataset>;
    public abstract getData<T>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter)
        : Observable<Data<T>>;
    public abstract getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]>;
    public abstract getService(id: string, apiUrl: string, params?: ParameterFilter): Observable<Service>;
    public abstract getStations(apiUrl: string, params?: ParameterFilter): Observable<Station[]>;
    public abstract getStation(id: string, apiUrl: string, params?: ParameterFilter): Observable<Station>;
    public abstract getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]>;
    public abstract getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter): Observable<Timeseries>;
    public abstract getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras>;
    public abstract getTsData<T>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter)
        : Observable<Data<T>>;
    public abstract getCategories(apiUrl: string, params?: ParameterFilter): Observable<Category[]>;
    public abstract getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category>;
    public abstract getPhenomena(apiUrl: string, params?: ParameterFilter): Observable<Phenomenon[]>;
    public abstract getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter): Observable<Phenomenon>;
    public abstract getOfferings(apiUrl: string, params?: ParameterFilter): Observable<Offering[]>;
    public abstract getOffering(id: string, apiUrl: string, params?: ParameterFilter): Observable<Offering>;
    public abstract getFeatures(apiUrl: string, params?: ParameterFilter): Observable<Feature[]>;
    public abstract getFeature(id: string, apiUrl: string, params?: ParameterFilter): Observable<Feature>;
    public abstract getProcedures(apiUrl: string, params?: ParameterFilter): Observable<Procedure[]>;
    public abstract getProcedure(id: string, apiUrl: string, params?: ParameterFilter): Observable<Procedure>;

    protected createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
        // TODO Check whether apiUrl ends with slash
        let requestUrl = apiUrl + endpoint;
        if (id) { requestUrl += '/' + id; }
        return requestUrl;
    }

    protected requestApi<T>(url: string, params: ParameterFilter = {}): Observable<T> {
        return this.http.get<T>(url, { params: this.prepareParams(params) });
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
