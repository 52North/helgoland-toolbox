import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Datastream, InsertDatastream } from '../model/datasetreams';
import { FeatureOfInterest, InsertFeatureOfInterest } from '../model/features-of-interest';
import { InsertLocation, Location } from '../model/locations';
import { InsertObservation, Observation } from '../model/observations';
import { StaEndpoint, StaInsertInterface } from '../model/sta-interface';
import { InsertThing, Thing } from '../model/things';
import { HistoricalLocation, InsertHistoricalLocation } from './../model/historical-locations';
import { InsertObservedProperty, ObservedProperty } from './../model/observed-properties';
import { InsertSensor, Sensor } from './../model/sensors';

@Injectable()
export class StaInsertInterfaceService implements StaInsertInterface {

  constructor(
    protected http: HttpClient
  ) { }

  insertDatastream(apiUrl: string, datastream: InsertDatastream): Observable<Datastream> {
    return this.http.post<Datastream>(this.createRequestUrl(apiUrl, StaEndpoint.Datastreams), datastream);
  }

  insertFeatureOfInterest(apiUrl: string, featureOfInterest: InsertFeatureOfInterest): Observable<FeatureOfInterest> {
    return this.http.post<FeatureOfInterest>(this.createRequestUrl(apiUrl, StaEndpoint.FeaturesOfInterest), featureOfInterest);
  }

  insertHistoricalLocation(apiUrl: string, historicalLocation: InsertHistoricalLocation): Observable<HistoricalLocation> {
    return this.http.post<HistoricalLocation>(this.createRequestUrl(apiUrl, StaEndpoint.HistoricalLocations), historicalLocation);
  }

  insertLocation(apiUrl: string, location: InsertLocation): Observable<Location> {
    return this.http.post<Location>(this.createRequestUrl(apiUrl, StaEndpoint.Locations), location);
  }

  insertObservation(apiUrl: string, observation: InsertObservation): Observable<Observation> {
    return this.http.post<Observation>(this.createRequestUrl(apiUrl, StaEndpoint.Observations), observation);
  }

  insertObservedProperty(apiUrl: string, observedProperty: InsertObservedProperty): Observable<ObservedProperty> {
    return this.http.post<ObservedProperty>(this.createRequestUrl(apiUrl, StaEndpoint.ObservedProperties), observedProperty);
  }

  insertSensor(apiUrl: string, sensor: InsertSensor): Observable<Sensor> {
    return this.http.post<Sensor>(this.createRequestUrl(apiUrl, StaEndpoint.Sensors), sensor);
  }

  insertThing(apiUrl: string, thing: InsertThing): Observable<Thing> {
    return this.http.post<Thing>(this.createRequestUrl(apiUrl, StaEndpoint.Things), thing);
  }

  protected createRequestUrl(apiUrl: string, endpoint: string, id?: string) {
    // TODO: Check whether apiUrl ends with slash
    // apiUrl = 'https://cors-anywhere.herokuapp.com/' + apiUrl;
    if (id !== null && id !== undefined) {
      return `${apiUrl}${endpoint}('${id}')`;
    } else {
      return `${apiUrl}${endpoint}`;
    }
  }

}
