import { Observable } from 'rxjs';

import { HttpRequestOptions } from '../../../../model/internal/http-requests';
import {
  Datastream,
  DatastreamExpandParams,
  DatastreamSelectParams,
} from './datasetreams';
import {
  FeatureOfInterest,
  FeatureOfInterestExpandParams,
  FeatureOfInterestSelectParams,
} from './features-of-interest';
import {
  HistoricalLocation,
  HistoricalLocationExpandParams,
  HistoricalLocationSelectParams,
} from './historical-locations';
import {
  Location,
  LocationExpandParams,
  LocationSelectParams,
} from './locations';
import {
  Observation,
  ObservationExpandParams,
  ObservationSelectParams,
} from './observations';
import {
  ObservedProperty,
  ObservedPropertyExpandParams,
  ObservedPropertySelectParams,
} from './observed-properties';
import { Sensor, SensorExpandParams, SensorSelectParams } from './sensors';
import { Thing, ThingExpandParams, ThingSelectParams } from './things';

export enum StaEndpoint {
  Things = 'Things',
  Observations = 'Observations',
  HistoricalLocations = 'HistoricalLocations',
  Locations = 'Locations',
  Sensors = 'Sensors',
  FeaturesOfInterest = 'FeaturesOfInterest',
  ObservedProperties = 'ObservedProperties',
  Datastreams = 'Datastreams',
}

export interface StaObject {
  '@iot.selfLink'?: string;
  '@iot.id'?: string;
}

export interface InsertId {
  '@iot.id': string;
}

export interface StaSelectParams {
  [key: string]: any;
}

export interface StaValueListResponse<T extends StaObject> {
  '@iot.count': number;
  '@iot.nextLink'?: string;
  value: T[];
}

export interface StaExpandParams {
  [key: string]: any;
}

export interface StaFilter<
  S extends StaSelectParams,
  E extends StaExpandParams,
> {
  $select?: S;
  $expand?: E | string;
  $orderby?: string;
  $filter?: string;
  $count?: boolean;
  $top?: number;
}

export interface StaReadInterface {
  getThings(
    url: string,
    params?: StaFilter<ThingSelectParams, ThingExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<Thing>>;
  getThing(
    url: string,
    id: string,
    params?: StaFilter<ThingSelectParams, ThingExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<Thing>;

  getObservations(
    url: string,
    params?: StaFilter<ObservationSelectParams, ObservationExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<Observation>>;
  getObservation(
    url: string,
    id: string,
    params?: StaFilter<ObservationSelectParams, ObservationExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<Observation>;

  getHistoricalLocations(
    url: string,
    params?: StaFilter<
      HistoricalLocationSelectParams,
      HistoricalLocationExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<HistoricalLocation>>;
  getHistoricalLocation(
    url: string,
    id: string,
    params?: StaFilter<
      HistoricalLocationSelectParams,
      HistoricalLocationExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<HistoricalLocation>;

  getLocations(
    url: string,
    params?: StaFilter<LocationSelectParams, LocationExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<Location>>;
  getLocation(
    url: string,
    id: string,
    params?: StaFilter<LocationSelectParams, LocationExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<Location>;

  getSensors(
    url: string,
    params?: StaFilter<SensorSelectParams, SensorExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<Sensor>>;
  getSensor(
    url: string,
    id: string,
    params?: StaFilter<SensorSelectParams, SensorExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<Sensor>;

  getFeaturesOfInterest(
    url: string,
    params?: StaFilter<
      FeatureOfInterestSelectParams,
      FeatureOfInterestExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<FeatureOfInterest>>;
  getFeatureOfInterest(
    url: string,
    id: string,
    params?: StaFilter<
      FeatureOfInterestSelectParams,
      FeatureOfInterestExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<FeatureOfInterest>;

  getObservedProperties(
    url: string,
    params?: StaFilter<
      ObservedPropertySelectParams,
      ObservedPropertyExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<ObservedProperty>>;
  getObservedProperty(
    url: string,
    id: string,
    params?: StaFilter<
      ObservedPropertySelectParams,
      ObservedPropertyExpandParams
    >,
    options?: HttpRequestOptions,
  ): Observable<ObservedProperty>;

  getDatastreams(
    url: string,
    params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<StaValueListResponse<Datastream>>;
  getDatastream(
    url: string,
    id: string,
    params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>,
    options?: HttpRequestOptions,
  ): Observable<Datastream>;
}

export interface StaDeleteInterface {
  deleteThing(url: string, id: string): Observable<void>;

  deleteObservation(url: string, id: string): Observable<void>;

  deleteHistoricalLocation(url: string, id: string): Observable<void>;

  deleteLocation(url: string, id: string): Observable<void>;

  deleteSensor(url: string, id: string): Observable<void>;

  deleteFeatureOfInterest(url: string, id: string): Observable<void>;

  deleteObservedProperty(url: string, id: string): Observable<void>;

  deleteDatastream(url: string, id: string): Observable<void>;
}

export interface StaInsertInterface {
  insertThing(url: string, thing: Thing): Observable<any>;
}
