import { Injectable } from '@angular/core';
import moment from 'moment';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { HttpService } from '../dataset-api/http.service';
import { DatasetApiV2 } from '../dataset-api/interfaces/api-v2.interface';
import { InternalIdHandler } from '../dataset-api/internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from '../dataset-api/splitted-data-api-interface.service';
import { Category } from '../model/dataset-api/category';
import { Data, IDataEntry } from '../model/dataset-api/data';
import {
    Dataset,
    FirstLastValue,
    ParameterConstellation,
    Timeseries,
    TimeseriesData,
    TimeseriesExtras,
} from '../model/dataset-api/dataset';
import { PlatformTypes } from '../model/dataset-api/enums';
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
import { Location, LocationExpandParams, LocationSelectParams } from './model/locations';
import { Observation } from './model/observations';
import { ObservedProperty } from './model/observed-properties';
import { Sensor } from './model/sensors';
import { StaFilter } from './model/sta-interface';
import { Thing } from './model/things';
import { StaReadInterfaceService } from './read/sta-read-interface.service';

enum ServiceType {
    STA = 'STA',
    SERIES = 'SERIES'
}

const DEFAULT_SERVICE_LABEL = 'OGC SensorThings API';
const DEFAULT_SERVICE_ID = '1';

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
            () => this.sta.getLocations(apiUrl).pipe(map(locs => locs.value.map(l => this.createPlatform(l)))),
            () => this.rest.getPlatforms(apiUrl, params, options)
        );
    }

    getPlatform(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Platform> {
        return this.handleService<Platform>(
            apiUrl,
            () => this.sta.getLocation(apiUrl, id).pipe(map(loc => this.createPlatform(loc))),
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
            () => this.createServices(apiUrl),
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
            () => this.sta.getLocations(apiUrl, this.createStationFilter(params))
                .pipe(map(locs => locs.value.map(e => this.createStation(e)))),
            () => this.rest.getStations(apiUrl, params, options)
        );
    }

    private createStationFilter(params?: ParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
        if (params) {
            if (params.phenomenon) {
                return { $filter: `Things/Datastreams/ObservedProperty/id eq ${params.phenomenon}` };
            }
        }
    }

    getStation(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Station> {
        return this.handleService<Station>(
            apiUrl,
            () => this.sta.getLocation(apiUrl, id, { $expand: 'Things/Datastreams/Thing,Things/Locations,Things/Datastreams/ObservedProperty,Things/Datastreams/Sensor' })
                .pipe(map(loc => this.createExtendedStation(loc))),
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
            return of(this.createTimeseries(ds, apiUrl));
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
            () => this.sta.getObservedProperties(apiUrl).pipe(map(obProps => obProps.value.map(e => this.createCategory(e)))),
            () => this.rest.getCategories(apiUrl, params, options)
        );
    }

    getCategory(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Category> {
        return this.handleService<Category>(
            apiUrl,
            () => this.sta.getObservedProperty(apiUrl, id).pipe(map(prop => this.createCategory(prop))),
            () => this.rest.getCategory(id, apiUrl, params)
        );
    }

    getPhenomena(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon[]> {
        return this.handleService<Phenomenon[]>(
            apiUrl,
            () => this.sta.getObservedProperties(apiUrl).pipe(map(obsProps => obsProps.value.map(e => this.createPhenomenon(e)))),
            () => this.rest.getPhenomena(apiUrl, params, options)
        );
    }

    getPhenomenon(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Phenomenon> {
        return this.handleService<Phenomenon>(
            apiUrl,
            () => this.sta.getObservedProperty(apiUrl, id).pipe(map(prop => this.createPhenomenon(prop))),
            () => this.rest.getPhenomenon(id, apiUrl, params)
        );
    }

    getOfferings(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering[]> {
        return this.handleService<Offering[]>(
            apiUrl,
            () => this.sta.getThings(apiUrl).pipe(map(things => things.value.map(t => this.createOffering(t)))),
            () => this.rest.getOfferings(apiUrl, params, options)
        );
    }

    getOffering(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Offering> {
        return this.handleService<Offering>(
            apiUrl,
            () => this.sta.getThing(apiUrl, id).pipe(map(t => this.createOffering(t))),
            () => this.rest.getOffering(id, apiUrl, params, options)
        );
    }

    getFeatures(apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature[]> {
        return this.handleService<Feature[]>(
            apiUrl,
            () => this.sta.getLocations(apiUrl).pipe(map(locs => locs.value.map(l => this.createFeature(l)))),
            () => this.rest.getFeatures(apiUrl, params, options)
        );
    }

    getFeature(id: string, apiUrl: string, params?: ParameterFilter, options?: HttpRequestOptions): Observable<Feature> {
        return this.handleService<Feature>(
            apiUrl,
            () => this.sta.getLocation(apiUrl, id).pipe(map(loc => this.createFeature(loc))),
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
        ts.parameters = this.createTsParameter(ds, ds.Thing, ds.Sensor, ds.ObservedProperty);
        return ts;
    }

    private createTsParameter(ds: Datastream, thing: Thing, sensor: Sensor, obsProp: ObservedProperty): ParameterConstellation {
        return {
            service: { id: DEFAULT_SERVICE_ID, label: DEFAULT_SERVICE_LABEL },
            offering: this.createOffering(thing),
            feature: this.createFeature(thing.Locations[0]),
            procedure: this.createProcedure(sensor),
            phenomenon: this.createPhenomenon(obsProp),
            category: this.createCategory(obsProp)
        };
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

    private createServices(url: string): Observable<Service[]> {
        const filter = { $count: true, $top: 1 };
        const locationsReq = this.sta.getLocations(url, filter);
        const obPropsReq = this.sta.getObservedProperties(url, filter);
        const thingsReq = this.sta.getThings(url, filter);
        const sensorsReq = this.sta.getSensors(url, filter);
        const datastreamsReq = this.sta.getDatastreams(url, filter);
        return forkJoin([locationsReq, obPropsReq, thingsReq, sensorsReq, datastreamsReq]).pipe(map(res => {
            const service: Service = {
                id: DEFAULT_SERVICE_ID,
                href: '',
                label: DEFAULT_SERVICE_LABEL,
                version: '1.0',
                extras: [],
                type: 'STA',
                apiUrl: url,
                quantities: {
                    categories: res[1]['@iot.count'],
                    features: res[0]['@iot.count'],
                    offerings: res[2]['@iot.count'],
                    phenomena: res[1]['@iot.count'],
                    procedures: res[3]['@iot.count'],
                    stations: res[0]['@iot.count'],
                    timeseries: res[4]['@iot.count'],
                    platforms: res[0]['@iot.count'],
                    datasets: res[4]['@iot.count']
                }
            };
            return [service];
        }));
    }

    private createStation(loc: Location): Station {
        return {
            id: loc['@iot.id'],
            geometry: loc.location,
            properties: {
                id: loc['@iot.id'],
                label: loc.name,
                timeseries: {}
            }
        };
    }

    private createExtendedStation(loc: Location): any {
        const station = this.createStation(loc);
        loc.Things.forEach(thing => {
            thing.Datastreams.forEach(ds => {
                station.properties.timeseries[ds['@iot.id']] = this.createTsParameter(ds, thing, ds.Sensor, ds.ObservedProperty);
            });
        });
        return station;
    }

    private createPlatform(loc: Location): Platform {
        return {
            id: loc['@iot.id'],
            label: loc.name,
            platformType: PlatformTypes.stationary,
            datasets: [],
            geometry: loc.location as GeoJSON.Point,
        };
    }

    private notImplemented(): Observable<any> {
        return throwError('Needs to be implemented'); // TODO: remove
    }

}
