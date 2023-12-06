import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";

import { UriParameterCoder } from "../../../dataset-api/api-interface";
import { HttpService } from "../../../dataset-api/http.service";
import { HttpRequestOptions } from "../../../model/internal/http-requests";
import { Datastream, DatastreamExpandParams, DatastreamSelectParams, InsertDatastream } from "./model/datasetreams";
import {
  FeatureOfInterest,
  FeatureOfInterestExpandParams,
  FeatureOfInterestSelectParams,
  InsertFeatureOfInterest,
} from "./model/features-of-interest";
import {
  HistoricalLocation,
  HistoricalLocationExpandParams,
  HistoricalLocationSelectParams,
  InsertHistoricalLocation,
} from "./model/historical-locations";
import { InsertLocation, Location, LocationExpandParams, LocationSelectParams } from "./model/locations";
import { InsertObservation, Observation, ObservationExpandParams, ObservationSelectParams } from "./model/observations";
import { InsertObservedProperty, ObservedProperty, ObservedPropertyExpandParams, ObservedPropertySelectParams } from "./model/observed-properties";
import { InsertSensor, Sensor, SensorExpandParams, SensorSelectParams } from "./model/sensors";
import {
  StaEndpoint,
  StaExpandParams,
  StaFilter,
  StaObject,
  StaSelectParams,
  StaValueListResponse,
} from "./model/sta-interface";
import { InsertThing, Thing, ThingExpandParams, ThingSelectParams } from "./model/things";

@Injectable({ providedIn: "root" })
export class StaInterfaceService {

  constructor(
    protected httpService: HttpService
  ) { }

