import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Data, TimeValueTuple } from '../../../model/dataset-api/data';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-handler.service';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { DatasetFilter, HelgolandDataset } from '../../model/internal/dataset';
import { FirstLastValue, ParameterConstellation } from './../../../model/dataset-api/dataset';
import { HelgolandData, HelgolandDataFilter, HelgolandTimeseriesData } from './../../model/internal/data';
import { HelgolandTimeseries } from './../../model/internal/dataset';
import {
  ApiV3Category,
  ApiV3Dataset,
  ApiV3DatasetDataFilter,
  ApiV3DatasetFilter,
  ApiV3DatasetTypes,
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

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getDatasets(url, this.createDatasetFilter(filter)).pipe(map(res => res.map(ds => this.createDataset(ds, url))));
  }

  private createDataset(ds: ApiV3Dataset, url: string): HelgolandDataset {
    if (ds.firstValue || ds.lastValue) {
      if (ds.datasetType === ApiV3DatasetTypes.Timeseries) {
        const firstValue: FirstLastValue = { timestamp: new Date(ds.firstValue.timestamp).getTime(), value: ds.firstValue.value };
        const lastValue: FirstLastValue = { timestamp: new Date(ds.lastValue.timestamp).getTime(), value: ds.lastValue.value };
        const parameters: ParameterConstellation = {
          category: { id: ds.parameters.category.id, label: ds.parameters.category.label },
          feature: { id: ds.feature.id, label: ds.feature.properties.label },
          offering: { id: ds.parameters.offering.id, label: ds.parameters.offering.label },
          phenomenon: { id: ds.parameters.phenomenon.id, label: ds.parameters.phenomenon.label },
          procedure: { id: ds.parameters.procedure.id, label: ds.parameters.procedure.label },
          service: { id: ds.parameters.service.id, label: ds.parameters.service.label }
        };
        return new HelgolandTimeseries(ds.id, url, ds.label, ds.uom, firstValue, lastValue, parameters);
      }
    } else {
      return new HelgolandDataset(ds.id, url, ds.label);
    }
  }

  private createDatasetFilter(params: DatasetFilter): ApiV3DatasetFilter {
    const filter: ApiV3DatasetFilter = {};
    if (params.category) { filter.category = params.category; }
    if (params.feature) { filter.feature = params.feature; }
    if (params.offering) { filter.offering = params.offering; }
    if (params.phenomenon) { filter.phenomenon = params.phenomenon; }
    if (params.procedure) { filter.procedure = params.procedure; }
    if (params.expanded) { filter.expanded = params.expanded; }
    return filter;
  }

  getDataset(internalId: InternalDatasetId): Observable<HelgolandDataset> {
    return this.api.getDataset(internalId.id, internalId.url).pipe(map(res => this.createDataset(res, internalId.url)));
  }

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    const params: ApiV3DatasetDataFilter = {
      timespan: this.createRequestTimespan(timespan),
      format: 'flot'
    };
    return this.api.getDatasetData(dataset.id, dataset.url, params).pipe(map(res => this.createDatasetData(dataset, res)));
  }

  protected createRequestTimespan(timespan: Timespan): string {
    return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  createDatasetData(dataset: HelgolandDataset, res: Data<TimeValueTuple>): HelgolandData {
    if (dataset instanceof HelgolandTimeseries) {
      const data = new HelgolandTimeseriesData(res.values);
      data.referenceValues = res.referenceValues ? res.referenceValues : {};
      if (res.valueBeforeTimespan) { data.valueBeforeTimespan = res.valueBeforeTimespan; }
      if (res.valueAfterTimespan) { data.valueAfterTimespan = res.valueAfterTimespan; }
      return data;
    }
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

export const DatasetApiV3ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV3Service,
  multi: true
};
