import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { TimeValueTuple } from '../../../model/dataset-api/data';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { IHelgolandServiceConnectorHandler } from '../../interfaces/service-handler.interface';
import { HelgolandData, HelgolandDataFilter, HelgolandTimeseriesData } from '../../model/internal/data';
import { DatasetExtras, DatasetFilter, HelgolandDataset } from '../../model/internal/dataset';
import { HelgolandStation } from '../../model/internal/station';
import { HttpService } from './../../../dataset-api/http.service';
import { FirstLastValue, IDataset, Timeseries } from './../../../model/dataset-api/dataset';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from './../../helgoland-services-handler.service';
import { HelgolandTimeseries } from './../../model/internal/dataset';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV1Service implements IHelgolandServiceConnectorHandler {

  constructor(
    protected http: HttpService,
    protected api: DatasetApiInterface
  ) { }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map(res => {
        if (res instanceof Array) {
          // check if endpoint 'trajectories' not exists
          return res.findIndex(e => e.id === 'trajectories') === -1 && res.findIndex(e => e.id === 'platforms') === -1;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  getServices(url: string, filter: ParameterFilter): Observable<Service[]> {
    return this.api.getServices(url, filter);
  }

  getCategories(url: string, filter: ParameterFilter): Observable<Category[]> {
    return this.api.getCategories(url, filter);
  }

  getCategory(id: string, url: string, filter: ParameterFilter): Observable<Category> {
    return this.api.getCategory(id, url, filter);
  }

  getOfferings(url: string, filter: ParameterFilter): Observable<Offering[]> {
    return this.api.getOfferings(url, filter);
  }

  getOffering(id: string, url: string, filter: ParameterFilter): Observable<Offering> {
    return this.api.getOffering(id, url, filter);
  }

  getPhenomena(url: string, filter: ParameterFilter): Observable<Phenomenon[]> {
    return this.api.getPhenomena(url, filter);
  }

  getPhenomenon(id: string, url: string, filter: ParameterFilter): Observable<Phenomenon> {
    return this.api.getPhenomenon(id, url, filter);
  }

  getProcedures(url: string, filter: ParameterFilter): Observable<Procedure[]> {
    return this.api.getProcedures(url, filter);
  }

  getProcedure(id: string, url: string, filter: ParameterFilter): Observable<Procedure> {
    return this.api.getProcedure(id, url, filter);
  }

  getFeatures(url: string, filter: ParameterFilter): Observable<Feature[]> {
    return this.api.getFeatures(url, filter);
  }

  getFeature(id: string, url: string, filter: ParameterFilter): Observable<Feature> {
    return this.api.getFeature(id, url, filter);
  }

  getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getStations(url, filter);
  }

  getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getStation(id, url, filter);
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getTimeseries(url, filter)
      .pipe(map(res => res.map(e => this.mapTimeseries(e, url, filter))));
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    return this.api.getSingleTimeseries(internalId.id, internalId.url, filter)
      .pipe(map(res => this.createHelgolandTimeseries(res, internalId.url)));
  }

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    return this.api.getTsData<TimeValueTuple>(dataset.id, dataset.url, timespan, { format: 'flot' }).pipe(map(res => {
      const data = new HelgolandTimeseriesData(res.values);
      data.referenceValues = res.referenceValues ? res.referenceValues : {};
      if (res.valueBeforeTimespan) { data.valueBeforeTimespan = res.valueBeforeTimespan; }
      if (res.valueAfterTimespan) { data.valueAfterTimespan = res.valueAfterTimespan; }
      return data;
    }));
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return this.api.getTimeseriesExtras(internalId.id, internalId.url);
  }

  protected mapTimeseries(res: IDataset, url: string, filter: DatasetFilter): HelgolandDataset {
    if (filter.expanded) {
      if (res instanceof Timeseries && res.firstValue) {
        return new HelgolandTimeseries(res.id, url, res.label, res.uom, res.station, res.firstValue, res.lastValue, res.referenceValues, res.renderingHints, res.parameters);
      }
    }
    return new HelgolandDataset(res.id, url, res.label);
  }

  protected createHelgolandTimeseries(res: Timeseries, url: string): HelgolandTimeseries {
    let firstValue: FirstLastValue, lastValue: FirstLastValue;
    if (res.firstValue) { firstValue = res.firstValue; }
    if (res.lastValue) { lastValue = res.lastValue; }
    const station = this.createHelgolandStation(res.station);
    return new HelgolandTimeseries(
      res.id,
      url,
      res.label,
      res.uom,
      station,
      firstValue,
      lastValue,
      res.referenceValues,
      res.renderingHints,
      res.parameters
    );
  }

  // private createStationFilter(filter: HelgolandStationFilter): ParameterFilter {
  //   const paramFilter: ParameterFilter = {};
  //   if (filter.phenomenon) { paramFilter.phenomenon = filter.phenomenon; }
  //   return paramFilter;
  // }

  protected createHelgolandStation(station: Station): HelgolandStation {
    return new HelgolandStation(station.id, station.properties.label, station.geometry);
  }

}

export const DatasetApiV1ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV1Service,
  multi: true
};
