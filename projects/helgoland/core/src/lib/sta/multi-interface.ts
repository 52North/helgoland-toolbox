import { Injectable } from '@angular/core';
import moment from 'moment';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { HttpService } from '../dataset-api/http.service';
import { DatasetApiV2 } from '../dataset-api/interfaces/api-v2.interface';
import { InternalIdHandler } from '../dataset-api/internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from '../dataset-api/splitted-data-api-interface.service';
import { Category } from '../model/dataset-api/category';
import { Data, IDataEntry } from '../model/dataset-api/data';
import { Dataset, FirstLastValue, Timeseries, TimeseriesData, TimeseriesExtras } from '../model/dataset-api/dataset';
import { Feature } from '../model/dataset-api/feature';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Platform } from '../model/dataset-api/platform';
import { Procedure } from '../model/dataset-api/procedure';
import { Service } from '../model/dataset-api/service';
import { Station } from '../model/dataset-api/station';
import { DataParameterFilter, HttpRequestOptions, ParameterFilter } from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { Datastream } from './model/datasetreams';
import { Location } from './model/locations';
import { Observation } from './model/observations';
import { ObservedProperty } from './model/observed-properties';
import { Sensor } from './model/sensors';
import { Thing } from './model/things';
import { StaReadInterfaceService } from './read/sta-read-interface.service';

enum ServiceType {
    STA = 'STA',
    SERIES = 'SERIES'
}

@Injectable()
export class MultiDatasetInterface implements DatasetApiV2 {

    private serviceMap = {};

    constructor(
        private rest: SplittedDataDatasetApiInterface,
        private sta: StaReadInterfaceService,
        private httpService: HttpService,
        private internalDatasetId: InternalIdHandler
    ) { }

