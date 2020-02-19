import { Injectable } from '@angular/core';
import moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Data, TimeValueTuple, LocatedTimeValueEntry } from '../../../model/dataset-api/data';
import { FirstLastValue, PlatformParameter } from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Parameter } from '../../../model/dataset-api/parameter';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-connector';
import { HelgolandServiceConnector } from '../../interfaces/service-connector-interfaces';
import {
  HelgolandData,
  HelgolandDataFilter,
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
import { HelgolandParameterFilter } from '../../model/internal/filter';
import { HelgolandPlatform } from '../../model/internal/platform';
import { HelgolandService } from '../../model/internal/service';
import { PlatformTypes } from './../../../model/dataset-api/enums';
import { HelgolandProfile, HelgolandTrajectory } from './../../model/internal/dataset';
import {
  ApiV3Category,
  ApiV3Dataset,
  ApiV3DatasetTypes,
  ApiV3Feature,
  ApiV3InterfaceService,
  ApiV3ObservationTypes,
  ApiV3Offering,
  ApiV3ParameterFilter,
  ApiV3Phenomenon,
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
    private http: HttpService,
    private api: ApiV3InterfaceService
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
    const clone = Object.create(filter);
    clone.expanded = true;
    return this.api.getServices(url, this.createFilter(clone)).pipe(map(res => res.map(s => this.createService(s, url, filter))));
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
    return this.api.getFeatures(url, this.createFilter(filter)).pipe(map(res => res.map(f => this.createStation(f))));
  }

  getPlatform(id: string, url: string, filter: HelgolandParameterFilter): Observable<HelgolandPlatform> {
    return this.api.getFeature(id, url, this.createFilter(filter)).pipe(map(res => this.createStation(res)));
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getDatasets(url, this.createFilter(filter)).pipe(map(res => res.map(ds => this.createDataset(ds, url))));
  }

  private createDataset(ds: ApiV3Dataset, url: string): HelgolandDataset {
    if (!(ds.firstValue && ds.lastValue && ds.parameters)) {
      return new HelgolandDataset(ds.id, url, ds.label);
    }
    let firstValue: FirstLastValue, lastValue: FirstLastValue;
    let category: Parameter, feature: Parameter, offering: Parameter, phenomenon: Parameter, procedure: Parameter, service: Parameter;
    let platform: PlatformParameter;
    if (ds.firstValue) {
      firstValue = { timestamp: new Date(ds.firstValue.timestamp).getTime(), value: ds.firstValue.value };
    }
    if (ds.lastValue) {
      lastValue = { timestamp: new Date(ds.lastValue.timestamp).getTime(), value: ds.lastValue.value };
    }
    if (ds.parameters) {
      category = { id: ds.parameters.category.id, label: ds.parameters.category.label };
      feature = { id: ds.feature.id, label: ds.feature.properties.label };
      offering = { id: ds.parameters.offering.id, label: ds.parameters.offering.label };
      phenomenon = { id: ds.parameters.phenomenon.id, label: ds.parameters.phenomenon.label };
      procedure = { id: ds.parameters.procedure.id, label: ds.parameters.procedure.label };
      service = { id: ds.parameters.service.id, label: ds.parameters.service.label };
      platform = { id: ds.parameters.service.id, label: ds.parameters.service.label, platformType: PlatformTypes.stationary };
    }
    switch (ds.datasetType) {
      case ApiV3DatasetTypes.Timeseries:
        if (ds.observationType === ApiV3ObservationTypes.Simple && (ds.valueType === ApiV3ValueTypes.Quantity || ds.valueType === ApiV3ValueTypes.Count)) {
          return new HelgolandTimeseries(ds.id, url, ds.label, ds.uom, this.createHelgolandPlatform(ds.feature), firstValue, lastValue, [], null,
            { category, feature, offering, phenomenon, procedure, service }
          );
        } else {
          return new HelgolandDataset(ds.id, url, ds.label);
        }
      case ApiV3DatasetTypes.Trajectory:
        if (ds.observationType === ApiV3ObservationTypes.Profil) {
          return new HelgolandProfile(ds.id, url, ds.label, ds.uom, true, firstValue, lastValue, { category, feature, offering, phenomenon, procedure, service, platform });
        } else {
          return new HelgolandTrajectory(ds.id, url, ds.label, ds.uom, firstValue, lastValue, { category, feature, offering, phenomenon, procedure, service, platform });
        }
      case ApiV3DatasetTypes.Profile:
      case ApiV3DatasetTypes.IndividualObservation:
        console.error(`'${ds.datasetType}' not implemented`);
        return new HelgolandDataset(ds.id, url, ds.label);
      default:
        return new HelgolandDataset(ds.id, url, ds.label);
    }
  }

  private createHelgolandPlatform(feature: ApiV3Feature): HelgolandPlatform {
    return new HelgolandPlatform(feature.id, feature.properties.label, [], feature.geometry);
  }

  private createService(service: ApiV3Service, url: string, filter: HelgolandParameterFilter): HelgolandService {
    // TODO: remove fix for dataset count, use just service.quantities.datasets.total for dataset
    let datasets;
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
    return new HelgolandService(
      service.id,
      url,
      service.label,
      service.type,
      service.version,
      {
        categories: service.quantities.categories,
        features: service.quantities.features,
        offerings: service.quantities.offerings,
        phenomena: service.quantities.phenomena,
        procedures: service.quantities.procedures,
        datasets: datasets,
        platforms: service.quantities.platforms
      }
    );
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    return this.api.getDataset(internalId.id, internalId.url, filter).pipe(map(res => this.createDataset(res, internalId.url)));
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
          requests.push(
            this.api.getDatasetData<TimeValueTuple>(dataset.id, dataset.url, { timespan: this.createRequestTimespan(chunkSpan), format: 'flot' })
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
        return this.api.getDatasetData<TimeValueTuple>(dataset.id, dataset.url, { timespan: this.createRequestTimespan(timespan), format: 'flot' })
          .pipe(map(res => this.createTimeseriesData(res)));
      }
    }

    if (dataset instanceof HelgolandTrajectory) {
      return this.api.getDatasetData<LocatedTimeValueEntry>(dataset.id, dataset.url, { timespan: this.createRequestTimespan(timespan), unixTime: true })
        .pipe(map(res => this.createTrajectoryData(res)));
    }
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return this.api.getDatasetExtras(internalId.id, internalId.url);
  }

  private createRequestTimespan(timespan: Timespan): string {
    return encodeURI(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  private createTrajectoryData(res: Data<LocatedTimeValueEntry>): HelgolandTrajectoryData {
    return new HelgolandTrajectoryData(res.values);
  }

  private createTimeseriesData(res: Data<TimeValueTuple>): HelgolandTimeseriesData {
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

  private createFilter(filter: HelgolandParameterFilter): ApiV3ParameterFilter {
    const apiFilter: ApiV3ParameterFilter = {};
    if (filter.category) { apiFilter.category = filter.category; }
    if (filter.offering) { apiFilter.offering = filter.offering; }
    if (filter.phenomenon) { apiFilter.phenomenon = filter.phenomenon; }
    if (filter.procedure) { apiFilter.procedure = filter.procedure; }
    if (filter.feature) { apiFilter.feature = filter.feature; }
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

  private createStation(feature: ApiV3Feature): HelgolandPlatform {
    const datasetIds = [];
    for (const key in feature.properties.datasets) {
      if (feature.properties.datasets.hasOwnProperty(key)) {
        datasetIds.push(key);
      }
    }
    return new HelgolandPlatform(feature.id, feature.properties.label, datasetIds, feature.geometry);
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
  useClass: DatasetApiV3Connector,
  multi: true
};
