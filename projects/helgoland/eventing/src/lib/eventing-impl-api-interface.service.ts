import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestOptions, HttpService, Timespan, UriParameterCoder } from '@helgoland/core';
import { Observable } from 'rxjs';

import { EventingApiService } from './eventing-api.service';
import { EventingEventFilter, EventingFilter, EventingSubscriptionFilter } from './model/request';
import { EventingEvent, EventingEventResults, EventingSubscription, EventingSubscriptionResults } from './model/response';

@Injectable()
export class EventingImplApiInterface extends EventingApiService {

    constructor(
        private httpService: HttpService
    ) { super(); }

    public getEvents(apiUrl: string, filterParameter: EventingEventFilter = {}, options: HttpRequestOptions = {}): Observable<EventingEventResults> {
        const url = this.createRequestUrl(apiUrl, 'events');
        let httpParams = this.prepareFilterParams(filterParameter);
        httpParams = this.addParameterFilter(filterParameter, 'latest', httpParams);
        httpParams = this.addParameterFilter(filterParameter, 'subscriptions', httpParams);
        httpParams = this.addTimespan(filterParameter.timespan, httpParams);
        return this.requestApi<EventingEventResults>(url, httpParams, options);
    }

    public getEvent(id: string, apiUrl: string, options: HttpRequestOptions = {}): Observable<EventingEvent> {
        const url = this.createRequestUrl(apiUrl, 'events', id);
        return this.requestApi<EventingEvent>(url, null, options);
    }

    public getSubscriptions(apiUrl: string, filterParameter: EventingSubscriptionFilter = {}, options: HttpRequestOptions = {}): Observable<EventingSubscriptionResults> {
        const url = this.createRequestUrl(apiUrl, 'subscriptions');
        const httpParams = this.prepareFilterParams(filterParameter);
        return this.requestApi<EventingSubscriptionResults>(url, httpParams, options);
    }

    public getSubscription(id: string, apiUrl: string, options: HttpRequestOptions = {}): Observable<EventingSubscription> {
        const url = this.createRequestUrl(apiUrl, 'subscriptions', id);
        return this.requestApi<EventingSubscription>(url, null, options);
    }

    protected requestApi<T>(url: string, params: HttpParams = new HttpParams(), options: HttpRequestOptions = {}): Observable<T> {
        const headers = this.createBasicAuthHeader(options.basicAuthToken);
        return this.httpService.client(options).get<T>(url, { params, headers });
    }

    protected prepareFilterParams(params: EventingFilter): HttpParams {
        let httpParams = new HttpParams({ encoder: new UriParameterCoder() });
        httpParams = this.addParameterFilter(params, 'expanded', httpParams);
        httpParams = this.addParameterFilter(params, 'offset', httpParams);
        httpParams = this.addParameterFilter(params, 'limit', httpParams);
        return httpParams;
    }

    private addTimespan(timespan: Timespan, httpParams: HttpParams): HttpParams {
        if (timespan !== undefined) {
            return httpParams.set('timespan', this.createRequestTimespan(timespan));
        }
        return httpParams;
    }

    private addParameterFilter(params: EventingFilter, key: string, httpParams: HttpParams): HttpParams {
        if (params && params[key] !== undefined) {
            return httpParams.set(key, params[key]);
        }
        return httpParams;
    }
}
