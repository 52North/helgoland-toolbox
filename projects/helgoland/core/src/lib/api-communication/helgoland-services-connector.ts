import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { combineLatest, Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  InternalDatasetId,
  InternalIdHandler,
} from '../dataset-api/internal-id-handler.service';
import { Category } from '../model/dataset-api/category';
import { Feature } from '../model/dataset-api/feature';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Procedure } from '../model/dataset-api/procedure';
import { Timespan } from '../model/internal/timeInterval';
import { Settings } from '../model/settings/settings';
import { SettingsService } from '../settings/settings.service';
import {
  HelgolandServiceConnector,
  HelgolandServiceInterface,
} from './interfaces/service-connector-interfaces';
import {
  HelgolandData,
  HelgolandDataFilter,
  HelgolandProfileData,
  HelgolandTimeseriesData,
  HelgolandTrajectoryData,
} from './model/internal/data';
import {
  DatasetExtras,
  DatasetFilter,
  DatasetType,
  HelgolandDataset,
  HelgolandProfile,
  HelgolandTimeseries,
  HelgolandTrajectory,
} from './model/internal/dataset';
import {
  HelgolandCsvExportLinkParams,
  HelgolandParameterFilter,
} from './model/internal/filter';
import { HelgolandPlatform } from './model/internal/platform';
import { HelgolandService } from './model/internal/service';

export const HELGOLAND_SERVICE_CONNECTOR_HANDLER =
  new InjectionToken<HelgolandServiceConnector>(
    'HELGOLAND_SERVICE_CONNECTOR_HANDLER',
  );

@Injectable({
  providedIn: 'root',
})
export class HelgolandServicesConnector implements HelgolandServiceInterface {
  private serviceMapping: Map<string, HelgolandServiceConnector> = new Map();

  constructor(
    @Optional()
    @Inject(HELGOLAND_SERVICE_CONNECTOR_HANDLER)
    protected connectorList: HelgolandServiceConnector[] | null = [],
    private internalIdHandler: InternalIdHandler,
    private settings: SettingsService<Settings>,
  ) {}

