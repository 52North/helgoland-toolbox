import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { deserialize, deserializeArray } from 'class-transformer';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ApiInterface } from './api-interface';
import { InternalIdHandler } from './internal-id-handler.service';

@Injectable()
export class SimpleApiInterface extends ApiInterface {

    constructor(
        protected http: HttpClient,
        protected internalDatasetId: InternalIdHandler,
        protected translate: TranslateService
    ) {
        super(http, translate);
    }

    public getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]> {
        const url = this.createRequestUrl(apiUrl, 'services');
        params.expanded = true;
        return this.requestApi<Service[]>(url, params)
            .map((result) => {
                result.forEach((entry) => entry.providerUrl = apiUrl);
                return result;
            });
    }

    public getService(id: string, apiUrl: string, params?: ParameterFilter): Observable<Service> {
        const url = this.createRequestUrl(apiUrl, 'services', id);
        return this.requestApi<Service>(url, params)
            .map((result) => {
                result.providerUrl = apiUrl;
                return result;
            });
    }

    public getStations(apiUrl: string, params?: ParameterFilter): Observable<Station[]> {
        const url = this.createRequestUrl(apiUrl, 'stations');
        return this.requestApi<Station[]>(url, params);
    }

    public getStation(id: string, apiUrl: string, params?: ParameterFilter): Observable<Station> {
        const url = this.createRequestUrl(apiUrl, 'stations', id);
        return this.requestApi<Station>(url, params);
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
        return this.requestApiTexted(url, params).map((result) => {
            const timeseries = deserialize<Timeseries>(Timeseries, result);
            timeseries.url = apiUrl;
            this.internalDatasetId.generateInternalId(timeseries);
            return timeseries;
        });
    }

    public getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id);
        return this.requestApi<TimeseriesExtras>(url + '/extras');
    }

    public getTsData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {}
    ): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'timeseries', id) + '/getData';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params).map((res: any) => {
            if (params.expanded) { res = res[id]; }
            return res;
        });
    }

    public getCategories(apiUrl: string, params?: ParameterFilter): Observable<Category[]> {
        const url = this.createRequestUrl(apiUrl, 'categories');
        return this.requestApi<Category[]>(url, params);
    }

    public getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category> {
        // const url = this.createRequestUrl(apiUrl, 'categories', id);
        throw new Error('Not implemented');
        // return this.requestApi(url, params)
        //     .map(this.extractData);
    }

    public getPhenomena(apiUrl: string, params?: ParameterFilter): Observable<Phenomenon[]> {
        const url = this.createRequestUrl(apiUrl, 'phenomena');
        return this.requestApi<Phenomenon[]>(url, params);
    }

    public getPhenomenon(
        id: string,
        apiUrl: string,
        params?: ParameterFilter
    ): Observable<Phenomenon> {
        const url = this.createRequestUrl(apiUrl, 'phenomena', id);
        return this.requestApi<Phenomenon>(url, params);
    }

    public getOfferings(apiUrl: string, params?: ParameterFilter): Observable<Offering[]> {
        const url = this.createRequestUrl(apiUrl, 'offerings');
        return this.requestApi<Offering[]>(url, params);
    }

    public getOffering(id: string, apiUrl: string, params?: ParameterFilter): Observable<Offering> {
        const url = this.createRequestUrl(apiUrl, 'offerings', id);
        return this.requestApi<Offering>(url, params);
    }

    public getFeatures(apiUrl: string, params?: ParameterFilter): Observable<Feature[]> {
        const url = this.createRequestUrl(apiUrl, 'features');
        return this.requestApi<Feature[]>(url, params);
    }

    public getFeature(id: string, apiUrl: string, params?: ParameterFilter): Observable<Feature> {
        const url = this.createRequestUrl(apiUrl, 'features', id);
        return this.requestApi<Feature>(url, params);
    }

    public getProcedures(apiUrl: string, params?: ParameterFilter): Observable<Procedure[]> {
        const url = this.createRequestUrl(apiUrl, 'procedures');
        return this.requestApi<Procedure[]>(url, params);
    }

    public getProcedure(
        id: string,
        apiUrl: string,
        params?: ParameterFilter
    ): Observable<Procedure> {
        const url = this.createRequestUrl(apiUrl, 'procedures', id);
        return this.requestApi<Procedure>(url, params);
    }

    public getPlatforms(apiUrl: string, params?: ParameterFilter): Observable<Platform[]> {
        const url = this.createRequestUrl(apiUrl, 'platforms');
        return this.requestApi<Platform[]>(url, params);
    }

    public getPlatform(id: string, apiUrl: string, params?: ParameterFilter): Observable<Platform> {
        const url = this.createRequestUrl(apiUrl, 'platforms', id);
        return this.requestApi<Platform>(url, params);
    }

    public getDatasets(apiUrl: string, params?: ParameterFilter): Observable<Dataset[]> {
        const url = this.createRequestUrl(apiUrl, 'datasets');
        return this.requestApi<Dataset[]>(url, params)
            .map((list) => list.map((entry) => this.prepareDataset(entry, apiUrl)));
    }

    public getDataset(id: string, apiUrl: string, params?: ParameterFilter): Observable<Dataset> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id);
        return this.requestApi<Dataset>(url, params).map((res) => this.prepareDataset(res, apiUrl));
    }

    public getData<T>(
        id: string,
        apiUrl: string,
        timespan: Timespan,
        params: DataParameterFilter = {}
    ): Observable<Data<T>> {
        const url = this.createRequestUrl(apiUrl, 'datasets', id) + '/data';
        params.timespan = this.createRequestTimespan(timespan);
        return this.requestApi<Data<T>>(url, params);
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