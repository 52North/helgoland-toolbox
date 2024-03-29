import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import {
  LocatedProfileDataEntry,
  LocatedTimeValueEntry,
  ProfileDataEntry,
  TimeValueTuple,
} from '../../../model/dataset-api/data';
import { Dataset } from '../../../model/dataset-api/dataset';
import { PlatformTypes } from '../../../model/dataset-api/enums';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Platform } from '../../../model/dataset-api/platform';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Service } from '../../../model/dataset-api/service';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-connector';
import { HelgolandServiceConnector } from '../../interfaces/service-connector-interfaces';
import {
  HelgolandData,
  HelgolandDataFilter,
  HelgolandLocatedProfileData,
  HelgolandProfileData,
  HelgolandTimeseriesData,
  HelgolandTrajectoryData,
} from '../../model/internal/data';
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandProfile,
  HelgolandTimeseries,
  HelgolandTrajectory,
} from '../../model/internal/dataset';
import {
  HelgolandCsvExportLinkParams,
  HelgolandParameterFilter,
} from '../../model/internal/filter';
import { HelgolandPlatform } from '../../model/internal/platform';
import { HelgolandService } from '../../model/internal/service';
import { UrlGenerator } from './../../helper/url-generator';
import { HelgolandServiceQuantities } from './../../model/internal/service';

