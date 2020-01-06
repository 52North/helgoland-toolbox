import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { Category } from '../../../model/dataset-api/category';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import {
  ApiV3Category,
  ApiV3Feature,
  ApiV3InterfaceService,
  ApiV3Offering,
  ApiV3Phenomenon,
  ApiV3Procedure,
} from './api-v3-interface.service';

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

  getCategories(url: string, filter: ParameterFilter): Observable<Category[]> {
    return this.api.getCategories(url, this.createFilter(filter)).pipe(map(res => res.map(c => this.createCategory(c))));
  }

  getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category> {
    return this.api.getCategory(id, url, this.createFilter(filter)).pipe(map(res => this.createCategory(res)));
  }

  getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]> {
    return this.api.getOfferings(url, this.createFilter(filter)).pipe(map(res => res.map(o => this.createOffering(o))));
  }

  getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering> {
    return this.api.getOffering(id, url, this.createFilter(filter)).pipe(map(res => this.createOffering(res)));
  }

  getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]> {
    return this.api.getPhenomena(url, this.createFilter(filter)).pipe(map(res => res.map(p => this.createPhenomenon(p))));
  }

  getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon> {
    return this.api.getPhenomenon(id, url, this.createFilter(filter)).pipe(map(res => this.createPhenomenon(res)));
  }

  getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]> {
    return this.api.getProcedures(url, this.createFilter(filter)).pipe(map(res => res.map(p => this.createProcedure(p))));
  }

  getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure> {
    return this.api.getProcedure(id, url, this.createFilter(filter)).pipe(map(res => this.createProcedure(res)));
  }

  getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]> {
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createFeature(f))));
  }

  getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createFeature(res)));
  }

  getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createStation(f))));
  }

  getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createStation(res)));
  }

  private createFilter(filter: ParameterFilter): ParameterFilter {
    const paramFilter: ParameterFilter = {};
    if (filter.category) { paramFilter.category = filter.category; }
    if (filter.offering) { paramFilter.offering = filter.offering; }
    if (filter.phenomenon) { paramFilter.phenomenon = filter.phenomenon; }
    if (filter.procedure) { paramFilter.procedure = filter.procedure; }
    if (filter.feature) { paramFilter.feature = filter.feature; }
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

  private createCategory(category: ApiV3Category): Category {
    return {
      id: category.id,
      label: category.label
    };
  }

  private createOffering(offering: ApiV3Offering): Offering {
    return {
      id: offering.id,
      label: offering.label
    };
  }

  private createPhenomenon(phenomenon: ApiV3Phenomenon): Phenomenon {
    return {
      id: phenomenon.id,
      label: phenomenon.label
    };
  }

  private createProcedure(procedure: ApiV3Procedure): Procedure {
    return {
      id: procedure.id,
      label: procedure.label
    };
  }

  private createFeature(feature: ApiV3Feature): Feature {
    return {
      id: feature.id,
      label: feature.properties.label
    };
  }

}
