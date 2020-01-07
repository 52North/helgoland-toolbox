import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { InternalDatasetId, InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Parameter } from '../../../model/dataset-api/parameter';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { DatasetFilter, HelgolandDataset } from '../../model/internal/dataset';
import { HttpService } from './../../../dataset-api/http.service';
import { FirstLastValue, Timeseries } from './../../../model/dataset-api/dataset';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from './../../helgoland-services-handler.service';
import { HelgolandTimeseries } from './../../model/internal/dataset';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV1Service implements IHelgolandServiceConnectorHandler {

  constructor(
    private http: HttpService,
    private api: DatasetApiInterface,
    private internalIdHandler: InternalIdHandler
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

  public getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]> {
    return this.api.getOfferings(url, filter);
  }

  public getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering> {
    return this.api.getOffering(id, url, filter);
  }

  public getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]> {
    return this.api.getPhenomena(url, filter);
  }

  public getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon> {
    return this.api.getPhenomenon(id, url, filter);
  }

  public getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]> {
    return this.api.getProcedures(url, filter);
  }

  public getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure> {
    return this.api.getProcedure(id, url, filter);
  }

  public getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]> {
    return this.api.getFeatures(url, filter);
  }

  public getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature> {
    return this.api.getFeature(id, url, filter);
  }

  public getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getStations(url, filter);
  }

  public getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getStation(id, url, filter);
  }

  public getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getTimeseries(url, filter)
      .pipe(map(res => res.map(e => this.createDataset(e, url))));
  }

  public getDataset(internalId: InternalDatasetId): Observable<HelgolandDataset> {
    if (typeof internalId === 'string') {
      internalId = this.internalIdHandler.resolveInternalId(internalId);
    }
    return this.api.getSingleTimeseries(internalId.id, internalId.url)
      .pipe(map(res => this.createTimeseries(res, internalId.url)));
  }

  private createDataset(res: Timeseries, url: string): HelgolandDataset {
    return new HelgolandDataset(res.id, url, res.label);
  }

  private createTimeseries(res: Timeseries, url: string): HelgolandDataset {
    let firstValue: FirstLastValue, lastValue: FirstLastValue, feature: Parameter, phenomenon: Parameter, offering: Parameter;
    if (res.firstValue) { firstValue = res.firstValue; }
    if (res.lastValue) { lastValue = res.lastValue; }
    if (res.parameters && res.parameters.feature) { feature = res.parameters.feature; }
    if (res.parameters && res.parameters.phenomenon) { phenomenon = res.parameters.phenomenon; }
    if (res.parameters && res.parameters.offering) { offering = res.parameters.offering; }
    return new HelgolandTimeseries(
      res.id,
      url,
      res.label,
      res.uom,
      firstValue,
      lastValue,
      feature,
      phenomenon,
      offering
    );
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

export const DatasetApiV1ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV1Service,
  multi: true
};
