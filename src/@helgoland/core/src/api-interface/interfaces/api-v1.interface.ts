import {
    Category,
    Data,
    DataParameterFilter,
    Feature,
    HttpRequestOptions,
    Offering,
    ParameterFilter,
    Phenomenon,
    Procedure,
    Service,
    Station,
    Timeseries,
    TimeseriesExtras,
    Timespan,
} from '@helgoland/core';
import { Observable } from 'rxjs/Observable';

export interface ApiV1 {

    /**
     * Test
     * @param id
     * @return temp
     */
    getServices(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Service[]>;
    getService(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Service>;

    getStations(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station[]>;
    getStation(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station>;

    getTimeseries(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries[]>;
    getSingleTimeseries(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Timeseries>;
    getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras>;

    getTsData<T>(
        id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions
    ): Observable<Data<T>>;

    getCategories(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category[]>;
    getCategory(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category>;

    getPhenomena(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon[]>;
    getPhenomenon(
        id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions
    ): Observable<Phenomenon>;

    getOfferings(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering[]>;
    getOffering(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering>;

    getFeatures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature[]>;
    getFeature(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature>;

    getProcedures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure[]>;
    getProcedure(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure>;

}
