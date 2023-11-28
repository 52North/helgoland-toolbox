// @ts-nocheck
import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpRequestOptions, HttpService, Timespan, UriParameterCoder } from "@helgoland/core";
import { Observable } from "rxjs";

import { EventingApiService } from "./eventing-api.service";
import { EventingFilter } from "./model/request/common";
import { EventFilter } from "./model/request/events";
import { NotificationFilter } from "./model/request/notifications";
import { PublicationFilter } from "./model/request/publications";
import { SubscriptionFilter } from "./model/request/subscriptions";
import { Event, EventResults } from "./model/response/events";
import { Notification, NotificationResults } from "./model/response/notifications";
import { Publication, PublicationResults } from "./model/response/publications";
import { Subscription, SubscriptionResults } from "./model/response/subscriptions";

@Injectable()
export class EventingImplApiInterface extends EventingApiService {

  constructor(
        private httpService: HttpService
  ) { super(); }

  public getEvents(apiUrl: string, filterParameter: EventFilter = {}, options: HttpRequestOptions = {}): Observable<EventResults> {
    const url = this.createRequestUrl(apiUrl, "events");
    let httpParams = this.prepareFilterParams(filterParameter);
    httpParams = this.addParameterFilter(filterParameter, "latest", httpParams);
    httpParams = this.addParameterFilter(filterParameter, "subscriptions", httpParams);
    httpParams = this.addTimespan(filterParameter.timespan, httpParams);
    return this.requestApi<EventResults>(url, httpParams, options);
  }

  public getEvent(id: string, apiUrl: string, options: HttpRequestOptions = {}): Observable<Event> {
    const url = this.createRequestUrl(apiUrl, "events", id);
    return this.requestApi<Event>(url, null, options);
  }

  public getSubscriptions(apiUrl: string, filterParameter: SubscriptionFilter = {}, options: HttpRequestOptions = {}): Observable<SubscriptionResults> {
    const url = this.createRequestUrl(apiUrl, "subscriptions");
    const httpParams = this.prepareFilterParams(filterParameter);
    return this.requestApi<SubscriptionResults>(url, httpParams, options);
  }

  public getSubscription(id: string, apiUrl: string, options: HttpRequestOptions = {}): Observable<Subscription> {
    const url = this.createRequestUrl(apiUrl, "subscriptions", id);
    return this.requestApi<Subscription>(url, null, options);
  }

  public getPublications(apiUrl: string, filterParameter: PublicationFilter = {}, options?: HttpRequestOptions): Observable<PublicationResults> {
    const url = this.createRequestUrl(apiUrl, "publications");
    let httpParams = this.prepareFilterParams(filterParameter);
    httpParams = this.addParameterFilter(filterParameter, "feature", httpParams);
    return this.requestApi<PublicationResults>(url, httpParams, options);
  }

  public getPublication(id: string, apiUrl: string, options: HttpRequestOptions = {}): Observable<Publication> {
    const url = this.createRequestUrl(apiUrl, "publications", id);
    return this.requestApi<Publication>(url, null, options);
  }

  public getNotifications(apiUrl: string, filterParameter: NotificationFilter = {}, options?: HttpRequestOptions): Observable<NotificationResults> {
    const url = this.createRequestUrl(apiUrl, "notifications");
    let httpParams = this.prepareFilterParams(filterParameter);
    httpParams = this.addParameterFilter(filterParameter, "publications", httpParams);
    return this.requestApi<NotificationResults>(url, httpParams, options);
  }

  public getNotification(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<Notification> {
    const url = this.createRequestUrl(apiUrl, "notifications", id);
    return this.requestApi<Notification>(url, null, options);
  }

  protected requestApi<T>(url: string, params: HttpParams = new HttpParams(), options: HttpRequestOptions = {}): Observable<T> {
    const headers = this.createBasicAuthHeader(options.basicAuthToken);
    return this.httpService.client(options).get<T>(url, { params, headers });
  }

  protected prepareFilterParams(params: EventingFilter): HttpParams {
    let httpParams = new HttpParams({ encoder: new UriParameterCoder() });
    httpParams = this.addParameterFilter(params, "expanded", httpParams);
    httpParams = this.addParameterFilter(params, "offset", httpParams);
    httpParams = this.addParameterFilter(params, "limit", httpParams);
    return httpParams;
  }

  private addTimespan(timespan: Timespan, httpParams: HttpParams): HttpParams {
    if (timespan !== undefined) {
      return httpParams.set("timespan", this.createRequestTimespan(timespan));
    }
    return httpParams;
  }

  private addParameterFilter(params: EventingFilter, key: string, httpParams: HttpParams): HttpParams {
    if (params && params[key] !== undefined) {
      if (params[key] instanceof Array) {
        return httpParams.set(key, params[key].join(","));
      }
      return httpParams.set(key, params[key]);
    }
    return httpParams;
  }
}
