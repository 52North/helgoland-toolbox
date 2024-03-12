import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Datastream, InsertDatastream } from "../model/datasetreams";
import { FeatureOfInterest, InsertFeatureOfInterest } from "../model/features-of-interest";
import { HistoricalLocation, InsertHistoricalLocation } from "../model/historical-locations";
import { InsertLocation, Location } from "../model/locations";
import { InsertObservation, Observation } from "../model/observations";
import { InsertObservedProperty, ObservedProperty } from "../model/observed-properties";
import { InsertSensor, Sensor } from "../model/sensors";
import { StaEndpoint } from "../model/sta-interface";
import { InsertThing, Thing } from "../model/things";

@Injectable()
export class StaUpdateInterfaceService {

  constructor(
    protected http: HttpClient
  ) { }

  updateDatastream(apiUrl: string, id: string, datastream: InsertDatastream): Observable<Datastream> {
    return this.http.put<Datastream>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams, id), datastream);
  }

  updateFeatureOfInterest(apiUrl: string, id: string, featureOfInterest: InsertFeatureOfInterest): Observable<FeatureOfInterest> {
    return this.http.put<FeatureOfInterest>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest, id), featureOfInterest);
  }

  updateHistoricalLocation(apiUrl: string, id: string, historicalLocation: InsertHistoricalLocation): Observable<HistoricalLocation> {
    return this.http.put<HistoricalLocation>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations, id), historicalLocation);
  }

  updateLocation(apiUrl: string, id: string, location: InsertLocation): Observable<Location> {
    return this.http.put<Location>(this.createRequestUrl(apiUrl, StaEndpoint.Locations, id), location);
  }

  updateObservation(apiUrl: string, id: string, observation: InsertObservation): Observable<Observation> {
    return this.http.put<Observation>(this.createRequestUrl(apiUrl, StaEndpoint.Observations, id), observation);
  }

  updateObservedProperty(apiUrl: string, id: string, observedProperty: InsertObservedProperty): Observable<ObservedProperty> {
    return this.http.put<ObservedProperty>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties, id), observedProperty);
  }

  updateSensor(apiUrl: string, id: string, sensor: InsertSensor): Observable<Sensor> {
    return this.http.put<Sensor>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors, id), sensor);
  }

  updateThing(apiUrl: string, id: string, thing: InsertThing): Observable<Thing> {
    return this.http.put<Thing>(this.createRequestUrl(apiUrl, StaEndpoint.Things, id), thing);
  }

  protected createRequestUrl(apiUrl: string, endpoint: string, id: string) {
    // TODO: Check whether apiUrl ends with slash
    if (id !== null && id !== undefined) {
      return `${apiUrl}${endpoint}(${id})`;
    } else {
      return `${apiUrl}${endpoint}`;
    }
  }

}
