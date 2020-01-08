import { Injectable } from '@angular/core';
import moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId, InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { TimeValueTuple } from '../../../model/dataset-api/data';
import { FirstLastValue, ParameterConstellation } from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { DataParameterFilter, ParameterFilter } from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { Datastream, DatastreamExpandParams, DatastreamSelectParams } from '../../../sta/model/datasetreams';
import { Location, LocationExpandParams, LocationSelectParams } from '../../../sta/model/locations';
import { Observation } from '../../../sta/model/observations';
import {
  ObservedProperty,
  ObservedPropertyExpandParams,
  ObservedPropertySelectParams,
} from '../../../sta/model/observed-properties';
import { Sensor, SensorExpandParams, SensorSelectParams } from '../../../sta/model/sensors';
import { StaExpandParams, StaFilter, StaSelectParams } from '../../../sta/model/sta-interface';
import { Thing, ThingExpandParams, ThingSelectParams } from '../../../sta/model/things';
import { StaReadInterfaceService } from '../../../sta/read/sta-read-interface.service';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-handler.service';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { HelgolandData, HelgolandDataFilter } from '../../model/internal/data';
import { DatasetFilter, HelgolandDataset, HelgolandTimeseries } from '../../model/internal/dataset';
import { HelgolandTimeseriesData } from './../../model/internal/data';

const DEFAULT_SERVICE_LABEL = 'OGC SensorThings API';
const DEFAULT_SERVICE_ID = '1';

@Injectable({
  providedIn: 'root'
})
export class StaApiV1Service implements IHelgolandServiceConnectorHandler {

  constructor(
    private http: HttpService,
    private internalDatasetId: InternalIdHandler,
    private sta: StaReadInterfaceService
  ) { }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map((res: any) => {
        if (res && res.value && res.value instanceof Array) {
          // check if endpoint 'Things' exists
          return res.value.findIndex(e => e.name === 'Things') >= 0;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]> {
    return this.createServices(apiUrl);
  }

  getCategories(url: string, filter: ParameterFilter): Observable<Category[]> {
    return this.sta.aggregatePaging(this.sta.getObservedProperties(url, this.createCategoriesFilter(filter)))
      .pipe(map(obProps => obProps.value.map(e => this.createCategory(e))));
  }

  getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category> {
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createCategory(prop)));
  }

  getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]> {
    return this.sta.aggregatePaging(this.sta.getThings(url, this.createOfferingsFilter(filter)))
      .pipe(map(things => things.value.map(t => this.createOffering(t))));
  }

  private createOfferingsFilter(params: ParameterFilter): StaFilter<ThingSelectParams, ThingExpandParams> {
    if (params) {
      const filterList = [];
      return this.createFilter(filterList);
    }
  }

  getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering> {
    return this.sta.getThing(url, id).pipe(map(t => this.createOffering(t)));
  }

  getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]> {
    return this.sta.aggregatePaging(this.sta.getObservedProperties(url, this.createPhenomenaFilter(filter)))
      .pipe(map(obsProps => obsProps.value.map(e => this.createPhenomenon(e))));
  }

  private createPhenomenaFilter(params: ParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList = [];
      if (params.category) {
        filterList.push(`id eq ${params.category}`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq ${params.feature}`);
      }
      return this.createFilter(filterList);
    }
  }

  getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon> {
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createPhenomenon(prop)));
  }

  getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]> {
    return this.sta.aggregatePaging(this.sta.getSensors(url, this.createProceduresFilter(filter)))
      .pipe(map(sensors => sensors.value.map(s => this.createProcedure(s))));
  }

  private createProceduresFilter(params: ParameterFilter): StaFilter<SensorSelectParams, SensorExpandParams> {
    if (params) {
      const filterList = [];
      if (params.category) {
        filterList.push(`Datastreams/ObservedProperty/id eq ${params.category}`);
      }
      // if (params.feature) {
      //     filterList.push(`Datastreams/Thing/Locations/id eq ${params.feature}`);
      // }
      if (params.phenomenon) {
        filterList.push(`Datastreams/ObservedProperty/id eq ${params.category}`);
      }
      return this.createFilter(filterList);
    }
    return {};
  }

  getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure> {
    return this.sta.getSensor(url, id).pipe(map(sensor => this.createProcedure(sensor)));
  }

  getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]> {
    return this.sta.aggregatePaging(this.sta.getLocations(url, this.createFeaturesFilter(filter)))
      .pipe(map(locs => locs.value.map(l => this.createFeature(l))));
  }

  private createFeaturesFilter(params: ParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
    if (params) {
      const filterList = [];
      if (params.category) {
        filterList.push(`Things/Datastreams/ObservedProperty/id eq ${params.category}`);
      }
      if (params.phenomenon) {
        filterList.push(`Things/Datastreams/ObservedProperty/id eq ${params.phenomenon}`);
      }
      if (params.procedure) {
        filterList.push(`Things/Datastreams/Sensor/id eq ${params.procedure}`);
      }
      return this.createFilter(filterList);
    }
  }

  getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature> {
    return this.sta.getLocation(url, id).pipe(map(loc => this.createFeature(loc)));
  }

  getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.sta.aggregatePaging(this.sta.getLocations(url, this.createStationFilter(filter)))
      .pipe(map(locs => locs.value.map(e => this.createStation(e))));
  }

  getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.sta.getLocation(url, id, { $expand: 'Things/Datastreams/Thing,Things/Locations,Things/Datastreams/ObservedProperty,Things/Datastreams/Sensor' })
      .pipe(map(loc => this.createExtendedStation(loc)));
  }

  private createCategoriesFilter(params: ParameterFilter): StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams> {
    if (params) {
      const filterList = [];
      if (params.phenomenon) {
        filterList.push(`id eq ${params.phenomenon}`);
      }
      if (params.feature) {
        filterList.push(`Datastreams/Thing/Locations/id eq ${params.feature}`);
      }
      if (params.procedure) {
        filterList.push(`Datastreams/Sensor/id eq ${params.procedure}`);
      }
      return this.createFilter(filterList);
    }
  }

  private createStationFilter(filter: ParameterFilter): StaFilter<LocationSelectParams, LocationExpandParams> {
    if (filter) {
      if (filter.phenomenon) {
        return { $filter: `Things/Datastreams/ObservedProperty/id eq ${filter.phenomenon}` };
      }
    }
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.sta.aggregatePaging(this.sta.getDatastreams(url, this.createDatastreamFilter(filter)))
      .pipe(flatMap(ds => {
        return forkJoin(ds.value.map(d => {
          if (filter.expanded) {
            return this.requestExpandedTimeseries(d, url);
          } else {
            return of(this.createTimeseries(d, url));
          }
        }));
      }));
  }

  private createDatastreamFilter(params: DatasetFilter): StaFilter<DatastreamSelectParams, DatastreamExpandParams> {
    let filter: StaFilter<StaSelectParams, StaExpandParams> = {};
    if (params) {
      const filterList = [];
      if (params.phenomenon) {
        filterList.push(`ObservedProperty/id eq ${params.phenomenon}`);
      }
      if (params.category) {
        filterList.push(`ObservedProperty/id eq ${params.category}`);
      }
      if (params.procedure) {
        filterList.push(`Sensor/id eq ${params.procedure}`);
      }
      if (params.feature) {
        filterList.push(`Thing/Locations/id eq ${params.feature}`);
      }
      filter = this.createFilter(filterList);
    }
    filter.$expand = 'Thing,Thing/Locations,ObservedProperty,Sensor';
    return filter;
  }

  private requestExpandedTimeseries(ds: Datastream, apiUrl: string): Observable<HelgolandTimeseries> {
    // get first and last timestamp
    if (ds.phenomenonTime && ds.phenomenonTime.indexOf('/')) {
      const firstLastDates = ds.phenomenonTime.split('/');
      // request for first and last timestamp the values
      const firstReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $filter: this.createTimeFilter(firstLastDates[0]) });
      const lastReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $filter: this.createTimeFilter(firstLastDates[1]) });
      return forkJoin([firstReq, lastReq]).pipe(map(res => {
        const first: FirstLastValue = this.createFirstLastValue(res[0].value[0]);
        const last: FirstLastValue = this.createFirstLastValue(res[1].value[0]);
        return this.createExpandedTimeseries(ds, first, last, apiUrl);
      }));
    } else {
      const firstReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $orderby: 'phenomenonTime', $top: 1 });
      const lastReq = this.sta.getDatastreamObservationsRelation(apiUrl, ds['@iot.id'], { $orderby: 'phenomenonTime desc', $top: 1 });
      return forkJoin([firstReq, lastReq]).pipe(map(res => {
        const first: FirstLastValue = this.createFirstLastValue(res[0].value[0]);
        const last: FirstLastValue = this.createFirstLastValue(res[1].value[0]);
        return this.createExpandedTimeseries(ds, first, last, apiUrl);
      }));
    }
  }

  private createFirstLastValue(obs: Observation): FirstLastValue {
    if (obs && obs.phenomenonTime && obs.result) {
      return { timestamp: new Date(obs.phenomenonTime).valueOf(), value: parseFloat(obs.result) };
    }
    return null;
  }

  private createTimeFilter(time: string): string {
    return `phenomenonTime eq ${time}`;
  }

  getDataset(internalId: InternalDatasetId): Observable<HelgolandDataset> {
    return this.sta.getDatastream(internalId.url, internalId.id, { $expand: 'Thing,Thing/Locations,ObservedProperty,Sensor' })
      .pipe(flatMap(ds => this.requestExpandedTimeseries(ds, internalId.url)));
  }

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    return this.sta.aggregatePaging(
      this.sta.getDatastreamObservationsRelation(dataset.url, dataset.id, { $orderby: 'phenomenonTime', $filter: this.createTimespanFilter(timespan), $top: 200 })
    ).pipe(map(res => this.createData(res.value, filter)));
  }

  private createTimespanFilter(timespan: Timespan): string {
    const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    return `phenomenonTime ge ${moment(timespan.from).format(format)} and phenomenonTime le ${moment(timespan.to).format(format)}`;
  }

  private createStation(loc: Location): Station {
    return {
      id: loc['@iot.id'],
      geometry: loc.location,
      label: loc.name,
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

  private createTimeseries(ds: Datastream, url: string): HelgolandDataset {
    return new HelgolandDataset(ds['@iot.id'], url, ds.name);
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

  private createExpandedTimeseries(ds: Datastream, first: FirstLastValue, last: FirstLastValue, url: string): HelgolandTimeseries {
    const id = ds['@iot.id'];
    const label = ds.name;
    const uom = ds.unitOfMeasurement.symbol;
    const parameter = this.createTsParameter(ds, ds.Thing, ds.Sensor, ds.ObservedProperty);
    return new HelgolandTimeseries(id, url, label, uom, first, last, parameter.feature, parameter.phenomenon, parameter.offering);
  }

  private createData(observations: Observation[], params: DataParameterFilter = {}): HelgolandTimeseriesData {
    const values = observations.map(obs => [new Date(obs.phenomenonTime).getTime(), parseFloat(obs.result as string)] as TimeValueTuple);
    const data = new HelgolandTimeseriesData(values);
    data.referenceValues = {};
    return data;
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

  // private createPlatform(loc: Location): Platform {
  //   return {
  //     id: loc['@iot.id'],
  //     label: loc.name,
  //     platformType: PlatformTypes.stationary,
  //     datasets: [],
  //     geometry: loc.location as GeoJSON.Point,
  //   };
  // }

  private createFilter(filterList: any[]): StaFilter<StaSelectParams, StaExpandParams> {
    if (filterList.length > 0) {
      return { $filter: filterList.join(' and ') };
    }
    return {};
  }

}

export const DatasetStaConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: StaApiV1Service,
  multi: true
};
