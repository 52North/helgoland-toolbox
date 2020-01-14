import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DatasetApiInterface } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { LocatedTimeValueEntry, TimeValueTuple } from '../../../model/dataset-api/data';
import { Dataset } from '../../../model/dataset-api/dataset';
import { PlatformTypes } from '../../../model/dataset-api/enums';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-handler.service';
import {
  HelgolandData,
  HelgolandDataFilter,
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

}

export const DatasetApiV2ConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: DatasetApiV2Service,
  multi: true
};
