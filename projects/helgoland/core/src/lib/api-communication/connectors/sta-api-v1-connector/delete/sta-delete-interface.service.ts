import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../../dataset-api/http.service';
import { StaDeleteInterface, StaEndpoint } from '../model/sta-interface';

@Injectable()
export class StaDeleteInterfaceService implements StaDeleteInterface {

  constructor(
    protected httpService: HttpService
  ) { }

  deleteThing(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Things, id));
  }

  deleteObservation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Things, id));
  }

  deleteHistoricalLocation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.HistoricalLocations, id));
  }

  deleteLocation(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Locations, id));
  }

  deleteSensor(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Sensors, id));
  }

  deleteFeatureOfInterest(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.FeaturesOfInterest, id));
  }

  deleteObservedProperty(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.ObservedProperties, id));
  }

  deleteDatastream(url: string, id: string): Observable<any> {
    return this.httpService.client().delete(this.createRequestUrl(url, StaEndpoint.Datastreams, id));
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