  getThings(url: string, params?: StaFilter<ThingSelectParams, ThingExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Thing>> {
    return this.requestApi<StaValueListResponse<Thing>>(this.createRequestUrl(url, StaEndpoint.Things), {}, params, options);
  }

  getThing(url: string, id: string, params?: StaFilter<ThingSelectParams, ThingExpandParams>, options?: HttpRequestOptions): Observable<Thing> {
    return this.requestApi<Thing>(this.createRequestUrl(url, StaEndpoint.Things, id), {}, params, options);
  }

  deleteThing(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Things, id));
  }

  updateThing(apiUrl: string, id: string, thing: InsertThing): Observable<Thing> {
    return this.httpService.client().put<Thing>(this.createRequestUrl(apiUrl, StaEndpoint.Things, id), thing);
  }

  insertThing(apiUrl: string, thing: InsertThing): Observable<Thing> {
    return this.httpService.client().post<Thing>(this.createRequestUrl(apiUrl, StaEndpoint.Things), thing);
  }

  getObservations(url: string, params?: StaFilter<ObservationSelectParams, ObservationExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Observation>> {
    return this.requestApi<StaValueListResponse<Observation>>(this.createRequestUrl(url, StaEndpoint.Observations), {}, params, options);
  }

  getObservation(url: string, id: string, params?: StaFilter<ObservationSelectParams, ObservationExpandParams>, options?: HttpRequestOptions): Observable<Observation> {
    return this.requestApi<Observation>(this.createRequestUrl(url, StaEndpoint.Observations, id), {}, params, options);
  }

  deleteObservation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Things, id));
  }

  updateObservation(apiUrl: string, id: string, observation: InsertObservation): Observable<Observation> {
    return this.httpService.client().put<Observation>(this.createRequestUrl(apiUrl, StaEndpoint.Observations, id), observation);
  }

  insertObservation(apiUrl: string, observation: InsertObservation): Observable<Observation> {
    return this.httpService.client().post<Observation>(this.createRequestUrl(apiUrl, StaEndpoint.Observations), observation);
  }

  getHistoricalLocations(url: string, params?: StaFilter<HistoricalLocationSelectParams, HistoricalLocationExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<HistoricalLocation>> {
    return this.requestApi<StaValueListResponse<HistoricalLocation>>(this.createRequestUrl(url, StaEndpoint.HistoricalLocations), {}, params, options);
  }

  getHistoricalLocation(url: string, id: string, params?: StaFilter<HistoricalLocationSelectParams, HistoricalLocationExpandParams>, options?: HttpRequestOptions): Observable<HistoricalLocation> {
    return this.requestApi<HistoricalLocation>(this.createRequestUrl(url, StaEndpoint.HistoricalLocations, id), {}, params, options);
  }

  deleteHistoricalLocation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.HistoricalLocations, id));
  }

  updateHistoricalLocation(apiUrl: string, id: string, historicalLocation: InsertHistoricalLocation): Observable<HistoricalLocation> {
    return this.httpService.client().put<HistoricalLocation>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations, id), historicalLocation);
  }

  insertHistoricalLocation(apiUrl: string, historicalLocation: InsertHistoricalLocation): Observable<HistoricalLocation> {
    return this.httpService.client().post<HistoricalLocation>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations), historicalLocation);
  }

  getLocations(url: string, params?: StaFilter<LocationSelectParams, LocationExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Location>> {
    return this.requestApi<StaValueListResponse<Location>>(this.createRequestUrl(url, StaEndpoint.Locations), {}, params, options);
  }

  getLocation(url: string, id: string, params?: StaFilter<LocationSelectParams, LocationExpandParams>, options?: HttpRequestOptions): Observable<Location> {
    return this.requestApi<Location>(this.createRequestUrl(url, StaEndpoint.Locations, id), {}, params, options);
  }

  deleteLocation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Locations, id));
  }

  updateLocation(apiUrl: string, id: string, location: InsertLocation): Observable<Location> {
    return this.httpService.client().put<Location>(this.createRequestUrl(apiUrl, StaEndpoint.Locations, id), location);
  }

  insertLocation(apiUrl: string, location: InsertLocation): Observable<Location> {
    return this.httpService.client().post<Location>(this.createRequestUrl(apiUrl, StaEndpoint.Locations), location);
  }

  getSensors(url: string, params?: StaFilter<SensorSelectParams, SensorExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Sensor>> {
    return this.requestApi<StaValueListResponse<Sensor>>(this.createRequestUrl(url, StaEndpoint.Sensors), {}, params, options);
  }

  getSensor(url: string, id: string, params?: StaFilter<SensorSelectParams, SensorExpandParams>, options?: HttpRequestOptions): Observable<Sensor> {
    return this.requestApi<Sensor>(this.createRequestUrl(url, StaEndpoint.Sensors, id), {}, params, options);
  }

  deleteSensor(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Sensors, id));
  }

  updateSensor(apiUrl: string, id: string, sensor: InsertSensor): Observable<Sensor> {
    return this.httpService.client().put<Sensor>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors, id), sensor);
  }

  insertSensor(apiUrl: string, sensor: InsertSensor): Observable<Sensor> {
    return this.httpService.client().post<Sensor>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors), sensor);
  }

  getFeaturesOfInterest(url: string, params?: StaFilter<FeatureOfInterestSelectParams, FeatureOfInterestExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<FeatureOfInterest>> {
    return this.requestApi<StaValueListResponse<FeatureOfInterest>>(this.createRequestUrl(url, StaEndpoint.FeaturesOfInterest), {}, params, options);
  }

  getFeatureOfInterest(url: string, id: string, params?: StaFilter<FeatureOfInterestSelectParams, FeatureOfInterestExpandParams>, options?: HttpRequestOptions): Observable<FeatureOfInterest> {
    return this.requestApi<FeatureOfInterest>(this.createRequestUrl(url, StaEndpoint.FeaturesOfInterest, id), {}, params, options);
  }

  deleteFeatureOfInterest(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.FeaturesOfInterest, id));
  }  

  updateFeatureOfInterest(apiUrl: string, id: string, featureOfInterest: InsertFeatureOfInterest): Observable<FeatureOfInterest> {
    return this.httpService.client().put<FeatureOfInterest>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest, id), featureOfInterest);
  }

  insertFeatureOfInterest(apiUrl: string, featureOfInterest: InsertFeatureOfInterest): Observable<FeatureOfInterest> {
    return this.httpService.client().post<FeatureOfInterest>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest), featureOfInterest);
  }

  getObservedProperties(url: string, params?: StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams>, options?: HttpRequestOptions)
    : Observable<StaValueListResponse<ObservedProperty>> {
    return this.requestApi<StaValueListResponse<ObservedProperty>>(this.createRequestUrl(url, StaEndpoint.ObservedProperties), {}, params, options);
  }

  getObservedProperty(url: string, id: string, params?: StaFilter<ObservedPropertySelectParams, ObservedPropertyExpandParams>, options?: HttpRequestOptions): Observable<ObservedProperty> {
    return this.requestApi<ObservedProperty>(this.createRequestUrl(url, StaEndpoint.ObservedProperties, id), {}, params, options);
  }

  deleteObservedProperty(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.ObservedProperties, id));
  }

  updateObservedProperty(apiUrl: string, id: string, observedProperty: InsertObservedProperty): Observable<ObservedProperty> {
    return this.httpService.client().put<ObservedProperty>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties, id), observedProperty);
  }

  insertObservedProperty(apiUrl: string, observedProperty: InsertObservedProperty): Observable<ObservedProperty> {
    return this.httpService.client().post<ObservedProperty>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties), observedProperty);
  }

  getDatastreams(url: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions): Observable<StaValueListResponse<Datastream>> {
    return this.requestApi<StaValueListResponse<Datastream>>(this.createRequestUrl(url, StaEndpoint.Datastreams), {}, params, options);
  }

  getDatastream(url: string, id: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions): Observable<Datastream> {
    return this.requestApi<Datastream>(this.createRequestUrl(url, StaEndpoint.Datastreams, id), {}, params, options);
  }

  getDatastreamsByNavigationLink(
    url: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions
  ): Observable<StaValueListResponse<Datastream>> {
    return this.requestApi<StaValueListResponse<Datastream>>(url, {}, params, options);
  }

  // TODO: make function more generic
  getDatastreamObservationsRelation(
    url: string, id: string, params?: StaFilter<DatastreamSelectParams, DatastreamExpandParams>, options?: HttpRequestOptions
  ): Observable<StaValueListResponse<Observation>> {
    return this.requestApi<StaValueListResponse<Observation>>(this.createRequestUrl(url, StaEndpoint.Datastreams, id, "Observations"), {}, params, options);
  }

  deleteDatastream(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Datastreams, id));
  }

  updateDatastream(apiUrl: string, id: string, datastream: InsertDatastream): Observable<Datastream> {
    return this.httpService.client().put<Datastream>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams, id), datastream);
  }

  insertDatastream(apiUrl: string, datastream: InsertDatastream): Observable<Datastream> {
    return this.httpService.client().post<Datastream>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams), datastream);
  }

  public aggregatePaging<T extends StaObject>(request: Observable<StaValueListResponse<T>>): Observable<StaValueListResponse<T>> {
    return new Observable((observer: Observer<StaValueListResponse<T>>) => {
      request.subscribe({
        next: res => {
          if (res["@iot.nextLink"]) {
            this.aggregatePaging(this.httpService.client().get<StaValueListResponse<T>>(res["@iot.nextLink"])).subscribe(nextPage => {
              res.value.push(...nextPage.value);
              delete res["@iot.nextLink"];
              observer.next(res);
              observer.complete();
            });
          } else {
            observer.next(res);
            observer.complete();
          }
        },
        error: error => {
          observer.error(error);
          observer.complete();
        }
      })
    })
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
      if (typeof filter.$expand === "string") {
        httpParams = httpParams.set("$expand", filter.$expand);
      } else {
        const $expand = [];
        for (const key in filter.$expand as StaExpandParams) {
          if (filter.$expand.hasOwnProperty(key) && filter.$expand[key]) {
            $expand.push(key);
          }
        }
        httpParams = httpParams.set("$expand", $expand.join(","));
      }
    }
    if (filter.$select) {
      const $select = [];
      for (const key in filter.$select) {
        if (filter.$select.hasOwnProperty(key) && filter.$select[key]) {
          $select.push(key);
        }
      }
      httpParams = httpParams.set("$select", $select.join(","));
    }
    if (filter.$orderby) {
      httpParams = httpParams.set("$orderby", filter.$orderby);
    }
    if (filter.$filter) {
      httpParams = httpParams.set("$filter", filter.$filter);
    }
    if (filter.$count) {
      httpParams = httpParams.set("$count", "true");
    }
    if (filter.$top !== undefined) {
      httpParams = httpParams.set("$top", filter.$top.toString());
    }
    return httpParams;
  }

  protected createRequestUrl(url: string, endpoint: string, id?: string, relation?: string) {
    let requestStub = `${url}${endpoint}`;
    if (id !== null && id !== undefined) {
      requestStub += `(${id})`;
      if (relation !== undefined) {
        requestStub += `/${relation}`;
      }
    }
    return requestStub;
  }

}
