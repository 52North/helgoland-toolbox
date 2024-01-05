import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, Observer, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  FirstLastValue,
  Offering,
  Phenomenon,
  TimeValueTuple,
} from '../../../../public-api';
import { HttpService } from '../../../dataset-api/http.service';
import { InternalDatasetId } from '../../../dataset-api/internal-id-handler.service';
import { Category } from '../../../model/dataset-api/category';
import { Feature } from '../../../model/dataset-api/feature';
import { Parameter } from '../../../model/dataset-api/parameter';
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

interface PegelonlineEntity {
  shortname: string;
  longname: string;
}

interface PegelonlineWater extends PegelonlineEntity {}

interface PegelonlineTimeseries extends PegelonlineEntity {
  end: string;
  equidistance: number;
  start: string;
  unit: string;
  gauges: {
    exchangeNumber: string;
  }[];
  currentMeasurement: {
    timestamp: string;
    value: number;
  };
}

interface PegelonlineStation extends PegelonlineEntity {
  agency: string;
  km: number;
  latitude: number | undefined;
  longitude: number;
  number: string;
  timeseries: PegelonlineTimeseries[];
  uuid: string;
  water: PegelonlineWater;
}

interface PegelonlineInternalDatasetId extends InternalDatasetId {
  gaugeId?: string;
  stationId?: string;
}

