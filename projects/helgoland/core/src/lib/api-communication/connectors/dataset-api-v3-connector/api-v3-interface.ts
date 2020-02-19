import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ApiInterface } from '../../../abstract-services/api-interface';
import { UriParameterCoder } from '../../../dataset-api/api-interface';
import { HttpService } from '../../../dataset-api/http.service';
import { Data, TimeValueTuple } from '../../../model/dataset-api/data';
import { HttpRequestOptions } from '../../../model/internal/http-requests';
import { DatasetExtras } from '../../model/internal/dataset';

export interface ApiV3Parameter {
  id?: string;
  href?: string;
  domainId?: string;
  label?: string;
}

export interface ApiV3Feature extends ApiV3Parameter {
  properties: {
    label: string;
    href: string;
    domainId: string;
    datasets?: {
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

export interface ApiV3Category extends ApiV3Parameter { }

export interface ApiV3Offering extends ApiV3Parameter { }

export interface ApiV3Phenomenon extends ApiV3Parameter { }

export interface ApiV3Procedure extends ApiV3Parameter { }

export interface ApiV3Platform extends ApiV3Parameter { }

export interface ApiV3Service extends ApiV3Parameter {
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
  Simple = 'simple',
  Profil = 'profile'
}

export enum ApiV3ValueTypes {
  Text = 'text',
  Quantity = 'quantity',
  Count = 'count'
}

export interface ApiV3ParameterFilter {
  datasetTypes?: ApiV3DatasetTypes[];
  observationTypes?: ApiV3ObservationTypes[];
  valueTypes?: ApiV3ValueTypes[];
  expanded?: boolean;
  feature?: string;
  offering?: string;
  phenomenon?: string;
  category?: string;
  procedure?: string;
  locale?: string;
}

export interface ApiV3DatasetDataFilter {
  timespan?: string;
  format?: string;
  unixTime?: boolean;
}

export interface ApiV3Sampler extends ApiV3Parameter { }

export interface ApiV3MeasuringProgram extends ApiV3Parameter { }

export interface ApiV3SamplingObservation {
  value: any;
  timestamp?: string;
  uom?: string;
  dataset?: ApiV3Parameter;
  phenomenon?: ApiV3Parameter;
  category?: ApiV3Parameter;
  procedure?: ApiV3Parameter;
  platform?: ApiV3Parameter;
  offering?: ApiV3Parameter;
}

export interface ApiV3Sampling extends ApiV3Parameter {
  comment: string;
  measuringProgram: ApiV3MeasuringProgram;
  sampler: ApiV3Sampler;
  samplingMethod: string;
  environmentalConditions: string;
  samplingTimeStart: string;
  samplingTimeEnd: string;
  feature?: ApiV3Feature;
  samplingObservations?: ApiV3SamplingObservation[];
}

export interface ApiV3SamplingsFilter {
  timespan?: string;
  expanded?: boolean;
  feature?: string;
  procedure?: string;
  offering?: string;
  phenomenon?: string;
  category?: string;
  locale?: string;
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
    return this.requestApi<ApiV3Service[]>(url, this.prepareParams(params), options);
  }

  public getCategories(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Category[]> {
    const url = this.createRequestUrl(apiUrl, 'categories');
    return this.requestApi<ApiV3Category[]>(url, this.prepareParams(params), options);
  }

  public getCategory(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Category> {
    const url = this.createRequestUrl(apiUrl, 'categories', id);
    return this.requestApi<ApiV3Category>(url, this.prepareParams(params), options);
  }

  public getOfferings(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Offering[]> {
    const url = this.createRequestUrl(apiUrl, 'offerings');
    return this.requestApi<ApiV3Offering[]>(url, this.prepareParams(params), options);
  }

  public getOffering(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Offering> {
    const url = this.createRequestUrl(apiUrl, 'offerings', id);
    return this.requestApi<ApiV3Offering>(url, this.prepareParams(params), options);
  }

  public getPhenomena(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Phenomenon[]> {
    const url = this.createRequestUrl(apiUrl, 'phenomena');
    return this.requestApi<ApiV3Phenomenon[]>(url, this.prepareParams(params), options);
  }

  public getPhenomenon(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Phenomenon> {
    const url = this.createRequestUrl(apiUrl, 'phenomena', id);
    return this.requestApi<ApiV3Phenomenon>(url, this.prepareParams(params), options);
  }

  public getFeatures(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Feature[]> {
    const url = this.createRequestUrl(apiUrl, 'features');
    return this.requestApi<ApiV3Feature[]>(url, this.prepareParams(params), options);
  }

  public getFeature(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Feature> {
    const url = this.createRequestUrl(apiUrl, 'features', id);
    return this.requestApi<ApiV3Feature>(url, this.prepareParams(params), options);
  }

  public getProcedures(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Procedure[]> {
    const url = this.createRequestUrl(apiUrl, 'procedures');
    return this.requestApi<ApiV3Procedure[]>(url, this.prepareParams(params), options);
  }

  public getProcedure(id: string, apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Procedure> {
    const url = this.createRequestUrl(apiUrl, 'procedures', id);
    return this.requestApi<ApiV3Procedure>(url, this.prepareParams(params), options);
  }

  public getDatasets(apiUrl: string, params?: ApiV3ParameterFilter, options?: HttpRequestOptions): Observable<ApiV3Dataset[]> {
    const url = this.createRequestUrl(apiUrl, 'datasets');
    return this.requestApi<ApiV3Dataset[]>(url, this.prepareParams(params), options);
  }

  public getDataset(id: string, apiUrl: string, params?: ApiV3ParameterFilter): Observable<ApiV3Dataset> {
    const url = this.createRequestUrl(apiUrl, 'datasets', id);
    return this.requestApi<ApiV3Dataset>(url, this.prepareParams(params));
  }

  public getDatasetData<T>(id: string, apiUrl: string, params?: ApiV3DatasetDataFilter): Observable<Data<T>> {
    const url = this.createRequestUrl(apiUrl, 'datasets', `${id}/observations`);
    return this.requestApi<Data<T>>(url, this.prepareParams(params));
  }

  public getDatasetExtras(id: string, apiUrl: string): Observable<DatasetExtras> {
    const url = this.createRequestUrl(apiUrl, 'timeseries', id);
    return this.requestApi<DatasetExtras>(url + '/extras');
  }

  public getSamplings(apiUrl: string, params?: ApiV3SamplingsFilter, options?: HttpRequestOptions): Observable<ApiV3Sampling[]> {
    const url = this.createRequestUrl(apiUrl, 'samplings');
    return this.requestApi<ApiV3Sampling[]>(url, this.prepareParams(params), options);
  }

  public getSampling(id: string, apiUrl: string, params?: ApiV3SamplingsFilter): Observable<ApiV3Sampling> {
    const url = this.createRequestUrl(apiUrl, 'samplings', id);
    return this.requestApi<ApiV3Sampling>(url, this.prepareParams(params));
  }

  protected requestApi<T>(
    url: string, params: HttpParams = new HttpParams(), options: HttpRequestOptions = {}
  ): Observable<T> {
    return this.httpService.client(options).get<T>(url,
      {
        params,
        headers: this.createBasicAuthHeader(options.basicAuthToken)
      }
    );
  }

  protected prepareParams(params: any): HttpParams {
    let httpParams = new HttpParams({ encoder: new UriParameterCoder() });
    Object.getOwnPropertyNames(params).forEach((key) => {
      if (params[key] instanceof Array) {
        httpParams = httpParams.set(key, params[key].join(','));
      } else {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams;
  }

}