    getPlatforms(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Platform[]> {
        return this.handleService<Platform[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getPlatforms(apiUrl, params, options)
        );
    }

    getPlatform(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Platform> {
        return this.handleService<Platform>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getPlatform(id, apiUrl, params, options)
        );
    }

    getDatasets(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Dataset[]> {
        return this.handleService<Dataset[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getDatasets(apiUrl, params, options)
        );
    }

    getDataset(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Dataset> {
        return this.handleService<Dataset>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getDataset(id, apiUrl, params, options)
        );
    }

    getDatasetByInternalId(internalId: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Dataset> {
        const resolvedId = this.internalDatasetId.resolveInternalId(internalId);
        return this.handleService<Dataset>(
            resolvedId.url,
            () => this.notImplemented(),
            () => this.rest.getDatasetByInternalId(internalId, params, options)
        );
    }

    getData<T extends IDataEntry>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions): Observable<Data<T>> {
        return this.handleService<Data<T>>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getData(id, apiUrl, timespan, params, options)
        );
    }

    getServices(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Service[]> {
        return this.handleService<Service[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getServices(apiUrl, params, options)
        );
    }

    getService(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Service> {
        return this.handleService<Service>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getService(id, apiUrl, params, options)
        );
    }

    getStations(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station[]> {
        return this.handleService<Station[]>(
            apiUrl,
            () => this.sta.getLocations(apiUrl)
                .pipe(map(locs => locs.value.map(e => this.createStation(e)))),
            () => this.rest.getStations(apiUrl, params, options)
        );
    }

    getStation(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station> {
        return this.handleService<Station>(
            apiUrl,
            () => this.sta.getLocation(apiUrl, id).pipe(map(loc => this.createStation(loc))),
            () => this.rest.getStation(id, apiUrl, params)
        );
    }

    getTimeseries(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries[]> {
        return this.handleService<Timeseries[]>(
            apiUrl,
            () => this.sta.getDatastreams(apiUrl, { $expand: 'Thing,Thing/Locations,ObservedProperty,Sensor' })
                .pipe(flatMap(ds => {
                    return forkJoin(ds.value.map(d => {
                        if (params && params.expanded) {
                            return this.requestExpandedTimeseries(d, apiUrl);
                        } else {
                            return of(this.createTimeseries(d, apiUrl));
                        }
                    }));
                })),
            () => this.rest.getTimeseries(apiUrl, params, options)
        );
    }

    getSingleTimeseries(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries> {
        return this.handleService<Timeseries>(
            apiUrl,
            () => this.sta.getDatastream(apiUrl, id, { $expand: 'Thing,Thing/Locations,ObservedProperty,Sensor' })
                .pipe(flatMap(ds => this.requestExpandedTimeseries(ds, apiUrl))),
            () => this.rest.getSingleTimeseries(id, apiUrl, params)
        );
    }

    private requestExpandedTimeseries(ds: Datastream, apiUrl: string): Observable<Timeseries> {
        // get first and last timestamp
        if (ds.phenomenonTime && ds.phenomenonTime.indexOf('/')) {
            const firstLastDates = ds.phenomenonTime.split('/');
            // request for first and last timestamp the values
            const firstReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $filter: this.createTimeFilter(firstLastDates[0]) });
            const lastReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $filter: this.createTimeFilter(firstLastDates[1]) });
            return forkJoin([firstReq, lastReq]).pipe(map(res => {
                const first: FirstLastValue = this.createFirstLastValue(res[0].value[0]);
                const last: FirstLastValue = this.createFirstLastValue(res[1].value[0]);
                // create extended timeseries
                return this.createExpandedTimeseries(ds, first, last, apiUrl);
            }));
        } else {
            return EMPTY;
        }
    }

    getTimeseriesData(apiUrl: string, ids: string[], timespan: Timespan, options?: HttpRequestOptions): Observable<TimeseriesData[]> {
        return this.handleService<TimeseriesData[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getTimeseriesData(apiUrl, ids, timespan, options)
        );
    }

    getSingleTimeseriesByInternalId(internalId: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Timeseries> {
        const intId = this.internalDatasetId.resolveInternalId(internalId);
        return this.handleService<Timeseries>(
            intId.url,
            () => this.sta.getDatastream(intId.url, intId.id, { $expand: 'Thing,Thing/Locations,ObservedProperty,Sensor' })
                .pipe(flatMap(ds => this.requestExpandedTimeseries(ds, intId.url))),
            () => this.rest.getSingleTimeseriesByInternalId(internalId, params)
        );
    }

    getTimeseriesExtras(id: string, apiUrl: string): Observable<TimeseriesExtras> {
        return this.handleService<TimeseriesExtras>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getTimeseriesExtras(id, apiUrl)
        );
    }

    getTsData<T>(id: string, apiUrl: string, timespan: Timespan, params?: DataParameterFilter, options?: HttpRequestOptions): Observable<Data<T>> {
        return this.handleService<Data<T>>(
            apiUrl,
            () => this.sta.getDatastreamObservationsRelation(apiUrl, id, { $orderby: 'phenomenonTime', $filter: this.createTimespanFilter(timespan) })
                .pipe(map(res => this.createData<T>(res.value, params))),
            () => this.rest.getTsData(id, apiUrl, timespan, params, options)
        );
    }

    private createTimespanFilter(timespan: Timespan): string {
        return `phenomenonTime ge ${moment(timespan.from).format()} and phenomenonTime le ${moment(timespan.to).format()}`;
    }

    private createTimeFilter(time: string): string {
        return `phenomenonTime eq ${time}`;
    }

    private createFirstLastValue(obs: Observation): FirstLastValue {
        return { timestamp: new Date(obs.phenomenonTime).valueOf(), value: parseFloat(obs.result) };
    }

    getCategories(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category[]> {
        return this.handleService<Category[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getCategories(apiUrl, params, options)
        );
    }

    getCategory(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category> {
        return this.handleService<Category>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getCategory(id, apiUrl, params)
        );
    }

    getPhenomena(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon[]> {
        return this.handleService<Phenomenon[]>(
            apiUrl,
            () => this.sta.getObservedProperties(apiUrl)
                .pipe(map(obsProps => obsProps.value.map(e => this.createPhenomenon(e)))),
            () => this.rest.getPhenomena(apiUrl, params, options)
        );
    }

    getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon> {
        return this.handleService<Phenomenon>(
            apiUrl,
            () => this.sta.getObservedProperty(apiUrl, id)
                .pipe(map(prop => this.createPhenomenon(prop))),
            () => this.rest.getPhenomenon(id, apiUrl, params)
        );
    }

    getOfferings(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering[]> {
        return this.handleService<Offering[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getOfferings(apiUrl, params, options)
        );
    }

    getOffering(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering> {
        return this.handleService<Offering>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getOffering(id, apiUrl, params, options)
        );
    }

    getFeatures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature[]> {
        return this.handleService<Feature[]>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getFeatures(apiUrl, params, options)
        );
    }

    getFeature(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature> {
        return this.handleService<Feature>(
            apiUrl,
            () => this.notImplemented(),
            () => this.rest.getFeature(id, apiUrl, params, options)
        );
    }

    getProcedures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure[]> {
        return this.handleService<Procedure[]>(
            apiUrl,
            () => this.sta.getSensors(apiUrl).pipe(map(sensors => sensors.value.map(s => this.createProcedure(s)))),
            () => this.rest.getProcedures(apiUrl, params, options)
        );
    }

    getProcedure(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Procedure> {
        return this.handleService<Procedure>(
            apiUrl,
            () => this.sta.getSensor(apiUrl, id).pipe(map(sensor => this.createProcedure(sensor))),
            () => this.rest.getProcedure(id, apiUrl, params)
        );
    }

    private handleService<T>(apiUrl: string, staMethod: () => Observable<T>, seriesMethod: () => Observable<T>): Observable<T> {
        return this.checkService(apiUrl).pipe(flatMap(res => {
            if (res === ServiceType.STA) {
                return staMethod();
            } else {
                return seriesMethod();
            }
        }));
    }

    private checkService(url: string): Observable<ServiceType> {
        if (this.serviceMap[url]) {
            return of(this.serviceMap[url]);
        } else {
            return this.httpService.client().get(url)
                .pipe(map(res => {
                    this.serviceMap[url] = res['value'] ? ServiceType.STA : ServiceType.SERIES;
                    return this.serviceMap[url];
                }));
        }
    }

    private createTimeseries(ds: Datastream, url: string): Timeseries {
        const ts = new Timeseries();
        ts.id = ds['@iot.id'];
        ts.label = ds.name;
        ts.url = url;
        ts.uom = ds.unitOfMeasurement.symbol;
        ts.internalId = this.internalDatasetId.createInternalId(url, ds['@iot.id']);
        ts.station = this.createStation(ds.Thing.Locations[0]);
        ts.parameters = {
            // TODO: adjust
            service: {
                id: 'serviceId',
                label: 'service label'
            },
            offering: this.createOffering(ds.Thing),
            feature: this.createFeature(ds.Thing.Locations[0]),
            procedure: this.createProcedure(ds.Sensor),
            phenomenon: this.createPhenomenon(ds.ObservedProperty),
            category: this.createCategory(ds.ObservedProperty)
        };
        return ts;
    }

    private createExpandedTimeseries(ds: Datastream, first: FirstLastValue, last: FirstLastValue, url: string): Timeseries {
        const ts = this.createTimeseries(ds, url);
        ts.firstValue = first;
        ts.lastValue = last;
        ts.referenceValues = [];
        return ts;
    }

    private createData<T>(observations: Observation[], params?: DataParameterFilter): Data<T> {
        if (params && params.format) {
            return {
                values: observations.map(obs => {
                    return [new Date(obs.phenomenonTime).getTime(), parseFloat(obs.result as string)] as any;
                }),
                referenceValues: null
            };
        }
        return {
            values: observations.map(obs => {
                return {
                    timestamp: new Date(obs.phenomenonTime).getTime(),
                    value: parseFloat(obs.result as string)
                } as any;
            }),
            referenceValues: null
        };
    }

    private createFeature(loc: Location): Feature {
        return { id: loc['@iot.id'], label: loc.name };
    }

    private createOffering(thing: Thing): Offering {
        return { id: thing['@iot.id'], label: thing.name };
    }

    private createPhenomenon(obsProp: ObservedProperty): Phenomenon {
        return { id: obsProp['@iot.id'], label: obsProp.name };
    }

    private createCategory(obsProp: ObservedProperty): Category {
        return { id: obsProp['@iot.id'], label: obsProp.name };
    }

    private createProcedure(sensor: Sensor): Procedure {
        return { id: sensor['@iot.id'], label: sensor.name };
    }

    private createStation(loc: Location): Station {
        return {
            id: loc['@iot.id'],
            geometry: loc.location,
            properties: {
                id: 'id', // TODO: adjust
                label: loc.name,
                timeseries: {} // TODO: adjust
            }
        };
    }

    private notImplemented(): Observable<any> {
        throw new Error('Needs to be implemented'); // TODO: remove
    }

}
