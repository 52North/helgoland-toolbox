import { Injectable } from '@angular/core';
import moment from 'moment';
import { forkJoin, Observable, Observer, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Data, LocatedTimeValueEntry, ProfileDataEntry, TimeValueTuple } from '../../../model/dataset-api/data';
import { FirstLastValue, PlatformParameter } from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Parameter } from '../../../model/dataset-api/parameter';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-connector';
import { UrlGenerator } from '../../helper/url-generator';
import { HelgolandServiceConnector } from '../../interfaces/service-connector-interfaces';
import {
  HelgolandData,
  HelgolandDataFilter,
  HelgolandProfileData,
  HelgolandTimeseriesData,
  HelgolandTrajectoryData,
} from '../../model/internal/data';
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandTimeseries,
} from '../../model/internal/dataset';
import { HelgolandCsvExportLinkParams, HelgolandParameterFilter } from '../../model/internal/filter';
import { HelgolandPlatform } from '../../model/internal/platform';
import { HelgolandService } from '../../model/internal/service';
import { PlatformTypes } from './../../../model/dataset-api/enums';
import { HelgolandProfile, HelgolandTrajectory } from './../../model/internal/dataset';
import { HelgolandServiceQuantities } from './../../model/internal/service';
import {
  ApiV3Category,
  ApiV3Dataset,
  ApiV3DatasetDataFilter,
  ApiV3DatasetTypes,
  ApiV3Feature,
  ApiV3InterfaceService,
  ApiV3ObservationTypes,
  ApiV3Offering,
  ApiV3ParameterFilter,
  ApiV3Phenomenon,
  ApiV3Platform,
  ApiV3Procedure,
  ApiV3Service,
  ApiV3ValueTypes,
} from './api-v3-interface';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV3Connector implements HelgolandServiceConnector {

  name = 'DatasetApiV3Connector';

  constructor(
    protected http: HttpService,
    protected api: ApiV3InterfaceService
  ) { }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map(res => {
        if (res instanceof Array) {
          // check if endpoint 'trajectories' exists
          return res.findIndex(e => e.id === 'trajectories') >= 0;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  getServices(url: string, filter: HelgolandParameterFilter): Observable<HelgolandService[]> {
    const clone = Object.create(filter) as HelgolandParameterFilter;
    if (clone.expanded === undefined) { clone.expanded = true }
    return this.api.getServices(url, this.createFilter(clone)).pipe(map(res => res.map(s => this.createService(s, url, filter))));
  }

  getService(id: string, url: string, filter: HelgolandParameterFilter): Observable<HelgolandService> {
    return this.api.getService(id, url, this.createFilter(filter)).pipe(map(s => this.createService(s, url, filter)));
  }

  getCategories(url: string, filter: HelgolandParameterFilter): Observable<Category[]> {
    return this.api.getCategories(url, this.createFilter(filter)).pipe(map(res => res.map(c => this.createCategory(c))));
  }

  getCategory(id: string, url: string, filter: HelgolandParameterFilter): Observable<Category> {
    return this.api.getCategory(id, url, this.createFilter(filter)).pipe(map(res => this.createCategory(res)));
  }

  getOfferings(url: string, filter: HelgolandParameterFilter): Observable<Offering[]> {
    return this.api.getOfferings(url, this.createFilter(filter)).pipe(map(res => res.map(o => this.createOffering(o))));
  }

  getOffering(id: string, url: string, filter: HelgolandParameterFilter): Observable<Offering> {
    return this.api.getOffering(id, url, this.createFilter(filter)).pipe(map(res => this.createOffering(res)));
  }

  getPhenomena(url: string, filter: HelgolandParameterFilter): Observable<Phenomenon[]> {
    return this.api.getPhenomena(url, this.createFilter(filter)).pipe(map(res => res.map(p => this.createPhenomenon(p))));
  }

  getPhenomenon(id: string, url: string, filter: HelgolandParameterFilter): Observable<Phenomenon> {
    return this.api.getPhenomenon(id, url, this.createFilter(filter)).pipe(map(res => this.createPhenomenon(res)));
  }

  getProcedures(url: string, filter: HelgolandParameterFilter): Observable<Procedure[]> {
    return this.api.getProcedures(url, this.createFilter(filter)).pipe(map(res => res.map(p => this.createProcedure(p))));
  }

  getProcedure(id: string, url: string, filter: HelgolandParameterFilter): Observable<Procedure> {
    return this.api.getProcedure(id, url, this.createFilter(filter)).pipe(map(res => this.createProcedure(res)));
  }

  getFeatures(url: string, filter: HelgolandParameterFilter): Observable<Feature[]> {
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createFeature(f))));
  }

  getFeature(id: string, url: string, filter: HelgolandParameterFilter): Observable<Feature> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createFeature(res)));
  }

  getPlatforms(url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform[]> {
    // features are used as platforms in v3 
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createStation(f))));
  }

  getPlatform(id: string, url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createStation(res)));
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getDatasets(url, this.createFilter(filter)).pipe(map(res => res.map(ds => this.createDataset(ds, url))));
  }

  protected createDataset(ds: ApiV3Dataset, url: string): HelgolandDataset {
    if (!ds.parameters) {
      return new HelgolandDataset(ds.id, url, ds.label);
    }
    let firstValue: FirstLastValue, lastValue: FirstLastValue;
    let category: Parameter, feature: Parameter, offering: Parameter, phenomenon: Parameter, procedure: Parameter, service: Parameter;
    let platformParam: PlatformParameter;
    if (ds.firstValue) {
      firstValue = { timestamp: new Date(ds.firstValue.timestamp).getTime(), value: ds.firstValue.value };
    }
    if (ds.lastValue) {
      lastValue = { timestamp: new Date(ds.lastValue.timestamp).getTime(), value: ds.lastValue.value };
    }
    if (ds.parameters) {
      category = this.createCategory(ds.parameters.category);
      feature = this.createFeature(ds.feature);
      offering = this.createOffering(ds.parameters.offering);
      phenomenon = this.createPhenomenon(ds.parameters.phenomenon);
      procedure = this.createProcedure(ds.parameters.procedure);
      service = { id: ds.parameters.service.id, label: ds.parameters.service.label };
      platformParam = { id: ds.parameters.platform.id, label: ds.parameters.platform.label, platformType: PlatformTypes.stationary };
    }
    switch (ds.datasetType) {
      case ApiV3DatasetTypes.Timeseries:
        if (ds.observationType === ApiV3ObservationTypes.Simple && (ds.valueType === ApiV3ValueTypes.Quantity || ds.valueType === ApiV3ValueTypes.Count)) {
          let platform: HelgolandPlatform;
          if (ds.feature && ds.feature.geometry) {
            platform = new HelgolandPlatform(ds.parameters.platform.id, ds.parameters.platform.label, [], ds.feature.geometry);
          } else {
            platform = new HelgolandPlatform(ds.parameters.platform.id, ds.parameters.platform.label, []);
          }
          return new HelgolandTimeseries(ds.id, url, ds.label, ds.uom, platform, firstValue, lastValue, ds.referenceValues, null,
            { category, feature, offering, phenomenon, procedure, service }
          );
        } else if (ds.observationType === ApiV3ObservationTypes.Profil) {
          return new HelgolandProfile(ds.id, url, ds.label, ds.uom, false, ds.firstValue as any, ds.lastValue as any,
            { category, feature, offering, phenomenon, procedure, service, platform: platformParam }
          )
        } else {
          console.error(`'${ds.datasetType}' not implemented`);
          break;
        }
      case ApiV3DatasetTypes.Trajectory:
        if (ds.observationType === ApiV3ObservationTypes.Profil) {
          return new HelgolandProfile(ds.id, url, ds.label, ds.uom, true, firstValue, lastValue, { category, feature, offering, phenomenon, procedure, service, platform: platformParam });
        } else {
          return new HelgolandTrajectory(ds.id, url, ds.label, ds.uom, firstValue, lastValue, { category, feature, offering, phenomenon, procedure, service, platform: platformParam });
        }
      case ApiV3DatasetTypes.Profile:
      case ApiV3DatasetTypes.IndividualObservation:
        console.error(`'${ds.datasetType}' not implemented`);
        return new HelgolandDataset(ds.id, url, ds.label);
      default:
        return new HelgolandDataset(ds.id, url, ds.label);
    }
  }

  protected createHelgolandPlatform(feature: ApiV3Platform): HelgolandPlatform {
    return new HelgolandPlatform(feature.id, feature.label, []);
  }

  protected createService(service: ApiV3Service, url: string, filter: HelgolandParameterFilter): HelgolandService {
    let datasets;
    const id = service.id;
    const label = service.label;
    const type = service.type;
    const version = service.version;
    const quantities: HelgolandServiceQuantities = {};
    if (service.quantities) {
      switch (filter.type) {
        case DatasetType.Timeseries:
          datasets = service.quantities.datasets.timeseries;
          break;
        case DatasetType.Trajectory:
          datasets = service.quantities.datasets.trajectories;
          break;
        case DatasetType.Profile:
          datasets = service.quantities.datasets.profiles;
          break;
        default:
          datasets = service.quantities.datasets.total;
          break;
      }
      quantities.categories = service.quantities.categories;
      quantities.features = service.quantities.features;
      quantities.offerings = service.quantities.offerings;
      quantities.phenomena = service.quantities.phenomena;
      quantities.procedures = service.quantities.procedures;
      quantities.datasets = datasets;
      quantities.platforms = service.quantities.platforms;
    }
    return new HelgolandService(id, url, label, type, version, quantities);
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    return new Observable((observer: Observer<HelgolandDataset>) => {
      this.api.getDataset(internalId.id, internalId.url, filter).subscribe(
        res => {
          const dataset = this.createDataset(res, internalId.url);
          const idx = res.extras.findIndex(e => e === 'renderingHints');
          if (dataset instanceof HelgolandTimeseries && idx >= 0) {
            this.api.getDatasetExtras(internalId.id, internalId.url, { fields: ['renderingHints'] }).subscribe(
              extras => {
                dataset.renderingHints = extras.renderingHints;
                observer.next(dataset);
                observer.complete();
              },
              error => {
                observer.error(error);
                observer.complete();
              })
          } else {
            observer.next(dataset);
            observer.complete();
          }
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    if (dataset instanceof HelgolandTimeseries) {
      const maxTimeExtent = moment.duration(1, 'year').asMilliseconds();
      if ((timespan.to - timespan.from) > maxTimeExtent) {
        const requests: Array<Observable<HelgolandTimeseriesData>> = [];
        let start = moment(timespan.from).startOf('year');
        let end = moment(timespan.from).endOf('year');
        while (start.isBefore(moment(timespan.to))) {
          const chunkSpan = new Timespan(start.unix() * 1000, end.unix() * 1000);
          const params: ApiV3DatasetDataFilter = { timespan: this.createRequestTimespan(chunkSpan), format: 'flot' };
          if (filter.expanded !== undefined) { params.expanded = filter.expanded };
          requests.push(
            this.api.getDatasetData<TimeValueTuple>(dataset.id, dataset.url, params)
              .pipe(map(res => this.createTimeseriesData(res)))
          );
          start = end.add(1, 'millisecond');
          end = moment(start).endOf('year');
        }
        return forkJoin(requests).pipe(map((e) => {
          const mergedResult = e.reduce((previous, current) => {
            const next: HelgolandTimeseriesData = new HelgolandTimeseriesData(previous.values.concat(current.values));
            for (const key in previous.referenceValues) {
              if (previous.referenceValues.hasOwnProperty(key)) {
                next.referenceValues[key] = previous.referenceValues[key].concat(current.referenceValues[key]);
              }
            }
            return next;
          });
          if (mergedResult.values && mergedResult.values.length > 0) {
            // cut first
            const fromIdx = mergedResult.values.findIndex(el => el[0] >= timespan.from);
            mergedResult.values = mergedResult.values.slice(fromIdx);
            // cut last
            const toIdx = mergedResult.values.findIndex(el => el[0] >= timespan.to);
            if (toIdx >= 0) { mergedResult.values = mergedResult.values.slice(0, toIdx + 1); }
          }
          return mergedResult;
        }));
      } else {
        const params: ApiV3DatasetDataFilter = { timespan: this.createRequestTimespan(timespan), format: 'flot' };
        if (filter.expanded !== undefined) { params.expanded = filter.expanded };
        return this.api.getDatasetData<TimeValueTuple>(dataset.id, dataset.url, params)
          .pipe(map(res => this.createTimeseriesData(res)));
      }
    }

    if (dataset instanceof HelgolandTrajectory) {
      return this.api.getDatasetData<LocatedTimeValueEntry>(dataset.id, dataset.url, { timespan: this.createRequestTimespan(timespan), unixTime: true })
        .pipe(map(res => this.createTrajectoryData(res)));
    }

    if (dataset instanceof HelgolandProfile) {
      return this.api.getDatasetData<ProfileDataEntry>(dataset.id, dataset.url, { timespan: this.createRequestTimespan(timespan), unixTime: true })
        .pipe(map(res => this.createProfileData(res)));
    }
  }

  createCsvDataExportLink(internalId: InternalDatasetId, params: HelgolandCsvExportLinkParams): Observable<string> {
    const generator = new UrlGenerator();
    const url = generator.createBaseUrl(internalId.url, 'datasets', internalId.id) + '/data.zip';
    const reqParams = new Map<string, string>();
    if (params.timespan) {
      reqParams.set('timespan', generator.createTimespanRequestParam(params.timespan));
    }
    if (params.lang) { reqParams.set('locale', params.lang); }
    if (params.generalize) { reqParams.set('locale', params.generalize.toString()); }
    if (params.zip) { reqParams.set('locale', params.zip.toString()); }
    reqParams.set('bom', 'true');
    return of(generator.addUrlParams(url, reqParams));
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return this.api.getDatasetExtras(internalId.id, internalId.url);
  }

  protected createRequestTimespan(timespan: Timespan): string {
    return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  protected createTrajectoryData(res: Data<LocatedTimeValueEntry>): HelgolandTrajectoryData {
    return new HelgolandTrajectoryData(res.values);
  }

  protected createProfileData(res: Data<ProfileDataEntry>): HelgolandProfileData {
    return new HelgolandProfileData(res.values);
  }

  protected createTimeseriesData(res: Data<TimeValueTuple>): HelgolandTimeseriesData {
    const data = new HelgolandTimeseriesData(res.values);
    data.referenceValues = res.referenceValues ? res.referenceValues : {};
    if (res.valueBeforeTimespan) {
      data.valueBeforeTimespan = res.valueBeforeTimespan;
    }
    if (res.valueAfterTimespan) {
      data.valueAfterTimespan = res.valueAfterTimespan;
    }
    return data;
  }

  protected createFilter(filter: HelgolandParameterFilter): ApiV3ParameterFilter {
    const apiFilter: ApiV3ParameterFilter = {};
    if (filter.service) { apiFilter.services = [filter.service]; }
    if (filter.platform) { apiFilter.platforms = [filter.platform]; }
    if (filter.category) { apiFilter.categories = [filter.category]; }
    if (filter.offering) { apiFilter.offerings = [filter.offering]; }
    if (filter.phenomenon) { apiFilter.phenomena = [filter.phenomenon]; }
    if (filter.procedure) { apiFilter.procedures = [filter.procedure]; }
    if (filter.feature) { apiFilter.features = [filter.feature]; }
    if (filter.expanded) { apiFilter.expanded = filter.expanded; }
    if (filter.lang) { apiFilter.locale = filter.lang; }
    switch (filter.type) {
      case DatasetType.Timeseries:
        apiFilter.datasetTypes = [ApiV3DatasetTypes.Timeseries];
        apiFilter.observationTypes = [ApiV3ObservationTypes.Simple];
        apiFilter.valueTypes = [ApiV3ValueTypes.Quantity, ApiV3ValueTypes.Count];
        break;
      case DatasetType.Trajectory:
        apiFilter.datasetTypes = [ApiV3DatasetTypes.Trajectory];
        apiFilter.observationTypes = [ApiV3ObservationTypes.Simple];
        apiFilter.valueTypes = [ApiV3ValueTypes.Quantity];
        break;
      case DatasetType.Profile:
        apiFilter.datasetTypes = [ApiV3DatasetTypes.Timeseries];
        apiFilter.observationTypes = [ApiV3ObservationTypes.Profil];
        apiFilter.valueTypes = [ApiV3ValueTypes.Quantity];
        break;
      default:
        break;
    }
    return apiFilter;
  }

  protected createStation(feature: ApiV3Feature): HelgolandPlatform {
    const datasetIds = [];
    for (const key in feature.properties.datasets) {
      if (feature.properties.datasets.hasOwnProperty(key)) {
        datasetIds.push(key);
      }
    }
    return new HelgolandPlatform(feature.id, feature.properties.label, datasetIds, feature.geometry);
  }

  protected createCategory(category: ApiV3Category): Category {
    return {
      id: category.id,
      label: category.label
    };
  }

  protected createOffering(offering: ApiV3Offering): Offering {
    return {
      id: offering.id,
      label: offering.label
    };
  }

  protected createPhenomenon(phenomenon: ApiV3Phenomenon): Phenomenon {
    return {
      id: phenomenon.id,
      label: phenomenon.label
    };
  }

  protected createProcedure(procedure: ApiV3Procedure): Procedure {
    return {
      id: procedure.id,
      label: procedure.label
    };
  }

  protected createFeature(feature: ApiV3Feature): Feature {
    const f: Feature = {
      id: feature.id,
      label: feature.properties.label
    };
    if (feature.properties && feature.properties.domainId) { f.domainId = feature.properties.domainId }
    return f;
  }

}

export const DatasetApiV3ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV3Connector,
  multi: true
};
