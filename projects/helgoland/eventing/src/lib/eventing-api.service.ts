import { ApiInterface, HttpRequestOptions } from '@helgoland/core';
import { Observable } from 'rxjs';

import { EventingEventFilter, EventingSubscriptionFilter } from './model/request';
import { EventingEvent, EventingEventResults, EventingSubscription, EventingSubscriptionResults } from './model/response';

export abstract class EventingApiService extends ApiInterface {

  public abstract getEvents(apiUrl: string, params?: EventingEventFilter, options?: HttpRequestOptions): Observable<EventingEventResults>;

  public abstract getEvent(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<EventingEvent>;

  public abstract getSubscriptions(apiUrl: string, params?: EventingSubscriptionFilter, options?: HttpRequestOptions): Observable<EventingSubscriptionResults>;

  public abstract getSubscription(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<EventingSubscription>;

}
