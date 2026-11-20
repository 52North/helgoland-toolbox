import { Injectable, inject } from '@angular/core';
import moment from 'moment';
import { Observable, from, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  toArray,
} from 'rxjs/operators';

import { HttpService } from '../../../dataset-api/http.service';
import {
  InternalDatasetId,
  InternalIdHandler,
} from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { FirstLastValue } from '../../../model/dataset-api/dataset';
import { Feature } from '../../../model/dataset-api/feature';
import { Offering } from '../../../model/dataset-api/offering';
import { Phenomenon } from '../../../model/dataset-api/phenomenon';
import { Procedure } from '../../../model/dataset-api/procedure';
import { Timespan } from '../../../model/internal/timeInterval';
import { HELGOLAND_SERVICE_CONNECTOR_HANDLER } from '../../helgoland-services-connector';
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
import {
  HelgolandService,
  HelgolandServiceQuantities,
} from '../../model/internal/service';

// HyDAS API model (HydroDaten-API-Standard), see https://pegelonline.wsv.de/webservice/hydas

interface HydasMeta {
  title: string;
  version: string;
  publisherName: string;
  licenseName: string;
  licenseUrl: string;
}

interface HydasResponse<T> {
  meta: HydasMeta;
  data: T;
}

interface HydasStation {
  id: string;
  name: string;
  waterBodyName: string;
  number?: string;
  state?: string;
  operator?: string;
  operatorUrl?: string;
  url?: string;
  coordinates?: { lat: number; lon: number };
  referenceElevation?: { value: number; unit: string; unitDisplay: string };
  riverLocation?: {
    riverKilometre: number;
    stationingOrigin: 'source' | 'mouth';
  };
}

type HydasProcedure =
  | 'measured'
  | 'manual'
  | 'calculated'
  | 'simulated'
  | 'predicted';

interface HydasParameter {
  id: string;
  name: string;
  interval?: string;
  availability?: { start: string; end: string }[];
  unitDisplay?: string;
  procedure?: HydasProcedure;
  status?: { condition: 'operational' | 'impaired'; message?: string };
}

interface HydasValue {
  timestamp: string;
  value: number | null;
}

interface StationWithParameters {
  station: HydasStation;
  parameters: HydasParameter[];
}

const DATASET_ID_SEPARATOR = '/';
// used to probe the endpoint in canHandle and to fetch the meta block without loading all stations
const NIL_UUID = '00000000-0000-0000-0000-000000000000';
// max parallel requests when parameters of all stations are needed
const PARAMETER_REQUEST_CONCURRENCY = 8;

const PROCEDURE_LABELS: Record<HydasProcedure, string> = {
  measured: 'Messwert',
  manual: 'Manuelle Ablesung',
  calculated: 'Berechneter Wert',
  simulated: 'Simulation',
  predicted: 'Vorhersage',
};

/**
 * Connector for APIs implementing the HydroDaten-API-Standard (HyDAS), e.g. PEGELONLINE.
 *
 * Mapping:
 * - station -> platform / feature
 * - waterBodyName -> category
 * - parameter -> phenomenon
 * - parameter.procedure -> procedure
 * - station + parameter -> timeseries dataset with id `{stationId}/{parameterId}`
 *
 * The service url is the api base url, e.g. `https://pegelonline.wsv.de/api/v1`.
 */
@Injectable({
  providedIn: 'root',
})
export class HydasApiConnector implements HelgolandServiceConnector {
  protected http = inject(HttpService);

  name = 'HydasApiConnector';

  private stationsCache = new Map<string, Observable<HydasStation[]>>();
  private parametersCache = new Map<string, Observable<HydasParameter[]>>();

  canHandle(url: string): Observable<boolean> {
    return this.request<HydasStation[]>(url, 'stations', {
      ids: NIL_UUID,
    }).pipe(
      map((res) => !!res?.meta?.version && Array.isArray(res.data)),
      catchError(() => of(false)),
    );
  }

