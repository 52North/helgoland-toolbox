import { Observable } from "rxjs";

import { Category } from "../../model/dataset-api/category";
import { Data, IDataEntry } from "../../model/dataset-api/data";
import { Timeseries, TimeseriesData, TimeseriesExtras } from "../../model/dataset-api/dataset";
import { Feature } from "../../model/dataset-api/feature";
import { Offering } from "../../model/dataset-api/offering";
import { Phenomenon } from "../../model/dataset-api/phenomenon";
import { Procedure } from "../../model/dataset-api/procedure";
import { Service } from "../../model/dataset-api/service";
import { Station } from "../../model/dataset-api/station";
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from "../../model/internal/http-requests";
import { Timespan } from "../../model/internal/timeInterval";

export interface DatasetApiV1 {

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
    getTimeseriesData(apiUrl: string, ids: string[], timespan: Timespan, options?: HttpRequestOptions): Observable<TimeseriesData[]>;
    getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries>;
    getSingleTimeseriesByInternalId(internalId: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries>;
    getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras>;

    getTsData<T extends IDataEntry>(
        id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions
    ): Observable<Data<T>>;

    getCategories(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category[]>;
    getCategory(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category>;

    getPhenomena(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon[]>;
    getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon>;

    getOfferings(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering[]>;
    getOffering(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering>;

    getFeatures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature[]>;
    getFeature(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature>;

    getProcedures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure[]>;
    getProcedure(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure>;

}
