import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { Category } from '../../../model/dataset-api/category';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { HttpService } from './../../../dataset-api/http.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV1Service implements IHelgolandServiceConnectorHandler {

  constructor(
    private http: HttpService,
    private api: DatasetApiInterface
  ) { }

  public canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map(res => {
        if (res instanceof Array) {
          // check if endpoint 'platforms' not exists
          return res.findIndex(e => e.id === 'platforms') === -1;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  public getServices(url: string, filter: ParameterFilter): Observable<Service[]> {
    return this.api.getServices(url, filter);
  }

  public getCategories(url: string, filter: ParameterFilter): Observable<Category[]> {
    return this.api.getCategories(url, filter);
  }

  public getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category> {
    return this.api.getCategory(id, url, filter);
  }

  public getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getStations(url, filter);
  }

  public getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getStation(id, url, filter);
  }

  // private createStationFilter(filter: HelgolandStationFilter): ParameterFilter {
  //   const paramFilter: ParameterFilter = {};
  //   if (filter.phenomenon) { paramFilter.phenomenon = filter.phenomenon; }
  //   return paramFilter;
  // }

  // private createStation(station: Station): HelgolandStation {
  //   return new HelgolandStation(station.id, station.properties.label, station.geometry);
  // }

}