export interface DatasetItemValue {
  timestamp: number;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class PegelonlineApiV1Connector implements HelgolandServiceConnector {
  name = 'PegelonlineApiConnector';

  constructor(protected http: HttpService) {}

  canHandle(url: string): Observable<boolean> {
    // TODO: could be removed, if only used configured connector
    return new Observable((observer: Observer<boolean>) => {
      if (
        url ==
        'https://www.pegelonline.wsv.de/webservices/nutzer/rest-api/v2/stations/'
      )
        observer.next(true);
      else observer.next(false);
      observer.complete();
    });
  }

  getServices(
    apiUrl: string,
    params: HelgolandParameterFilter,
  ): Observable<HelgolandService[]> {
    return of([this.createService(apiUrl)]);
  }

  getService(
    id: string,
    url: string,
    params: HelgolandParameterFilter,
  ): Observable<HelgolandService> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getCategories(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category[]> {
    return this.httpCall<PegelonlineWater[]>(
      url,
      'waters',
      this.createCategoriesFilter(filter),
    ).pipe(map((res) => res.map((e) => this.createCategory(e))));
  }

  private createCategory(e: PegelonlineWater): Category {
    return {
      id: e.shortname,
      label: this.ucwords(e.longname),
    };
  }

  protected createCategoriesFilter(filter: HelgolandParameterFilter): string {
    let parameter: string[] = [];
    if (filter.phenomenon)
      parameter.push(`timeseries=${filter.phenomenon}&includeTimeseries=true`);
    if (filter.feature)
      parameter.push(`stations=${filter.feature}&includeStations=true`);
    return parameter.join('&');
  }

  protected httpCall<T>(
    apiUrl: string,
    endpoint: string,
    parameters: string | undefined,
  ): Observable<T> {
    apiUrl = apiUrl.endsWith('stations')
      ? apiUrl.substring(0, apiUrl.length - 8)
      : apiUrl;
    if (parameters) parameters = `?${parameters}`;
    else parameters = '';
    return this.http.client().get<T>(`${apiUrl}${endpoint}/${parameters}`);
  }

  getCategory(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Category> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getOfferings(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering[]> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getOffering(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Offering> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getPhenomena(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon[]> {
    const ignoreStationsWithoutCoordinates = !(
      Object.keys(filter).length >= 2 &&
      filter.service !== undefined &&
      filter.type !== undefined
    );
    return this.httpCall<PegelonlineStation[]>(
      url,
      'stations',
      this.createPhenomenaFilter(filter),
    ).pipe(
      map((res) =>
        this.getPhenomenaFromStations(res, ignoreStationsWithoutCoordinates),
      ),
    );
  }

  getPhenomenaFromStations(
    stations: PegelonlineStation[],
    ignoreStationsWithoutCoordinates: boolean,
  ): Phenomenon[] {
    const phenomenons = new Map<string, Phenomenon>();
    stations.forEach((station) => {
      const hasNoCoordinates = !station.latitude || !station.longitude;
      if (ignoreStationsWithoutCoordinates && hasNoCoordinates) {
      } else {
        station.timeseries.forEach((ts) => {
          if (!phenomenons.has(ts.shortname)) {
            phenomenons.set(ts.shortname, {
              id: ts.shortname,
              label: ts.longname,
            });
          }
        });
      }
    });
    return this.adjustList(Array.from(phenomenons.values()));
  }

  private createPhenomenaFilter(filter: HelgolandParameterFilter): string {
    let parameter: string[] = ['includeTimeseries=true'];
    if (filter.feature) parameter.push(`ids=${filter.feature}`);
    if (filter.category) parameter.push(`waters=${filter.category}`);
    return parameter.join('&');
  }

  getPhenomenon(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Phenomenon> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getProcedures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure[]> {
    return new Observable((observer: Observer<Procedure[]>) => {
      observer.next([
        {
          id: '0',
          label: 'Einzelwerte',
        },
      ]);
      observer.complete();
    });
  }

  getProcedure(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Procedure> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getFeatures(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature[]> {
    return this.httpCall<PegelonlineStation[]>(
      url,
      'stations',
      this.createFeaturesFilter(filter),
    ).pipe(
      map((res) => {
        let features: Feature[] = [];
        for (const [key, value] of Object.entries(res)) {
          features.push(this.prepFeature(value));
        }
        // sort alphabetically
        features.sort((a, b) => a.label.localeCompare(b.label));
        return features;
      }),
    );
  }

  private createFeaturesFilter(filter: HelgolandParameterFilter) {
    let parameter: string[] = [];
    if (filter.phenomenon)
      parameter.push(`timeseries=${filter.phenomenon}&includeTimeseries=true`);
    if (filter.category) parameter.push(`waters=${filter.category}`);
    return parameter.length ? parameter.join('&') : undefined;
  }

  private prepFeature(item: PegelonlineStation): Feature {
    return {
      id: item.uuid,
      label: this.ucwords(item.longname),
    };
  }

  getFeature(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<Feature> {
    return this.httpCall(url, 'stations', 'includeTimeseries=true');
  }

  getPlatforms(
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform[]> {
    return this.httpCall<PegelonlineStation[]>(
      url,
      'stations',
      'includeTimeseries=true',
    ).pipe(
      map((res) => {
        if (filter.phenomenon) {
          return res.filter((e) =>
            e.timeseries.some((t) => t.shortname === filter.phenomenon),
          );
        } else {
          return res;
        }
      }),
      map((res) =>
        res
          .filter((e) => e.longitude && e.latitude)
          .map((e) => this.prepStation(e)),
      ),
    );
  }

  getPlatform(
    id: string,
    url: string,
    filter: HelgolandParameterFilter,
  ): Observable<HelgolandPlatform> {
    return this.httpCall<PegelonlineStation[]>(
      url,
      'stations',
      'includeTimeseries=true',
    ).pipe(
      map((res) => {
        const match = res.find((e) => e.uuid === id);
        if (match) {
          return this.prepStation(match);
        }
        throw new Error(`Could not find platform for Id '${id}'.`);
      }),
    );
  }

  // helper
  private prepStation(item: PegelonlineStation): HelgolandPlatform {
    let lon = 10;
    let lat = 52;
    if (item.latitude) lat = item.latitude;
    if (item.longitude) lon = item.longitude;
    return {
      id: item.uuid,
      label: item.longname,
      datasetIds: this.getStationTimeseries(item),
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    };
  }

  private getStationTimeseries(stationData: PegelonlineStation): string[] {
    let ret: string[] = [];
    if (stationData.timeseries) {
      stationData.timeseries.forEach((timeset) => {
        if (timeset.gauges) {
          timeset.gauges.forEach((gauge) => {
            ret.push(
              `${stationData.uuid}/${gauge.exchangeNumber}/${timeset.shortname}`,
            );
          });
        }
      });
    }
    return ret;
  }

  getDatasets(
    url: string,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset[]> {
    return new Observable((observer: Observer<HelgolandDataset[]>) => {
      this.httpCall<PegelonlineStation[]>(
        url,
        'stations',
        this.createDatasetsFilter(filter),
      ).subscribe(
        (res) => {
          let ret: HelgolandDataset[] = [];
          for (const [key, value] of Object.entries(res)) {
            let item = value;
            item.timeseries.forEach((timeset) => {
              let longname = timeset.longname;
              if (timeset.gauges) {
                timeset.gauges.forEach((gauge) => {
                  timeset.longname = `${this.ucwords(longname)} (${
                    timeset.shortname
                  }), ${this.ucwords(item.longname)} (${gauge.exchangeNumber})`;
                  const id = `${item.uuid}/${gauge.exchangeNumber}/${timeset.shortname}`;
                  const label = timeset.longname;
                  ret.push(new HelgolandDataset(id, url, label));
                });
              }
            });
          }
          observer.next(ret);
          observer.complete();
        },
        (error) => {
          observer.error(error);
          observer.complete();
        },
      );
    });
  }

  protected createDatasetsFilter(filter: HelgolandParameterFilter): string {
    let parameter: string[] = [];
    if (filter.phenomenon) parameter.push(`timeseries=${filter.phenomenon}`);
    if (filter.feature)
      parameter.push(`ids=${filter.feature}&includeStations=true`);
    if (filter.category) parameter.push(`waters=${filter.category}`);
    return `${parameter.join('&')}&includeTimeseries=true`;
  }

  getDataset(
    internalId: PegelonlineInternalDatasetId,
    filter: DatasetFilter,
  ): Observable<HelgolandDataset> {
    // check if call from selected->emit
    if (internalId.id.indexOf('/') > 0) {
      let part = internalId.id.split('/');
      internalId.stationId = part[0];
      internalId.gaugeId = part[1];
      internalId.id = part[2];
    }
    return new Observable((observer: Observer<HelgolandDataset>) => {
      this.httpCall<PegelonlineStation>(
        internalId.url,
        `stations/${internalId.stationId}`,
        `timeseries=${internalId.id}&includeTimeseries=true&includeCurrentMeasurement=true`,
      ).subscribe(
        (res) => {
          const dataset = this.prepDataset(
            internalId.url,
            `${internalId.stationId}/${internalId.gaugeId}`,
            internalId.gaugeId,
            res,
          );
          if (dataset instanceof HelgolandTimeseries && internalId.stationId) {
            this.getDatasetLimitValues(internalId).subscribe(
              (extras) => {
                let limitData = this.prepTimeLimitData(extras);
                if (limitData) {
                  dataset.firstValue = limitData.first;
                  dataset.lastValue = limitData.last;
                }
                observer.next(dataset);
                observer.complete();
              },
              (error) => {
                observer.error(error);
                observer.complete();
              },
            );
          } else {
            observer.next(dataset);
            observer.complete();
          }
        },
        (error) => {
          observer.error(error);
          observer.complete();
        },
      );
    });
  }

  protected prepTimeLimitData(
    data: DatasetItemValue[],
  ): { first: FirstLastValue; last: FirstLastValue } | undefined {
    if (data.length > 0) {
      return {
        first: {
          timestamp: moment(data[0].timestamp).valueOf(),
          value: data[0].value,
        },
        last: {
          timestamp: moment(data[data.length - 1].timestamp).valueOf(),
          value: data[data.length - 1].value,
        },
      };
    } else {
      return undefined;
    }
  }

  private prepDataset(
    url: string,
    stationId: string | undefined,
    gaugeId: string | undefined,
    station: PegelonlineStation,
  ): HelgolandDataset {
    let dataset = station.timeseries[0];
    const platform = new HelgolandPlatform(
      station.uuid,
      this.ucwords(station.longname),
      [],
      undefined,
    );
    const phenomenonLabel = `${this.ucwords(dataset.longname)} (${
      dataset.shortname
    }) (${gaugeId})`;
    const featureLabel = `${station.longname} - ${station.agency}`;
    const label = `${this.ucwords(dataset.longname)} (${
      dataset.shortname
    }) @ ${this.ucwords(station.longname)}`;
    return new HelgolandTimeseries(
      `${stationId}/${dataset.shortname}`,
      url,
      label,
      dataset.unit,
      platform,
      undefined,
      undefined,
      [],
      undefined,
      {
        category: { id: '', label: this.ucwords(station.water.longname) },
        feature: { id: '', label: featureLabel, domainId: featureLabel },
        offering: { id: '', label: '2' },
        phenomenon: { id: dataset.shortname, label: phenomenonLabel },
        procedure: { id: '', label: 'Einzelwert' },
        service: { id: '2', label: 'pegelonline.wsv' },
      },
    );
  }

  private getDatasetLimitValues(
    ids: PegelonlineInternalDatasetId,
  ): Observable<DatasetItemValue[]> {
    const end = moment().endOf('day');
    const start = moment(end).subtract(1, 'month').startOf('day');
    if (ids.gaugeId) {
      return this.httpCall(
        ids.url,
        `stations/${ids.gaugeId}/measurements.json`,
        `start=${start.toISOString()}&end=${end.toISOString()}`,
      );
    } else {
      return this.httpCall(
        ids.url,
        `stations/${ids.stationId}/${ids.id}/measurements`,
        `start=${start.toISOString()}&end=${end.toISOString()}`,
      );
    }
  }

  getDatasetData(
    dataset: HelgolandDataset,
    timespan: Timespan,
    filter: HelgolandDataFilter,
  ): Observable<HelgolandData> {
    if (dataset instanceof HelgolandTimeseries) {
      return this.requestDatasetData(dataset).pipe(
        map((res) => this.createTimeseriesData(res, timespan)),
      );
    }
    throw new Error('No return option found.');
  }

  requestDatasetData(
    dataset: HelgolandDataset,
  ): Observable<DatasetItemValue[]> {
    const end = moment().endOf('day');
    const start = moment(end).subtract(1, 'month').startOf('day');
    if ((dataset.id.match(/\//g) || []).length == 1) {
      let ids = dataset.id.split('/');
      let stationId = ids[0];
      let phenomenon = ids[1];
      if (stationId && phenomenon) {
        return this.httpCall(
          dataset.url,
          `stations/${stationId}/${phenomenon}/measurements`,
          `start=${start.toISOString()}&end=${end.toISOString()}`,
        );
      }
      throw new Error('station/ident not given');
    } else {
      if ((dataset.id.match(/\//g) || []).length == 2) {
        let ids = dataset.id.split('/');
        let gaugeId = ids[1];
        if (gaugeId) {
          return this.httpCall(
            dataset.url,
            `stations/${gaugeId}/measurements.json`,
            `start=${start.toISOString()}&end=${end.toISOString()}`,
          );
        }
        throw new Error('station/ident not given');
      }
    }
    throw new Error('station/ident not given');
  }

  private createTimeseriesData(values: DatasetItemValue[], timespan: Timespan) {
    let items: TimeValueTuple[] = [];
    values.forEach((element, idx) => {
      const curr = moment(element.timestamp).valueOf();
      if (curr >= timespan.from && curr <= timespan.to) {
        items.push([curr, element.value]);
        return;
      }
      const next = moment(values[idx + 1]?.timestamp).valueOf();
      if (curr <= timespan.from && next >= timespan.from) {
        items.push([curr, element.value]);
        return;
      }
      const before = moment(values[idx - 1]?.timestamp).valueOf();
      if (curr >= timespan.to && before <= timespan.to) {
        items.push([curr, element.value]);
        return;
      }
    });
    const data = new HelgolandTimeseriesData(items);
    return data;
  }

  createCsvDataExportLink(
    internalId: string | InternalDatasetId,
    params: HelgolandCsvExportLinkParams,
  ): Observable<string> {
    return throwError('Could not create csv data export link');
  }

  getDatasetExtras(internalId: InternalDatasetId): Observable<DatasetExtras> {
    return of({});
  }

  protected createISOString(time: Date): string {
    return moment(time).toISOString();
  }

  protected createService(url: string): HelgolandService {
    const id = '1';
    const label = 'PegelOnline WSV';
    const type = 'RESTful API';
    const version = '1.0';
    const quantities: HelgolandServiceQuantities = {};

    quantities.categories = 1;
    quantities.features = 1299;
    quantities.offerings = 1299;
    // quantities.phenomena = this.getPhenomenaList().length;
    quantities.procedures = 1299;
    quantities.datasets = 1458;
    quantities.platforms = 1299;

    return new HelgolandService(id, url, label, type, version, quantities);
  }

  protected filterTimeseriesMatchesNot(
    filter: HelgolandParameterFilter,
  ): boolean {
    return (filter.type && filter.type !== DatasetType.Timeseries) || false;
  }

  private ucwords(string: string) {
    if (!string) return string;
    let parts1: string[] = [];
    string.split('-').forEach((word: string) => {
      parts1.push(
        word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase(),
      );
    });
    return parts1
      .join('-')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  }

  private adjustList(items: Parameter[]): Parameter[] {
    return items
      .map((i) => ({
        id: i.id,
        label: `${this.ucwords(i.label)} (${i.id})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}

export const PegelonlineApiConnectorProvider = {
  provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  useClass: PegelonlineApiV1Connector,
  multi: true,
};
