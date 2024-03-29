// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { TimeValueTuple } from '../../../model/dataset-api/data';
import {
  FirstLastValue,
  IDataset,
  Timeseries,
} from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { Station } from '../../../model/dataset-api/station';
import {
  DataParameterFilter,
  ParameterFilter,
} from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-connector';
import { UrlGenerator } from '../../helper/url-generator';
import { HelgolandServiceConnector } from '../../interfaces/service-connector-interfaces';
import {
  HelgolandData,
  HelgolandDataFilter,
  HelgolandTimeseriesData,
} from '../../model/internal/data';
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandTimeseries,
} from '../../model/internal/dataset';
import {
  HelgolandCsvExportLinkParams,
  HelgolandParameterFilter,
} from '../../model/internal/filter';
import { HelgolandPlatform } from '../../model/internal/platform';
import { HelgolandService } from '../../model/internal/service';

@Injectable({
  providedIn: 'root',
})
export class DatasetApiV1Connector implements HelgolandServiceConnector {
  name = 'DatasetApiV1Connector';

  constructor(
    protected http: HttpService,
    protected api: DatasetApiInterface,
  ) {}

  canHandle(url: string): Observable<boolean> {
    return this.http
      .client()
      .get(url)
      .pipe(
        map((res) => {
          if (res instanceof Array) {
            // check if endpoint 'trajectories' not exists
            return (
              res.findIndex((e) => e.id === 'trajectories') === -1 &&
              res.findIndex((e) => e.id === 'platforms') === -1
            );
          } else {
            return false;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of(false);
        }),
      );
  }

  getServices(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService[]> {
    return this.api
      .getServices(url, this.createFilter(filter))
      .pipe(map((res) => res.map((s) => this.createService(s, filter))));
  }

  getService(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService> {
    return this.api
      .getService(id, url, this.createFilter(filter))
      .pipe(map((s) => this.createService(s, filter)));
  }

  getCategories(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api.getCategories(url, filter);
  }

  getCategory(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category> {
    return this.api.getCategory(id, url, filter);
  }

  getOfferings(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api.getOfferings(url, filter);
  }

  getOffering(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering> {
    return this.api.getOffering(id, url, filter);
  }

  getPhenomena(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api.getPhenomena(url, filter);
  }

  getPhenomenon(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon> {
    return this.api.getPhenomenon(id, url, filter);
  }

  getProcedures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api.getProcedures(url, filter);
  }

  getProcedure(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure> {
    return this.api.getProcedure(id, url, filter);
  }

  getFeatures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api.getFeatures(url, filter);
  }

  getFeature(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature> {
    return this.api.getFeature(id, url, filter);
  }

  getPlatforms(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api
      .getStations(url, filter)
      .pipe(map((res) => res.map((e) => this.createHelgolandPlatform(e))));
  }

  getPlatform(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform> {
    return this.api
      .getStation(id, url, filter)
      .pipe(map((res) => this.createHelgolandPlatform(res)));
  }

  getDatasets(
    url: string,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset[]> {
    if (this.filterTimeseriesMatchesNot(filter)) {
      return of([]);
    }
    return this.api
      .getTimeseries(url, this.createFilter(filter))
      .pipe(map((res) => res.map((e) => this.mapTimeseries(e, url, filter))));
  }

  getDataset(
    internalId: InternalDatasetId,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset> {
    return this.api
      .getSingleTimeseries(internalId.id, internalId.url, filter)
      .pipe(map((res) => this.createHelgolandTimeseries(res, internalId.url)));
  }

  getDatasetData(
    dataset: HelgolandDataset,
    timespan: Timespan,
    filter: HelgolandDataFilter,
  ): Observable<HelgolandData> {
    const dataFilter = this.createDataFilter(filter);
    dataFilter.format = 'flot';
    return this.api
      .getTsData<TimeValueTuple>(dataset.id, dataset.url, timespan, dataFilter)
      .pipe(
        map((res) => {
          const data = new HelgolandTimeseriesData(res.values);
          data.referenceValues = res.referenceValues ? res.referenceValues : {};
          if (res.valueBeforeTimespan) {
            data.valueBeforeTimespan = res.valueBeforeTimespan;
          }
          if (res.valueAfterTimespan) {
            data.valueAfterTimespan = res.valueAfterTimespan;
          }
          return data;
        }),
      );
  }

  createCsvDataExportLink(
    internalId: InternalDatasetId,
    params: HelgolandCsvExportLinkParams,
  ): Observable<string> {
    const generator = new UrlGenerator();
    const url =
      generator.createBaseUrl(internalId.url, 'timeseries', internalId.id) +
      '/getData.zip';
    const reqParams = new Map<string, string>();
    if (params.timespan) {
      reqParams.set(
        'timespan',
        generator.createTimespanRequestParam(params.timespan),
      );
    }
    if (params.lang) {
      reqParams.set('locale', params.lang);
    }
    if (params.generalize) {
      reqParams.set('generalize', params.generalize.toString());
    }
    if (params.zip) {
      reqParams.set('zip', params.zip.toString());
    }
    reqParams.set('bom', 'true');
    return of(generator.addUrlParams(url, reqParams));
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return this.api.getTimeseriesExtras(internalId.id, internalId.url);
  }

  protected createService(
    service: Service,
    filter: HelgolandParameterFilter,
  ): HelgolandService {
    let hasTimeseries = true;
    if (filter.type && filter.type !== DatasetType.Timeseries) {
      hasTimeseries = false;
    }
    return new HelgolandService(
      service.id,
      service.apiUrl,
      service.label,
      service.type,
      service.version,
      {
        categories: hasTimeseries ? service.quantities.categories : 0,
        features: hasTimeseries ? service.quantities.features : 0,
        offerings: hasTimeseries ? service.quantities.offerings : 0,
        phenomena: hasTimeseries ? service.quantities.phenomena : 0,
        procedures: hasTimeseries ? service.quantities.procedures : 0,
        datasets: hasTimeseries ? service.quantities.timeseries : 0,
        platforms: hasTimeseries ? service.quantities.stations : 0,
      },
    );
  }

  protected mapTimeseries(
    res: IDataset,
    url: string,
    filter: DatasetFilter,
  ): HelgolandDataset {
    if (filter.expanded) {
      if (res instanceof Timeseries && res.station) {
        return new HelgolandTimeseries(
          res.id,
          url,
          res.label,
          res.uom,
          this.createHelgolandPlatform(res.station),
          res.firstValue,
          res.lastValue,
          res.referenceValues,
          res.renderingHints,
          res.parameters,
        );
      }
    }
    return new HelgolandDataset(res.id, url, res.label);
  }

  protected createHelgolandTimeseries(
    res: Timeseries,
    url: string,
  ): HelgolandTimeseries {
    let firstValue: FirstLastValue, lastValue: FirstLastValue;
    if (res.firstValue) {
      firstValue = res.firstValue;
    }
    if (res.lastValue) {
      lastValue = res.lastValue;
    }
    const platform = this.createHelgolandPlatform(res.station);
    return new HelgolandTimeseries(
      res.id,
      url,
      res.label,
      res.uom,
      platform,
      firstValue,
      lastValue,
      res.referenceValues,
      res.renderingHints,
      res.parameters,
    );
  }

  protected createFilter(filter: HelgolandParameterFilter): ParameterFilter {
    const paramFilter: ParameterFilter = {};
    if (filter.platform) {
      paramFilter['station'] = filter.platform;
    }
    if (filter.category) {
      paramFilter.category = filter.category;
    }
    if (filter.offering) {
      paramFilter.offering = filter.offering;
    }
    if (filter.phenomenon) {
      paramFilter.phenomenon = filter.phenomenon;
    }
    if (filter.procedure) {
      paramFilter.procedure = filter.procedure;
    }
    if (filter.feature) {
      paramFilter.feature = filter.feature;
    }
    if (filter.expanded) {
      paramFilter.expanded = filter.expanded;
    }
    if (filter.lang) {
      paramFilter.lang = filter.lang;
    }
    if (filter.service) {
      paramFilter.service = filter.service;
    }
    return paramFilter;
  }

  protected createDataFilter(filter: HelgolandDataFilter): DataParameterFilter {
    const dataFilter: DataParameterFilter = {};
    if (filter.expanded) {
      dataFilter.expanded = filter.expanded;
    }
    if (filter.generalize) {
      dataFilter.generalize = filter.generalize;
    }
    return dataFilter;
  }

  protected createHelgolandPlatform(station: Station): HelgolandPlatform {
    const datasets = [];
    if (station.properties.timeseries) {
      for (const key in station.properties.timeseries) {
        if (station.properties.timeseries.hasOwnProperty(key)) {
          datasets.push(key);
        }
      }
    }
    return new HelgolandPlatform(
      station.id || station.properties.id,
      station.properties.label,
      datasets,
      station.geometry,
    );
  }

  protected filterTimeseriesMatchesNot(
    filter: HelgolandParameterFilter,
  ): boolean {
    return filter.type && filter.type !== DatasetType.Timeseries;
  }
}

export const DatasetApiV1ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV1Connector,
  multi: true,
};