@Injectable({
  providedIn: 'root',
})
export class DatasetApiV2Connector implements HelgolandServiceConnector {
  name = 'DatasetApiV2Connector';

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
            return res.findIndex((e) => e.id === 'trajectories') === -1;
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
      .pipe(map((res) => res.map((s) => this.createV2Service(s, filter))));
  }

  getService(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService> {
    return this.api
      .getService(id, url, this.createFilter(filter))
      .pipe(map((s) => this.createV2Service(s, filter)));
  }

  getPlatforms(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform[]> {
    return this.api
      .getPlatforms(url, this.createFilter(filter))
      .pipe(
        map((res) =>
          res instanceof Array
            ? res.map((pf) => this.createHelgolandPlatform(pf))
            : [],
        ),
      );
  }

  getPlatform(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform> {
    return this.api
      .getPlatform(id, url, filter)
      .pipe(map((platform) => this.createHelgolandPlatform(platform)));
  }

  getCategories(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category[]> {
    return this.api.getCategories(url, this.createFilter(filter));
  }

  getCategory(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category> {
    return this.api.getCategory(id, url);
  }

  getOfferings(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering[]> {
    return this.api.getOfferings(url, this.createFilter(filter));
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
    return this.api.getPhenomena(url, this.createFilter(filter));
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
    return this.api.getProcedures(url, this.createFilter(filter));
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
    return this.api.getFeatures(url, this.createFilter(filter));
  }

  getFeature(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature> {
    return this.api.getFeature(id, url, filter);
  }

  getDatasets(
    url: string,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset[]> {
    return this.api
      .getDatasets(url, this.createFilter(filter))
      .pipe(map((res) => res.map((e) => this.createDataset(e, url, filter))));
  }

  getDataset(
    internalId: InternalDatasetId,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset> {
    return this.api
      .getDataset(internalId.id, internalId.url, filter)
      .pipe(map((res) => this.createDataset(res, internalId.url, filter)));
  }

  getDatasetData(
    dataset: HelgolandDataset,
    timespan: Timespan,
    filter: HelgolandDataFilter,
  ): Observable<HelgolandData> {
    if (dataset instanceof HelgolandTimeseries) {
      return this.api
        .getData<TimeValueTuple>(dataset.id, dataset.url, timespan, {
          format: 'flot',
        })
        .pipe(
          map((res) => {
            const data = new HelgolandTimeseriesData(res.values);
            data.referenceValues = res.referenceValues
              ? res.referenceValues
              : {};
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

    if (dataset instanceof HelgolandTrajectory) {
      return this.api
        .getData<LocatedTimeValueEntry>(dataset.id, dataset.url, timespan)
        .pipe(map((res) => new HelgolandTrajectoryData(res.values)));
    }

    if (dataset instanceof HelgolandProfile) {
      if (dataset.isMobile) {
        return this.api
          .getData<LocatedProfileDataEntry>(dataset.id, dataset.url, timespan)
          .pipe(map((res) => new HelgolandLocatedProfileData(res.values)));
      } else {
        return this.api
          .getData<ProfileDataEntry>(dataset.id, dataset.url, timespan)
          .pipe(map((res) => new HelgolandProfileData(res.values)));
      }
    }
    throw new Error('No return option found.');
  }

  createCsvDataExportLink(
    internalId: InternalDatasetId,
    params: HelgolandCsvExportLinkParams,
  ): Observable<string> {
    const generator = new UrlGenerator();
    const url =
      generator.createBaseUrl(internalId.url, 'datasets', internalId.id) +
      '/data.zip';
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

  protected createDataset(
    dataset: Dataset,
    url: string,
    filter: DatasetFilter,
  ): HelgolandDataset {
    switch (filter.type) {
      case DatasetType.Timeseries:
        if (dataset.parameters && dataset.parameters.platform) {
          // TODO: ggf station nachholen
          const station = new HelgolandPlatform(
            dataset.parameters.platform.id,
            dataset.parameters.platform.label,
            [],
          );
          return new HelgolandTimeseries(
            dataset.id,
            url,
            dataset.label,
            dataset.uom,
            station,
            dataset.firstValue,
            dataset.lastValue,
            dataset.referenceValues,
            dataset.renderingHints,
            dataset.parameters,
          );
        }
        break;
      case DatasetType.Trajectory:
        if (dataset.parameters) {
          return new HelgolandTrajectory(
            dataset.id,
            url,
            dataset.label,
            dataset.uom,
            dataset.firstValue,
            dataset.lastValue,
            dataset.parameters,
          );
        }
        break;
      case DatasetType.Profile:
        if (dataset.parameters) {
          return new HelgolandProfile(
            dataset.id,
            url,
            dataset.label,
            dataset.uom,
            dataset.platformType === PlatformTypes.mobileInsitu,
            dataset.firstValue,
            dataset.lastValue,
            dataset.parameters,
          );
        }
        break;
    }
    return new HelgolandDataset(dataset.id, url, dataset.label);
  }

  protected createV2Service(
    s: Service,
    filter: HelgolandParameterFilter,
  ): HelgolandService {
    const id = s.id;
    const apiUrl = s.apiUrl;
    const label = s.label;
    const type = s.type;
    const version = s.version;
    const quantities: HelgolandServiceQuantities = {};
    if (s.quantities && s.quantities.categories !== undefined) {
      quantities.categories = s.quantities.categories;
    }
    if (s.quantities && s.quantities.features !== undefined) {
      quantities.features = s.quantities.features;
    }
    if (s.quantities && s.quantities.offerings !== undefined) {
      quantities.offerings = s.quantities.offerings;
    }
    if (s.quantities && s.quantities.phenomena !== undefined) {
      quantities.phenomena = s.quantities.phenomena;
    }
    if (s.quantities && s.quantities.procedures !== undefined) {
      quantities.procedures = s.quantities.procedures;
    }
    if (s.quantities && s.quantities.datasets !== undefined) {
      quantities.datasets = s.quantities.datasets;
    }
    if (s.quantities) {
      quantities.platforms =
        0 +
        (s.quantities.platforms ? s.quantities.platforms : 0) +
        (s.quantities.stations ? s.quantities.stations : 0);
    }
    return new HelgolandService(id, apiUrl, label, type, version, quantities);
  }

  protected createFilter(filter: HelgolandParameterFilter): ParameterFilter {
    const paramFilter: ParameterFilter = {};
    switch (filter.type) {
      case DatasetType.Timeseries:
        paramFilter.valueTypes = 'quantity';
        break;
      case DatasetType.Trajectory:
        paramFilter.valueTypes = 'quantity';
        paramFilter.platformTypes = 'mobile';
        break;
      case DatasetType.Profile:
        paramFilter.valueTypes = 'quantity-profile';
    }
    if (filter.platformType !== undefined) {
      paramFilter.platformTypes = filter.platformType;
    }
    if (filter.platform !== undefined) {
      paramFilter['platforms'] = filter.platform;
    }
    if (filter.category !== undefined) {
      paramFilter.category = filter.category;
    }
    if (filter.offering !== undefined) {
      paramFilter.offering = filter.offering;
    }
    if (filter.phenomenon !== undefined) {
      paramFilter.phenomenon = filter.phenomenon;
    }
    if (filter.procedure !== undefined) {
      paramFilter.procedure = filter.procedure;
    }
    if (filter.feature !== undefined) {
      paramFilter.feature = filter.feature;
    }
    if (filter.expanded !== undefined) {
      paramFilter.expanded = filter.expanded;
    }
    if (filter.lang !== undefined) {
      paramFilter.lang = filter.lang;
    }
    if (filter.service !== undefined) {
      paramFilter.service = filter.service;
    }
    return paramFilter;
  }

  protected createHelgolandPlatform(platform: Platform): HelgolandPlatform {
    let datasets: string[] = [];
    if (platform.datasets && platform.datasets.length > 0) {
      datasets = platform.datasets.map((pf) => pf.id);
    }
    return new HelgolandPlatform(
      platform.id,
      platform.label,
      datasets,
      platform.geometry,
    );
  }
}

export const DatasetApiV2ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV2Connector,
  multi: true,
};
