import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ApiInterface } from '../../../abstract-services/api-interface';
import { UriParameterCoder } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { HttpRequestOptions, ParameterFilter } from '../../../model/internal/http-requests';
import { DatasetExtras } from '../../model/internal/dataset';
import { Data, TimeValueTuple } from './../../../model/dataset-api/data';

export interface ApiV3Parameter {
  id: string;
}

export interface ApiV3Feature extends ApiV3Parameter {
  properties: {
    label: string;
    href: string;
    domainId: string;
    datasets: {
      [key: string]: {
        phenomenon: ApiV3Phenomenon,
        procedure: ApiV3Procedure,
        category: ApiV3Category,
        offering: ApiV3Offering,
        service: {
          id: string;
          href: string;
          label: string;
        }
      }
    }
  };
  type: string;
  geometry: GeoJSON.GeometryObject;
}

export interface ApiV3Category extends ApiV3Parameter {
  href: string;
  domainId: string;
  label: string;
}

export interface ApiV3Offering extends ApiV3Parameter {
  href: string;
  domainId: string;
  label: string;
}

export interface ApiV3Phenomenon extends ApiV3Parameter {
  href: string;
  domainId: string;
  label: string;
}

export interface ApiV3Procedure extends ApiV3Parameter {
  href: string;
  domainId: string;
  label: string;
}

export interface ApiV3Platform extends ApiV3Parameter {
  href: string;
  domainId: string;
  label: string;
}

export interface ApiV3Service extends ApiV3Parameter {
  href: string;
  label: string;
  extras: string[];
  version: string;
  type: string;
  supportsFirstLatest: boolean;
  quantities: {
    categories: number;
    sampling: number;
    datasets: {
      profiles: number;
      timeseries: number;
      total: number;
      individualObservations: number;
      trajectories: number;
    }
    measuringPrograms: number;
    features: number;
    procedures: number;
    offerings: number;
    phenomena: number;
    platforms: number;
  };
}

export interface ApiV3Dataset extends ApiV3Parameter {
  href: string;
  label: string;
  datasetType: ApiV3DatasetTypes;
  observationType: string;
  valueType: string;
  mobile: boolean;
  insitu: boolean;
  uom: string;
  originTimezone: string;
  samplingTimeStart: string;
  samplingTimeEnd: string;
  feature: ApiV3Feature;
  firstValue: ApiV3FirstLastValue;
  lastValue: ApiV3FirstLastValue;
  parameters: {
    phenomenon: ApiV3Phenomenon,
    procedure: ApiV3Procedure,
    category: ApiV3Category,
    offering: ApiV3Offering,
    service: {
      id: string;
      href: string;
      label: string;
    },
    platforms: ApiV3Platform
  };
}

export interface ApiV3FirstLastValue {
  timestamp: string;
  value: number;
}

export enum ApiV3DatasetTypes {
  Profile = 'profile',
  Timeseries = 'timeseries',
  IndividualObservation = 'individualObservation',
  Trajectory = 'trajectory'
}

export enum ApiV3ObservationTypes {
  Simple = 'simple'
}

export enum ApiV3ValueTypes {
  Text = 'text',
  Quantity = 'quantity'
}

export interface ApiV3ParameterFilter {
  datasetTypes?: ApiV3DatasetTypes;
  observationTypes?: ApiV3ObservationTypes;
  valuesTypes?: ApiV3ValueTypes;
  expanded?: boolean;
  feature?: string;
  offering?: string;
  phenomenon?: string;
  category?: string;
  procedure?: string;
  lang?: string;
}

export interface ApiV3DatasetDataFilter {
  timespan?: string;
  format?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiV3InterfaceService extends ApiInterface {

  constructor(
    protected httpService: HttpService,
    protected translate: TranslateService
  ) { super(); }

  public getServices(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Service[]> {
    const url = this.createRequestUrl(apiUrl, 'services');
    return this.requestApi<ApiV3Service[]>(url, params, options);
  }

  public getCategories(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Category[]> {
    const url = this.createRequestUrl(apiUrl, 'categories');
    return this.requestApi<ApiV3Category[]>(url, params, options);
  }

  public getCategory(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Category> {
    const url = this.createRequestUrl(apiUrl, 'categories', id);
    return this.requestApi<ApiV3Category>(url, params, options);
  }

  public getOfferings(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Offering[]> {
    const url = this.createRequestUrl(apiUrl, 'offerings');
    return this.requestApi<ApiV3Offering[]>(url, params, options);
  }

  public getOffering(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Offering> {
    const url = this.createRequestUrl(apiUrl, 'offerings', id);
    return this.requestApi<ApiV3Offering>(url, params, options);
  }

  public getPhenomena(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Phenomenon[]> {
    const url = this.createRequestUrl(apiUrl, 'phenomena');
    return this.requestApi<ApiV3Phenomenon[]>(url, params, options);
  }

  public getPhenomenon(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Phenomenon> {
    const url = this.createRequestUrl(apiUrl, 'phenomena', id);
    return this.requestApi<ApiV3Phenomenon>(url, params, options);
  }

  public getFeatures(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Feature[]> {
    const url = this.createRequestUrl(apiUrl, 'features');
    return this.requestApi<ApiV3Feature[]>(url, params, options);
  }

  public getFeature(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Feature> {
    const url = this.createRequestUrl(apiUrl, 'features', id);
    return this.requestApi<ApiV3Feature>(url, params, options);
  }

  public getProcedures(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Procedure[]> {
    const url = this.createRequestUrl(apiUrl, 'procedures');
    return this.requestApi<ApiV3Procedure[]>(url, params, options);
  }

  public getProcedure(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Procedure> {
    const url = this.createRequestUrl(apiUrl, 'procedures', id);
    return this.requestApi<ApiV3Procedure>(url, params, options);
  }

  public getDatasets(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Dataset[]> {
    const url = this.createRequestUrl(apiUrl, 'datasets');
    return this.requestApi<ApiV3Dataset[]>(url, params, options);
  }

  public getDataset(id: string, apiUrl: string, params?: ApiV3ParameterFilter): Observable<ApiV3Dataset> {
    const url = this.createRequestUrl(apiUrl, 'datasets', id);
    return this.requestApi<ApiV3Dataset>(url, params);
  }

  public getDatasetData(id: string, apiUrl: string, filter?: ApiV3DatasetDataFilter): Observable<Data<TimeValueTuple>> {
    const url = this.createRequestUrl(apiUrl, 'datasets', `${id}/observations`);
    return this.requestApi<Data<TimeValueTuple>>(url, filter);
  }

  public getDatasetExtras(id: string, apiUrl: string): Observable<DatasetExtras> {
    const url = this.createRequestUrl(apiUrl, 'timeseries', id);
    return this.requestApi<DatasetExtras>(url + '/extras');
  }

  protected requestApi<T>(
    url: string, params: ParameterFilter = {}, options: HttpRequestOptions = {}
  ): Observable<T> {
    return this.httpService.client(options).get<T>(url,
      {
        params: this.prepareParams(params),
        headers: this.createBasicAuthHeader(options.basicAuthToken)
      }
    );
  }

  protected prepareParams(params: ParameterFilter): HttpParams {
    if (this.translate && this.translate.currentLang) {
      params.locale = this.translate.currentLang;
    }
    let httpParams = new HttpParams({
      encoder: new UriParameterCoder()
    });
    Object.getOwnPropertyNames(params)
      .forEach((key) => httpParams = httpParams.set(key, params[key]));
    return httpParams;
  }

}
