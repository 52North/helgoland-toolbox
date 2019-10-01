import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UriParameterCoder } from '../../dataset-api/api-interface';
import { HttpService } from '../../dataset-api/http.service';
import { HttpRequestOptions } from '../../model/internal/http-requests';
import { Datastream, DatastreamExpandParams, DatastreamSelectParams } from '../model/datasetreams';
import {
  FeatureOfInterest,
  FeatureOfInterestExpandParams,
  FeatureOfInterestSelectParams,
} from '../model/features-of-interest';
import {
  HistoricalLocation,
  HistoricalLocationExpandParams,
  HistoricalLocationSelectParams,
} from '../model/historical-locations';
import { Location, LocationExpandParams, LocationSelectParams } from '../model/locations';
import { Observation, ObservationExpandParams, ObservationSelectParams } from '../model/observations';
import { ObservedProperty, ObservedPropertyExpandParams, ObservedPropertySelectParams } from '../model/observed-properties';
import { Sensor, SensorExpandParams, SensorSelectParams } from '../model/sensors';
import {
  StaEndpoint,
  StaExpandParams,
  StaFilter,
  StaReadInterface,
  StaSelectParams,
  StaValueListResponse,
} from '../model/sta-interface';
import { Thing, ThingExpandParams, ThingSelectParams } from '../model/things';

@Injectable({ providedIn: 'root' })
export class StaReadInterfaceService implements StaReadInterface {

  constructor(
    protected httpService: HttpService
  ) { }

  getThings(apiUrl: string, params?: StaFilter<ThingSelectParams, ThingExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Thing>> {
    return this.requestApi<StaValueListResponse<Thing>>(this.createRequestUrl(apiUrl, StaEndpoint.Things), {}, params, options);
  }

  getThing(apiUrl: string, id: string, params?: StaFilter<ThingSelectParams, ThingExpandParams>, options?: HttpRequestOptions): Observable<Thing> {
    return this.requestApi<Thing>(this.createRequestUrl(apiUrl, StaEndpoint.Things, id), {}, params, options);
  }

  getObservations(apiUrl: string, params?: StaFilter<ObservationSelectParams, ObservationExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Observation>> {
    return this.requestApi<StaValueListResponse<Observation>>(this.createRequestUrl(apiUrl, StaEndpoint.Observations), {}, params, options);
  }

  getObservation(apiUrl: string, id: string, params?: StaFilter<ObservationSelectParams, ObservationExpandParams>, options?: HttpRequestOptions): Observable<Observation> {
    return this.requestApi<Observation>(this.createRequestUrl(apiUrl, StaEndpoint.Observations, id), {}, params, options);
  }

  getHistoricalLocations(apiUrl: string, params?: StaFilter<HistoricalLocationSelectParams, HistoricalLocationExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<HistoricalLocation>> {
    return this.requestApi<StaValueListResponse<HistoricalLocation>>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations), {}, params, options);
  }

  getHistoricalLocation(apiUrl: string, id: string, params?: StaFilter<HistoricalLocationSelectParams, HistoricalLocationExpandParams>, options?: HttpRequestOptions): Observable<HistoricalLocation> {
    return this.requestApi<HistoricalLocation>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations, id), {}, params, options);
  }

  getLocations(apiUrl: string, params?: StaFilter<LocationSelectParams, LocationExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Location>> {
    return this.requestApi<StaValueListResponse<Location>>(this.createRequestUrl(apiUrl, StaEndpoint.Locations), {}, params, options);
  }

  getLocation(apiUrl: string, id: string, params?: StaFilter<LocationSelectParams, LocationExpandParams>, options?: HttpRequestOptions): Observable<Location> {
    return this.requestApi<Location>(this.createRequestUrl(apiUrl, StaEndpoint.Locations, id), {}, params, options);
  }

  getSensors(apiUrl: string, params?: StaFilter<SensorSelectParams, SensorExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Sensor>> {
    return this.requestApi<StaValueListResponse<Sensor>>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors), {}, params, options);
  }

  getSensor(apiUrl: string, id: string, params?: StaFilter<SensorSelectParams, SensorExpandParams>, options?: HttpRequestOptions): Observable<Sensor> {
    return this.requestApi<Sensor>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors, id), {}, params, options);
  }

  getFeaturesOfInterest(apiUrl: string, params?: StaFilter<FeatureOfInterestSelectParams, FeatureOfInterestExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<FeatureOfInterest>> {
    return this.requestApi<StaValueListResponse<FeatureOfInterest>>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest), {}, params, options);
  }

  getFeatureOfInterest(apiUrl: string, id: string, params?: StaFilter<FeatureOfInterestSelectParams, FeatureOfInterestExpandParams>, options?: HttpRequestOptions): Observable<FeatureOfInterest> {
    return this.requestApi<FeatureOfInterest>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest, id), {}, params, options);
  }

  getObservedProperties(apiUrl: string, params?: StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<ObservedProperty>> {
    return this.requestApi<StaValueListResponse<ObservedProperty>>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties), {}, params, options);
  }

  getObservedProperty(apiUrl: string, id: string, params?: StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams>, options?: HttpRequestOptions): Observable<ObservedProperty> {
    return this.requestApi<ObservedProperty>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties, id), {}, params, options);
  }

  getDatastreams(apiUrl: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Datastream>> {
    return this.requestApi<StaValueListResponse<Datastream>>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams), {}, params, options);
  }

  getDatastream(apiUrl: string, id: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions): Observable<Datastream> {
    return this.requestApi<Datastream>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams, id), {}, params, options);
  }

  protected requestApi<T>(
    url: string,
    params: { [key: string]: string } = {},
    filter: StaFilter<StaSelectParams, StaExpandParams> = {},
    options: HttpRequestOptions = {}
  ): Observable<T> {
    return this.httpService.client(options).get<T>(url,
      {
        params: this.prepareParams(params, filter)
      }
    );
  }

  protected prepareParams(
    params: { [key: string]: string } = {},
    filter: StaFilter<StaSelectParams, StaExpandParams> = {}
  ): HttpParams {
    let httpParams = new HttpParams({ encoder: new UriParameterCoder() });
    Object.getOwnPropertyNames(params).forEach((key) => httpParams = httpParams.set(key, params[key]));
    if (filter.$expand) {
      const $expand = [];
      for (const key in filter.$expand) {
        if (filter.$expand.hasOwnProperty(key) && filter.$expand[key]) {
          $expand.push(key);
        }
      }
      httpParams = httpParams.set('$expand', $expand.join(','));
    }
    if (filter.$select) {
      const $select = [];
      for (const key in filter.$select) {
        if (filter.$select.hasOwnProperty(key) && filter.$select[key]) {
          $select.push(key);
        }
      }
      httpParams = httpParams.set('$select', $select.join(','));
    }
    return httpParams;
  }

  protected createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
    // TODO: Check whether apiUrl ends with slash
    if (id !== null && id !== undefined) {
      return `${apiUrl}${endpoint}('${id}')`;
    } else {
      return `${apiUrl}${endpoint}`;
    }
  }

}
