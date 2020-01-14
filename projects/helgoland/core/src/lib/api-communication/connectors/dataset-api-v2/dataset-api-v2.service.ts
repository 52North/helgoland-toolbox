import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import {
  LocatedProfileDataEntry,
  LocatedTimeValueEntry,
  ProfileDataEntry,
  TimeValueTuple,
} from '../../../model/dataset-api/data';
import { Dataset } from '../../../model/dataset-api/dataset';
import { PlatformTypes } from '../../../model/dataset-api/enums';
import { Platform } from '../../../model/dataset-api/platform';
import { Station } from '../../../model/dataset-api/station';
import { ParameterFilter } from '../../../model/internal/http-requests';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-handler.service';
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
  HelgolandDataset,
  HelgolandProfile,
  HelgolandTimeseries,
  HelgolandTrajectory,
} from '../../model/internal/dataset';
import { HelgolandStation } from '../../model/internal/station';
import { DatasetApiV1Service } from './../dataset-api-v1/dataset-api-v1.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiV2Service extends DatasetApiV1Service {

  constructor(
    protected http: HttpService,
    protected api: DatasetApiInterface
  ) {
    super(http, api);
  }

  canHandle(url: string): Observable<boolean> {
    return this.http.client().get(url).pipe(
      map(res => {
        if (res instanceof Array) {
          // check if endpoint 'trajectories' not exists
          return res.findIndex(e => e.id === 'trajectories') === -1;
        } else {
          return false;
        }
      }),
      catchError(() => of(false))
    );
  }

  getStations(url: string, filter: ParameterFilter): Observable<Station[]> {
    return this.api.getPlatforms(url, filter).pipe(map(res => res.map(pf => this.createStation(pf))));
  }

  getStation(id: string, url: string, filter: ParameterFilter): Observable<Station> {
    return this.api.getPlatform(id, url, filter).pipe(map(platform => this.createStation(platform)));
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return this.api.getDatasets(url, filter)
      .pipe(map(res => res.map(e => this.createDataset(e, url, filter))));
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    return this.api.getDataset(internalId.id, internalId.url, filter)
      .pipe(map(res => this.createDataset(res, internalId.url, filter)));
  }

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    if (dataset instanceof HelgolandTimeseries) {
      return this.api.getTsData<TimeValueTuple>(dataset.id, dataset.url, timespan, { format: 'flot' }).pipe(map(res => {
        const data = new HelgolandTimeseriesData(res.values);
        data.referenceValues = res.referenceValues ? res.referenceValues : {};
        if (res.valueBeforeTimespan) { data.valueBeforeTimespan = res.valueBeforeTimespan; }
        if (res.valueAfterTimespan) { data.valueAfterTimespan = res.valueAfterTimespan; }
        return data;
      }));
    }

    if (dataset instanceof HelgolandTrajectory) {
      return this.api.getData<LocatedTimeValueEntry>(dataset.id, dataset.url, timespan)
        .pipe(map(res => new HelgolandTrajectoryData(res.values)));
    }

    if (dataset instanceof HelgolandProfile) {
      if (dataset.isMobile) {
        return this.api.getData<LocatedProfileDataEntry>(dataset.id, dataset.url, timespan)
          .pipe(map(res => new HelgolandLocatedProfileData(res.values)));
      } else {
        return this.api.getData<ProfileDataEntry>(dataset.id, dataset.url, timespan)
          .pipe(map(res => new HelgolandProfileData(res.values)));
      }
    }
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return this.api.getTimeseriesExtras(internalId.id, internalId.url);
  }

  private createDataset(dataset: Dataset, url: string, filter: DatasetFilter): HelgolandDataset {
    if (dataset['valueType'] === 'quantity' &&
      dataset.platformType === PlatformTypes.stationaryInsitu) {
      // Timeseries
      if (dataset.parameters) {
        // TODO: ggf station nachholen
        const station = new HelgolandStation(dataset.parameters.platform.id, dataset.parameters.platform.label, null);
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
          dataset.parameters
        );
      }
    }
    if (dataset['valueType'] === 'quantity' &&
      dataset.platformType === PlatformTypes.mobileInsitu) {
      // Trajectory
      if (dataset.parameters) {
        return new HelgolandTrajectory(
          dataset.id,
          url,
          dataset.label,
          dataset.uom,
          dataset.firstValue,
          dataset.lastValue,
          dataset.parameters
        );
      }
    }
    if (dataset['valueType'] === 'quantity-profile') {
      // Profile
      if (dataset.parameters) {
        return new HelgolandProfile(
          dataset.id,
          url,
          dataset.label,
          dataset.uom,
          dataset.platformType === PlatformTypes.mobileInsitu,
          dataset.parameters
        );
      }
    }
    return new HelgolandDataset(dataset.id, url, dataset.label);
  }

  // private createStationFilter(filter: HelgolandStationFilter): ParameterFilter {
  //   const paramFilter: ParameterFilter = {};
  //   if (filter.phenomenon) { paramFilter.phenomenon = filter.phenomenon; }
  //   return paramFilter;
  // }

  private createStation(platform: Platform): Station {
    return {
      id: platform.id,
      label: platform.label,
      geometry: platform.geometry,
      properties: {
        id: platform.id,
        label: platform.label,
        timeseries: {}
      }
    }
  }

}

export const DatasetApiV2ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV2Service,
  multi: true
};
