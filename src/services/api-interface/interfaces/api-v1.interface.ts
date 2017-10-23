import { Observable } from 'rxjs/Rx';

import { Category } from './../../../model/api/category';
import { Data } from './../../../model/api/data';
import { Timeseries } from './../../../model/api/dataset';
import { Feature } from './../../../model/api/feature';
import { Offering } from './../../../model/api/offering';
import { DataParameterFilter, ParameterFilter } from './../../../model/api/parameterFilter';
import { Phenomenon } from './../../../model/api/phenomenon';
import { Procedure } from './../../../model/api/procedure';
import { Service } from './../../../model/api/service';
import { Station } from './../../../model/api/station';
import { Timespan } from './../../../model/internal/timeInterval';

export interface ApiV1 {

    /**
     * Test
     * @param id
     * @return temp
     */
    getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]>;
    getService(id: string, apiUrl: string, params?: ParameterFilter): Observable<Service>;

    getStations(apiUrl: string, params?: ParameterFilter): Observable<Station[]>;
    getStation(id: string, apiUrl: string, params?: ParameterFilter): Observable<Station>;

    getTimeseries(apiUrl: string, params?: ParameterFilter): Observable<Timeseries[]>;
    getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter): Observable<Timeseries>;

    getTsData<T>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter): Observable<Data<T>>;

    getCategories(apiUrl: string, params?: ParameterFilter): Observable<Category[]>;
    getCategory(id: string, apiUrl: string, params?: ParameterFilter): Observable<Category>;

    getPhenomena(apiUrl: string, params?: ParameterFilter): Observable<Phenomenon[]>;
    getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter): Observable<Phenomenon>;

    getOfferings(apiUrl: string, params?: ParameterFilter): Observable<Offering[]>;
    getOffering(id: string, apiUrl: string, params?: ParameterFilter): Observable<Offering>;

    getFeatures(apiUrl: string, params?: ParameterFilter): Observable<Feature[]>;
    getFeature(id: string, apiUrl: string, params?: ParameterFilter): Observable<Feature>;

    getProcedures(apiUrl: string, params?: ParameterFilter): Observable<Procedure[]>;
    getProcedure(id: string, apiUrl: string, params?: ParameterFilter): Observable<Procedure>;

}