  getServices(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<HelgolandService[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getServices(url, filter)),
    );
  }

  getService(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<HelgolandService> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getService(id, url, filter)),
    );
  }

  getCategories(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Category[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getCategories(url, filter)),
    );
  }

  getCategory(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Category> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getCategory(id, url, filter)),
    );
  }

  getOfferings(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Offering[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getOfferings(url, filter)),
    );
  }

  getOffering(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Offering> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getOffering(id, url, filter)),
    );
  }

  getPhenomena(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Phenomenon[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getPhenomena(url, filter)),
    );
  }

  getPhenomenon(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Phenomenon> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getPhenomenon(id, url, filter)),
    );
  }

  getProcedures(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Procedure[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getProcedures(url, filter)),
    );
  }

  getProcedure(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Procedure> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getProcedure(id, url, filter)),
    );
  }

  getFeatures(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Feature[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getFeatures(url, filter)),
    );
  }

  getFeature(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<Feature> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getFeature(id, url, filter)),
    );
  }

  getPlatforms(
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<HelgolandPlatform[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getPlatforms(url, filter)),
    );
  }

  getPlatform(
    id: string,
    url: string,
    filter: HelgolandParameterFilter = {},
  ): Observable<HelgolandPlatform> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getPlatform(id, url, filter)),
    );
  }

  getDatasets(
    url: string,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Timeseries;
    },
  ): Observable<HelgolandTimeseries[]>;

  getDatasets(
    url: string,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Trajectory;
    },
  ): Observable<HelgolandTrajectory[]>;

  getDatasets(
    url: string,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Profile;
    },
  ): Observable<HelgolandProfile[]>;

  getDatasets(
    internalId: string | InternalDatasetId,
    filter?: DatasetFilter,
  ): Observable<HelgolandDataset[]>;

  getDatasets(
    url: string,
    filter: DatasetFilter = {},
  ): Observable<HelgolandDataset[]> {
    return this.getConnector(url).pipe(
      mergeMap((h) => h.getDatasets(url, filter)),
    );
  }

  getDataset(
    internalId: string | InternalDatasetId,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Timeseries;
    },
  ): Observable<HelgolandTimeseries>;

  getDataset(
    internalId: string | InternalDatasetId,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Trajectory;
    },
  ): Observable<HelgolandTrajectory>;

  getDataset(
    internalId: string | InternalDatasetId,
    filter: {
      phenomenon?: string;
      category?: string;
      procedure?: string;
      feature?: string;
      offering?: string;
      service?: string;
      expanded?: boolean;
      locale?: string;
      type: DatasetType.Profile;
    },
  ): Observable<HelgolandProfile>;

  getDataset(
    internalId: string | InternalDatasetId,
    filter?: DatasetFilter,
  ): Observable<HelgolandDataset>;

  getDataset(
    internalId: string | InternalDatasetId,
    filter: DatasetFilter = {},
  ): Observable<HelgolandDataset> {
    internalId = this.internalIdHandler.resolveInternalId(internalId);
    return this.getConnector(internalId.url).pipe(
      mergeMap((h) => h.getDataset(internalId, filter)),
    );
  }

  getDatasetData(
    dataset: HelgolandTimeseries,
    timespan: Timespan,
    filter?: HelgolandDataFilter,
  ): Observable<HelgolandTimeseriesData>;

  getDatasetData(
    dataset: HelgolandProfile,
    timespan: Timespan,
    filter?: HelgolandDataFilter,
  ): Observable<HelgolandProfileData>;

  getDatasetData(
    dataset: HelgolandTrajectory,
    timespan: Timespan,
    filter?: HelgolandDataFilter,
  ): Observable<HelgolandTrajectoryData>;

  getDatasetData(
    dataset: HelgolandDataset,
    timespan: Timespan,
    filter: HelgolandDataFilter = {},
  ): Observable<HelgolandData> {
    return this.getConnector(dataset.url).pipe(
      mergeMap((h) => h.getDatasetData(dataset, timespan, filter)),
    );
  }

  createCsvDataExportLink(
    internalId: string | InternalDatasetId,
    params: HelgolandCsvExportLinkParams = {},
  ): Observable<string> {
    internalId = this.internalIdHandler.resolveInternalId(internalId);
    return this.getConnector(internalId.url).pipe(
      mergeMap((h) => h.createCsvDataExportLink(internalId, params)),
    );
  }

  getDatasetExtras(
    internalId: string | InternalDatasetId,
  ): Observable<DatasetExtras> {
    internalId = this.internalIdHandler.resolveInternalId(internalId);
    return this.getConnector(internalId.url).pipe(
      mergeMap((h) => h.getDatasetExtras(internalId)),
    );
  }

  private getConnector(url: string): Observable<HelgolandServiceConnector> {
    return new Observable<HelgolandServiceConnector>(
      (observer: Observer<HelgolandServiceConnector>) => {
        if (this.serviceMapping.has(url)) {
          observer.next(this.serviceMapping.get(url)!);
          observer.complete();
          return;
        }
        if (!this.connectorList) {
          observer.error('No service connectors are configured...');
          observer.complete();
          return;
        }

        const serviceConfig = this.settings
          .getSettings()
          .datasetApis?.find((e) => e.url === url);
        if (serviceConfig && serviceConfig.connector) {
          const connector = this.connectorList.find(
            (c) => c.name === serviceConfig.connector,
          );
          if (connector) {
            this.setConnector(url, connector, observer);
            return;
          } else {
            console.error(
              `Can't find the defined connector '${serviceConfig.connector}' of service with url '${serviceConfig.url}'`,
            );
          }
        }

        const canHandleObs = this.connectorList.map((c) => c.canHandle(url));
        combineLatest(canHandleObs).subscribe((res) => {
          const idx = res.findIndex((e) => e);
          if (idx >= 0) {
            const connector = this.connectorList![idx];
            this.setConnector(url, connector, observer);
            this.serviceMapping.set(url, connector);
            observer.next(connector);
            observer.complete();
          } else {
            observer.error(`No Connector found for ${url}`);
            observer.complete();
          }
        });
      },
    );
  }

  private setConnector(
    url: string,
    connector: HelgolandServiceConnector,
    observer: Observer<HelgolandServiceConnector>,
  ) {
    this.serviceMapping.set(url, connector);
    observer.next(connector);
    observer.complete();
  }
}
