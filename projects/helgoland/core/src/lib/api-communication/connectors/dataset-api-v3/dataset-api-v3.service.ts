import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { ApiV3Feature, ApiV3InterfaceService } from './api-v3-interface.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV3Service implements IHelgolandServiceConnectorHandler {

  constructor(
    private http: HttpService,
    private api: ApiV3InterfaceService
  ) { }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map(res => {
        if (res instanceof Array) {
          // check if endpoint 'platforms' exists
          return res.findIndex(e => e.id === 'platforms') >= 0;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  getServices(url: string, filter: ParameterFilter): Observable<Service[]> {
    filter.expanded = true;
    return this.api.getServices(url, filter);
  }

  getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createStation(f))));
  }

  getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createStation(res)));
  }

  private createFilter(filter: ParameterFilter): ParameterFilter {
    const paramFilter: ParameterFilter = {};
    if (filter.phenomenon) { paramFilter.phenomenon = filter.phenomenon; }
    return paramFilter;
  }

  private createStation(feature: ApiV3Feature): Station {
    return {
      id: feature.id,
      geometry: feature.geometry,
      label: feature.properties.label,
      properties: {
        id: feature.id,
        label: feature.properties.label,
        timeseries: {}
      }
    };
  }

}
