import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ApiInterface } from '../abstract-services/api-interface';
import { Category } from '../model/dataset-api/category';
import { Data, IDataEntry } from '../model/dataset-api/data';
import {
  Dataset,
  Timeseries,
  TimeseriesData,
  TimeseriesExtras,
} from '../model/dataset-api/dataset';
import { Feature } from '../model/dataset-api/feature';
import { Offering } from '../model/dataset-api/offering';
import { Phenomenon } from '../model/dataset-api/phenomenon';
import { Platform } from '../model/dataset-api/platform';
import { Procedure } from '../model/dataset-api/procedure';
import { Service } from '../model/dataset-api/service';
import { Station } from '../model/dataset-api/station';
import {
  DataParameterFilter,
  HttpRequestOptions,
  ParameterFilter,
} from '../model/internal/http-requests';
import { Timespan } from '../model/internal/timeInterval';
import { HttpService } from './http.service';
import { DatasetApiV2 } from './interfaces/api-v2.interface';

export class UriParameterCoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return key;
  }

  decodeValue(value: string): string {
    return value;
  }
}

export abstract class DatasetApiInterface
  extends ApiInterface
  implements DatasetApiV2
{
  constructor(
    protected httpService: HttpService,
    protected translate: TranslateService,
  ) {
    super();
  }

  abstract getPlatforms(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Platform[]>;
  abstract getPlatform(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Platform>;
  abstract getDatasets(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Dataset[]>;
  abstract getDataset(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Dataset>;
  abstract getDatasetByInternalId(
    internalId: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Dataset>;
  abstract getData<T extends IDataEntry>(
    id: string,
    apiUrl: string,
    timespan: Timespan,
    params?: DataParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Data<T>>;
  abstract getServices(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Service[]>;
  abstract getService(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Service>;
  abstract getStations(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Station[]>;
  abstract getStation(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Station>;
  abstract getTimeseries(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Timeseries[]>;
  abstract getTimeseriesData(
    apiUrl: string,
    ids: string[],
    timespan: Timespan,
    options?: HttpRequestOptions,
  ): Observable<TimeseriesData[]>;
  abstract getSingleTimeseries(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Timeseries>;
  abstract getSingleTimeseriesByInternalId(
    internalId: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Timeseries>;
  abstract getTimeseriesExtras(
    id: string,
    apiUrl: string,
  ): Observable<TimeseriesExtras>;
  abstract getTsData<T extends IDataEntry>(
    id: string,
    apiUrl: string,
    timespan: Timespan,
    params?: DataParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Data<T>>;
  abstract getCategories(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Category[]>;
  abstract getCategory(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Category>;
  abstract getPhenomena(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Phenomenon[]>;
  abstract getPhenomenon(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Phenomenon>;
  abstract getOfferings(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Offering[]>;
  abstract getOffering(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Offering>;
  abstract getFeatures(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Feature[]>;
  abstract getFeature(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Feature>;
  abstract getProcedures(
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Procedure[]>;
  abstract getProcedure(
    id: string,
    apiUrl: string,
    params?: ParameterFilter,
    options?: HttpRequestOptions,
  ): Observable<Procedure>;

  protected requestApi<T>(
    url: string,
    params: ParameterFilter = {},
    options: HttpRequestOptions = {},
  ): Observable<T> {
    return this.httpService.client(options).get<T>(url, {
      params: this.prepareParams(params),
      headers: this.createBasicAuthHeader(options.basicAuthToken),
    });
  }

  protected prepareParams(params: ParameterFilter): HttpParams {
    if (this.translate && this.translate.currentLang) {
      params['locale'] = this.translate.currentLang;
    }
    let httpParams = new HttpParams({
      encoder: new UriParameterCoder(),
    });
    Object.getOwnPropertyNames(params).forEach(
      (key) => (httpParams = httpParams.set(key, params[key])),
    );
    return httpParams;
  }
}