  getServices(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService[]> {
    return this.getService('', url, filter).pipe(map((s) => [s]));
  }

  getService(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandService> {
    return this.request<HydasStation[]>(url, 'stations', {
      ids: NIL_UUID,
    }).pipe(map((res) => this.createService(url, res.meta)));
  }

  getCategories(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category[]> {
    return this.getFilteredStations(url, filter).pipe(
      map((entries) => {
        const waters = new Set(entries.map((e) => e.station.waterBodyName));
        return Array.from(waters)
          .map((w) => this.createCategory(w))
          .sort((a, b) => a.label.localeCompare(b.label));
      }),
    );
  }

  getCategory(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category> {
    return this.getStations(url).pipe(
      map((stations) => {
        if (stations.some((s) => s.waterBodyName === id)) {
          return this.createCategory(id);
        }
        throw new Error(`Could not find category for Id '${id}'.`);
      }),
    );
  }

  // HyDAS has no offering concept
  getOfferings(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering[]> {
    return of([]);
  }

  getOffering(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering> {
    return throwError(() => new Error('HyDAS does not support offerings.'));
  }

  getPhenomena(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon[]> {
    return this.getFilteredStations(url, filter).pipe(
      map((entries) => {
        const phenomena = new Map<string, Phenomenon>();
        entries.forEach((e) =>
          e.parameters.forEach((p) => {
            if (!phenomena.has(p.id))
              phenomena.set(p.id, this.createPhenomenon(p));
          }),
        );
        return this.sortByLabel(Array.from(phenomena.values()));
      }),
    );
  }

  getPhenomenon(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon> {
    return this.getPhenomena(url, { ...filter, phenomenon: id }).pipe(
      map((list) => {
        if (list.length) return list[0];
        throw new Error(`Could not find phenomenon for Id '${id}'.`);
      }),
    );
  }

  getProcedures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure[]> {
    return this.getFilteredStations(url, filter).pipe(
      map((entries) => {
        const procedures = new Set<HydasProcedure>();
        entries.forEach((e) =>
          e.parameters.forEach(
            (p) => p.procedure && procedures.add(p.procedure),
          ),
        );
        return Array.from(procedures).map((p) => this.createProcedure(p));
      }),
    );
  }

  getProcedure(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure> {
    if (id in PROCEDURE_LABELS) {
      return of(this.createProcedure(id as HydasProcedure));
    }
    return throwError(
      () => new Error(`Could not find procedure for Id '${id}'.`),
    );
  }

  getFeatures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature[]> {
    return this.getFilteredStations(url, filter).pipe(
      map((entries) =>
        this.sortByLabel(entries.map((e) => this.createFeature(e.station))),
      ),
    );
  }

  getFeature(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature> {
    return this.getStation(url, id).pipe(map((s) => this.createFeature(s)));
  }

  getPlatforms(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform[]> {
    return this.getFilteredStations(url, filter).pipe(
      map((entries) =>
        entries
          .filter((e) => e.station.coordinates)
          .map((e) => this.createPlatform(e.station, e.parameters)),
      ),
    );
  }

  getPlatform(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform> {
    return this.getStation(url, id).pipe(
      switchMap((station) =>
        this.getStationParameters(url, id).pipe(
          map((parameters) => this.createPlatform(station, parameters)),
        ),
      ),
    );
  }

  getDatasets(
    url: string,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset[]> {
    if (this.filterTimeseriesMatchesNot(filter)) return of([]);
    return this.getFilteredStations(url, filter).pipe(
      map((entries) =>
        entries.flatMap((e) =>
          e.parameters.map(
            (p) =>
              new HelgolandDataset(
                this.createDatasetId(e.station.id, p.id),
                url,
                this.createDatasetLabel(e.station, p),
              ),
          ),
        ),
      ),
    );
  }

  getDataset(
    internalId: string | InternalDatasetId,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset> {
    const { url, id } = new InternalIdHandler().resolveInternalId(internalId);
    const [stationId, parameterId] = this.splitDatasetId(id);
    // request the parameter uncached, to get the current availability
    return this.getStation(url, stationId).pipe(
      switchMap((station) =>
        this.request<HydasParameter[]>(
          url,
          `stations/${stationId}/parameters`,
          { ids: parameterId },
        ).pipe(
          map((res) => {
            const parameter = res.data.find((p) => p.id === parameterId);
            if (!parameter) {
              throw new Error(`Could not find dataset for Id '${id}'.`);
            }
            return this.createTimeseries(url, station, parameter);
          }),
        ),
      ),
    );
  }

  getDatasetData(
    dataset: HelgolandDataset,
    timespan: Timespan,
    filter: HelgolandDataFilter,
  ): Observable<HelgolandData> {
    if (!(dataset instanceof HelgolandTimeseries)) {
      return throwError(
        () => new Error('HyDAS connector only supports timeseries.'),
      );
    }
    const [stationId, parameterId] = this.splitDatasetId(dataset.id);
    return this.request<HydasValue[]>(
      dataset.url,
      `stations/${stationId}/parameters/${parameterId}/values`,
      {
        from: this.createISOString(timespan.from),
        to: this.createISOString(timespan.to),
      },
    ).pipe(
      map(
        (res) =>
          new HelgolandTimeseriesData(
            res.data.map((v) => [
              moment(v.timestamp).valueOf(),
              v.value ?? (null as unknown as number),
            ]),
          ),
      ),
    );
  }

  createCsvDataExportLink(
    internalId: string | InternalDatasetId,
    params: HelgolandCsvExportLinkParams,
  ): Observable<string> {
    return throwError(() => new Error('Could not create csv data export link'));
  }

  getDatasetExtras(
    internalId: string | InternalDatasetId,
  ): Observable<DatasetExtras> {
    const { url } = new InternalIdHandler().resolveInternalId(internalId);
    return this.request<HydasStation[]>(url, 'stations', {
      ids: NIL_UUID,
    }).pipe(
      map((res) => ({ license: res.meta.licenseName })),
      catchError(() => of({})),
    );
  }

  // requests

  protected request<T>(
    apiUrl: string,
    endpoint: string,
    params?: Record<string, string>,
  ): Observable<HydasResponse<T>> {
    const base = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    // build query manually: Angular's HttpParams would not encode '+' of timezone offsets
    const query = params
      ? '?' +
        Object.entries(params)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
    return this.http
      .client()
      .get<HydasResponse<T>>(`${base}/${endpoint}${query}`);
  }

  /** The station list is returned completely without paging, so it is loaded once and cached. */
  private getStations(url: string): Observable<HydasStation[]> {
    if (!this.stationsCache.has(url)) {
      this.stationsCache.set(
        url,
        this.request<HydasStation[]>(url, 'stations').pipe(
          map((res) => res.data),
          shareReplay(1),
        ),
      );
    }
    return this.stationsCache.get(url)!;
  }

  private getStation(url: string, id: string): Observable<HydasStation> {
    return this.request<HydasStation[]>(url, 'stations', { ids: id }).pipe(
      map((res) => {
        if (res.data.length) return res.data[0];
        throw new Error(`Could not find station for Id '${id}'.`);
      }),
    );
  }

  private getStationParameters(
    url: string,
    stationId: string,
  ): Observable<HydasParameter[]> {
    const key = `${url}${DATASET_ID_SEPARATOR}${stationId}`;
    if (!this.parametersCache.has(key)) {
      this.parametersCache.set(
        key,
        this.request<HydasParameter[]>(
          url,
          `stations/${stationId}/parameters`,
        ).pipe(
          map((res) => res.data),
          shareReplay(1),
        ),
      );
    }
    return this.parametersCache.get(key)!;
  }

  /**
   * Returns the stations matching the filter together with their (filtered) parameters.
   *
   * Parameters are only available per station. Without a feature filter the parameters of every
   * station are requested (with limited concurrency), which is expensive on the first call.
   */
  private getFilteredStations(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<StationWithParameters[]> {
    return this.getStations(url).pipe(
      map((stations) =>
        stations.filter(
          (s) =>
            (!filter.feature || s.id === filter.feature) &&
            (!filter.platform || s.id === filter.platform) &&
            (!filter.category || s.waterBodyName === filter.category),
        ),
      ),
      switchMap((stations) =>
        stations.length
          ? from(stations).pipe(
              mergeMap(
                (station) =>
                  this.getStationParameters(url, station.id).pipe(
                    map((parameters) => ({
                      station,
                      parameters: parameters.filter(
                        (p) =>
                          (!filter.phenomenon || p.id === filter.phenomenon) &&
                          (!filter.procedure ||
                            p.procedure === filter.procedure),
                      ),
                    })),
                    // a single failing station should not break the whole list
                    catchError(() => of({ station, parameters: [] })),
                  ),
                PARAMETER_REQUEST_CONCURRENCY,
              ),
              toArray(),
            )
          : of([]),
      ),
      map((entries) => {
        const parameterFilterSet = !!filter.phenomenon || !!filter.procedure;
        return entries.filter(
          (e) => !parameterFilterSet || e.parameters.length,
        );
      }),
    );
  }

  // mapping

  private createService(url: string, meta: HydasMeta): HelgolandService {
    const quantities: HelgolandServiceQuantities = {
      datasets: -1,
    };
    return new HelgolandService(
      url,
      url,
      meta.title,
      meta.publisherName,
      meta.version,
      quantities,
    );
  }

  private createCategory(waterBodyName: string): Category {
    return { id: waterBodyName, label: waterBodyName };
  }

  private createPhenomenon(p: HydasParameter): Phenomenon {
    return { id: p.id, label: `${p.name} (${p.id})` };
  }

  private createProcedure(p: HydasProcedure): Procedure {
    return { id: p, label: PROCEDURE_LABELS[p] };
  }

  private createFeature(s: HydasStation): Feature {
    return { id: s.id, label: s.name, domainId: s.number ?? s.id };
  }

  private createPlatform(
    s: HydasStation,
    parameters: HydasParameter[],
  ): HelgolandPlatform {
    return new HelgolandPlatform(
      s.id,
      s.name,
      parameters.map((p) => this.createDatasetId(s.id, p.id)),
      s.coordinates
        ? { type: 'Point', coordinates: [s.coordinates.lon, s.coordinates.lat] }
        : undefined,
    );
  }

  private createTimeseries(
    url: string,
    station: HydasStation,
    parameter: HydasParameter,
  ): HelgolandTimeseries {
    const { first, last } = this.createFirstLastValue(parameter);
    return new HelgolandTimeseries(
      this.createDatasetId(station.id, parameter.id),
      url,
      this.createDatasetLabel(station, parameter),
      parameter.status?.condition === 'impaired'
        ? parameter.status.message
        : undefined,
      parameter.unitDisplay ?? '',
      new HelgolandPlatform(
        station.id,
        station.name,
        [],
        station.coordinates
          ? {
              type: 'Point',
              coordinates: [station.coordinates.lon, station.coordinates.lat],
            }
          : undefined,
      ),
      first,
      last,
      [],
      undefined,
      {
        service: { id: url, label: url },
        feature: this.createFeature(station),
        phenomenon: this.createPhenomenon(parameter),
        procedure: parameter.procedure
          ? this.createProcedure(parameter.procedure)
          : undefined,
        category: [this.createCategory(station.waterBodyName)],
      },
    );
  }

  /**
   * First and last timestamp come from the parameter availability. The values itself are unknown
   * without an additional values request.
   */
  private createFirstLastValue(parameter: HydasParameter): {
    first?: FirstLastValue;
    last?: FirstLastValue;
  } {
    const availability = parameter.availability;
    if (!availability?.length) return {};
    const starts = availability.map((a) => moment(a.start).valueOf());
    const ends = availability.map((a) => moment(a.end).valueOf());
    return {
      first: { timestamp: Math.min(...starts) },
      last: { timestamp: Math.max(...ends) },
    };
  }

  private createDatasetId(stationId: string, parameterId: string): string {
    return `${stationId}${DATASET_ID_SEPARATOR}${parameterId}`;
  }

  private splitDatasetId(id: string): [string, string] {
    const idx = id.indexOf(DATASET_ID_SEPARATOR);
    if (idx < 0) throw new Error(`Invalid HyDAS dataset id '${id}'.`);
    return [id.substring(0, idx), id.substring(idx + 1)];
  }

  private createDatasetLabel(s: HydasStation, p: HydasParameter): string {
    return `${p.name} @ ${s.name} (${s.waterBodyName})`;
  }

  protected createISOString(time: number): string {
    return moment(time).toISOString();
  }

  protected filterTimeseriesMatchesNot(
    filter: HelgolandParameterFilter,
  ): boolean {
    return (filter.type && filter.type !== DatasetType.Timeseries) || false;
  }

  private sortByLabel<T extends { label: string }>(items: T[]): T[] {
    return items.sort((a, b) => a.label.localeCompare(b.label));
  }
}

export const HydasApiConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: HydasApiConnector,
  multi: true,
};
