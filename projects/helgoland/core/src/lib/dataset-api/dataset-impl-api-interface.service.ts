import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { deserialize, deserializeArray } from 'class-transformer';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    Category,
    Data,
    Dataset,
    Feature,
    Offering,
    Phenomenon,
    Platform,
    Procedure,
    Service,
    Station,
    Timeseries,
    TimeseriesExtras,
} from '../model';
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { DatasetApiInterface } from './api-interface';
import { HttpService } from './http.service';
import { InternalIdHandler } from './internal-id-handler.service';

@Injectable()
export class DatasetImplApiInterface extends DatasetApiInterface {

    constructor(
        protected http: HttpClient,
        protected httpservice: HttpService,
        protected internalDatasetId: InternalIdHandler,
        protected translate: TranslateService
    ) {
        super(http, httpservice, translate);
    }

    public getServices(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Service[]> {
        const url = this.createRequestUrl(apiUrl, 'services');
        if (params) {
            params.expanded = true;
        } else {
            params = { expanded: true };
        }
        return this.requestApi<Service[]>(url, params, options).pipe(
            map((result) => {
                result.forEach((entry) => entry.apiUrl = apiUrl);
                return result;
            }));
    }

    public getService(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Service> {
        const url = this.createRequestUrl(apiUrl, 'services', id);
        return this.requestApi<Service>(url, params, options).pipe(
            map((result) => {
                result.apiUrl = apiUrl;
                return result;
            }));
    }

    public getStations(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station[]> {
        const url = this.createRequestUrl(apiUrl, 'stations');
        return this.requestApi<Station[]>(url, params, options);
    }

    public getStation(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Station> {
        const url = this.createRequestUrl(apiUrl, 'stations', id);
        return this.requestApi<Station>(url, params, options);
    }

    public getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]> {
        const url = this.createRequestUrl(apiUrl, 'timeseries');
        return new Observable<Timeseries[]>((observer: Observer<Timeseries[]>) => {
            this.requestApiTexted(url, params).subscribe(
                (result) => {
                    const timeseriesList = deserializeArray<Timeseries>(Timeseries, result);
                    timeseriesList.forEach((entry) => {
                        entry.url = apiUrl;
                        this.internalDatasetId.generateInternalId(entry);
                    });
                    observer.next(timeseriesList);
                },
                (error) => observer.error(error),
                () => observer.complete()
            );
        });
    }

    public getSingleTimeseries(
        id: string,
        apiUrl: string,
        params?: ParameterFilter
    ): Observable<Timeseries> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id);
        return this.requestApiTexted(url, params).pipe(map((result) => {
            const timeseries = deserialize<Timeseries>(Timeseries, result);
            timeseries.url = apiUrl;
            this.internalDatasetId.generateInternalId(timeseries);
            return timeseries;
        }));
    }

    public getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id);
        return this.requestApi<TimeseriesExtras>(url + '/extras');
    }

    public getTsData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {},
        options: HttpRequestOptions
    ): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id) + '/getData';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params, options).pipe(
            map((res: any) => {
                if (params.expanded) { res = res[id]; }
                return res;
            }));
    }

    public getCategories(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category[]> {
        const url = this.createRequestUrl(apiUrl, 'categories');
        return this.requestApi<Category[]>(url, params, options);
    }

    public getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category> {
        // const url = this.createRequestUrl(apiUrl, 'categories', id);
        throw new Error('Not implemented');
        // return this.requestApi(url, params)
        //     .map(this.extractData);
    }

    public getPhenomena(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon[]> {
        const url = this.createRequestUrl(apiUrl, 'phenomena');
        return this.requestApi<Phenomenon[]>(url, params, options);
    }

    public getPhenomenon(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Phenomenon> {
        const url = this.createRequestUrl(apiUrl, 'phenomena', id);
        return this.requestApi<Phenomenon>(url, params, options);
    }

    public getOfferings(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering[]> {
        const url = this.createRequestUrl(apiUrl, 'offerings');
        return this.requestApi<Offering[]>(url, params, options);
    }

    public getOffering(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Offering> {
        const url = this.createRequestUrl(apiUrl, 'offerings', id);
        return this.requestApi<Offering>(url, params, options);
    }

    public getFeatures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature[]> {
        const url = this.createRequestUrl(apiUrl, 'features');
        return this.requestApi<Feature[]>(url, params, options);
    }

    public getFeature(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Feature> {
        const url = this.createRequestUrl(apiUrl, 'features', id);
        return this.requestApi<Feature>(url, params, options);
    }

    public getProcedures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure[]> {
        const url = this.createRequestUrl(apiUrl, 'procedures');
        return this.requestApi<Procedure[]>(url, params, options);
    }

    public getProcedure(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Procedure> {
        const url = this.createRequestUrl(apiUrl, 'procedures', id);
        return this.requestApi<Procedure>(url, params, options);
    }

    public getPlatforms(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Platform[]> {
        const url = this.createRequestUrl(apiUrl, 'platforms');
        return this.requestApi<Platform[]>(url, params, options);
    }

    public getPlatform(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Platform> {
        const url = this.createRequestUrl(apiUrl, 'platforms', id);
        return this.requestApi<Platform>(url, params, options);
    }

    public getDatasets(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Dataset[]> {
        const url = this.createRequestUrl(apiUrl, 'datasets');
        return this.requestApi<Dataset[]>(url, params, options).pipe(
            map((list) => list.map((entry) => this.prepareDataset(entry, apiUrl)))
        );
    }

    public getDataset(
        id: string,
        apiUrl: string,
        params?: ParameterFilter,
        options?: HttpRequestOptions
    ): Observable<Dataset> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id);
        return this.requestApi<Dataset>(url, params, options).pipe(
            map((res) => this.prepareDataset(res, apiUrl))
        );
    }

    public getData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {},
        options: HttpRequestOptions
    ): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id) + '/data';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params, options);
    }

    // public getGeometries(id: string, apiUrl: string, params?): Observable<> {
    //     throw new Error('Not implemented');
    // }

    protected createRequestTimespan(timespan: Timespan): string {
        return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
    }

    private requestApiTexted(url: string, params: ParameterFilter = {}): Observable<string> {
        return this.http.get(url, {
            params: this.prepareParams(params),
            responseType: 'text'
        });
    }

    private prepareDataset(datasetObj: Dataset, apiUrl: string) {
        const dataset = deserialize<Dataset>(Dataset, JSON.stringify(datasetObj));
        dataset.url = apiUrl;
        this.internalDatasetId.generateInternalId(dataset);
        if (dataset.seriesParameters) {
            dataset.parameters = dataset.seriesParameters;
            delete dataset.seriesParameters;
        }
        return dataset;
    }
}
