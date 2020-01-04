import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Data } from '../../../model/dataset-api/data';
import { FirstLastValue, ParameterConstellation, Timeseries } from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { DataParameterFilter, ParameterFilter } from '../../../model/internal/http-requests';
import { Datastream } from '../../../sta/model/datasetreams';
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
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';

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

  public canHandle(url: string): Observable<boolean> {
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

  public getServices(apiUrl: string, params?: ParameterFilter): Observable<Service[]> {
    return this.createServices(apiUrl);
  }

  public getCategories(url: string, filter: ParameterFilter): Observable<Category[]> {
    return this.sta.aggregatePaging(this.sta.getObservedProperties(url, this.createCategoriesFilter(filter)))
      .pipe(map(obProps => obProps.value.map(e => this.createCategory(e))));
  }

  public getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category> {
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createCategory(prop)));
  }

  public getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]> {
    return this.sta.aggregatePaging(this.sta.getThings(url, this.createOfferingsFilter(filter)))
      .pipe(map(things => things.value.map(t => this.createOffering(t))));
  }

  private createOfferingsFilter(params: ParameterFilter): StaFilter<ThingSelectParams, ThingExpandParams> {
    if (params) {
      const filterList = [];
      return this.createFilter(filterList);
    }
  }

  public getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering> {
    return this.sta.getThing(url, id).pipe(map(t => this.createOffering(t)));
  }

  public getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]> {
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

  public getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon> {
    return this.sta.getObservedProperty(url, id).pipe(map(prop => this.createPhenomenon(prop)));
  }

  public getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]> {
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

  public getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure> {
    return this.sta.getSensor(url, id).pipe(map(sensor => this.createProcedure(sensor)));
  }

  public getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]> {
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

  public getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature> {
    return this.sta.getLocation(url, id).pipe(map(loc => this.createFeature(loc)));
  }

  public getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.sta.aggregatePaging(this.sta.getLocations(url, this.createStationFilter(filter)))
      .pipe(map(locs => locs.value.map(e => this.createStation(e))));
  }

  public getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
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
    if (first) { ts.firstValue = first; }
    if (last) { ts.lastValue = last; }
    ts.referenceValues = [];
    return ts;
  }

  private createData<T>(observations: Observation[], params: DataParameterFilter = {}): Data<T> {
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
