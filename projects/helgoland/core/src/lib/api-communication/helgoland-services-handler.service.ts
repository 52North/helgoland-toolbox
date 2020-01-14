import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { combineLatest, Observable, Observer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { InternalDatasetId } from '../dataset-api/internal-id-handler.service';
import { Category } from '../model/dataset-api/category';
import { Feature } from '../model/dataset-api/feature';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Procedure } from '../model/dataset-api/procedure';
import { Service } from '../model/dataset-api/service';
import { Station } from '../model/dataset-api/station';
import { ParameterFilter } from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { InternalIdHandler } from './../dataset-api/internal-id-handler.service';
import { IHelgolandServiceConnector, IHelgolandServiceConnectorHandler } from './interfaces/service-handler.interface';
import { HelgolandData, HelgolandDataFilter, HelgolandTimeseriesData, HelgolandTrajectoryData } from './model/internal/data';
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandTimeseries,
  HelgolandTrajectory,
} from './model/internal/dataset';

export const HELGOLAND_SERVICE_CONNECTOR_HANDLER = new InjectionToken<IHelgolandServiceConnectorHandler>('HELGOLAND_SERVICE_CONNECTOR_HANDLER');

@Injectable({
  providedIn: 'root'
})
export class HelgolandServicesHandlerService implements IHelgolandServiceConnector {

  private serviceMapping: Map<string, IHelgolandServiceConnectorHandler> = new Map();

  constructor(
    @Optional() @Inject(HELGOLAND_SERVICE_CONNECTOR_HANDLER) protected handler: IHelgolandServiceConnectorHandler[] | null = [],
    private internalIdHandler: InternalIdHandler
  ) { }

  getServices(url: string, filter: ParameterFilter = {}): Observable<Service[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getServices(url, filter)));
  }

  getCategories(url: string, filter: ParameterFilter = {}): Observable<Category[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getCategories(url, filter)));
  }

  getCategory(id: string, url: string, filter: ParameterFilter = {}): Observable<Category> {
    return this.getHandler(url).pipe(flatMap(h => h.getCategory(id, url, filter)));
  }

  getOfferings(url: string, filter: ParameterFilter = {}): Observable<Offering[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getOfferings(url, filter)));
  }

  getOffering(id: string, url: string, filter: ParameterFilter = {}): Observable<Offering> {
    return this.getHandler(url).pipe(flatMap(h => h.getOffering(id, url, filter)));
  }

  getPhenomena(url: string, filter: ParameterFilter = {}): Observable<Phenomenon[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getPhenomena(url, filter)));
  }

  getPhenomenon(id: string, url: string, filter: ParameterFilter = {}): Observable<Phenomenon> {
    return this.getHandler(url).pipe(flatMap(h => h.getPhenomenon(id, url, filter)));
  }

  getProcedures(url: string, filter: ParameterFilter = {}): Observable<Procedure[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getProcedures(url, filter)));
  }

  getProcedure(id: string, url: string, filter: ParameterFilter = {}): Observable<Procedure> {
    return this.getHandler(url).pipe(flatMap(h => h.getProcedure(id, url, filter)));
  }

  getFeatures(url: string, filter: ParameterFilter = {}): Observable<Feature[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getFeatures(url, filter)));
  }

  getFeature(id: string, url: string, filter: ParameterFilter = {}): Observable<Feature> {
    return this.getHandler(url).pipe(flatMap(h => h.getFeature(id, url, filter)));
  }

  getStations(url: string, filter: ParameterFilter = {}): Observable<Station[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getStations(url, filter)));
  }

  getStation(id: string, url: string, filter: ParameterFilter = {}): Observable<Station> {
    return this.getHandler(url).pipe(flatMap(h => h.getStation(id, url, filter)));
  }

  getDatasets(url: string, filter: DatasetFilter = {}): Observable<HelgolandDataset[]> {
    return this.getHandler(url).pipe(flatMap(h => h.getDatasets(url, filter)));
  }

  getDataset(internalId: string | InternalDatasetId, filter: {
    phenomenon?: string,
    category?: string,
    procedure?: string,
    feature?: string,
    offering?: string,
    expanded?: boolean,
    lang?: string,
    type: DatasetType.Timeseries
  }): Observable<HelgolandTimeseries>;

  getDataset(internalId: string | InternalDatasetId, filter: {
    phenomenon?: string,
    category?: string,
    procedure?: string,
    feature?: string,
    offering?: string,
    expanded?: boolean,
    lang?: string,
    type: DatasetType.Trajectory
  }): Observable<HelgolandTrajectory>;

  getDataset(internalId: string | InternalDatasetId, filter?: DatasetFilter): Observable<HelgolandDataset>;

  getDataset(internalId: string | InternalDatasetId, filter: DatasetFilter = {}): Observable<HelgolandDataset> {
    internalId = this.checkInternalId(internalId);
    return this.getHandler(internalId.url).pipe(flatMap(h => h.getDataset(internalId, filter)));
  }

  getDatasetData(dataset: HelgolandTimeseries, timespan: Timespan, filter?: HelgolandDataFilter): Observable<HelgolandTimeseriesData>;

  getDatasetData(dataset: HelgolandTrajectory, timespan: Timespan, filter?: HelgolandDataFilter): Observable<HelgolandTrajectoryData>;

  getDatasetData(dataset: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter = {}): Observable<HelgolandData> {
    return this.getHandler(dataset.url).pipe(flatMap(h => h.getDatasetData(dataset, timespan, filter)));
  }

  getDatasetExtras(internalId: string | InternalDatasetId): Observable<DatasetExtras> {
    internalId = this.checkInternalId(internalId);
    return this.getHandler(internalId.url).pipe(flatMap(h => h.getDatasetExtras(internalId)));
  }

  private checkInternalId(internalId: string | InternalDatasetId) {
    if (typeof internalId === 'string') {
      internalId = this.internalIdHandler.resolveInternalId(internalId);
    }
    return internalId;
  }

  private getHandler(url: string): Observable<IHelgolandServiceConnectorHandler> {
    return new Observable<IHelgolandServiceConnectorHandler>((observer: Observer<IHelgolandServiceConnectorHandler>) => {
      if (this.serviceMapping.has(url)) {
        observer.next(this.serviceMapping.get(url));
        observer.complete();
        return;
      }
      if (!this.handler) {
        observer.error(`No services handler are configured...`);
        observer.complete();
        return;
      }
      const canHandleObs = this.handler.map(h => h.canHandle(url));
      combineLatest(canHandleObs).subscribe(res => {
        const idx = res.findIndex(e => e);
        if (idx >= 0) {
          const handler = this.handler[idx];
          this.serviceMapping.set(url, handler);
          console.log(`ConnectorHandler: ${url} works with ${handler.constructor.name}`);
          observer.next(handler);
          observer.complete();
        } else {
          observer.error(`No ConnectorHandler found for ${url}`);
          observer.complete();
        }
      });
    });
  }

}
