import { ApiInterface, HttpRequestOptions } from '@helgoland/core';
import { Observable } from 'rxjs';

import { EventFilter } from './model/request/events';
import { SubscriptionFilter } from './model/request/subscriptions';
import { Event, EventResults } from './model/response/events';
import { Subscription, SubscriptionResults } from './model/response/subscriptions';
import { PublicationFilter } from './model/request/publications';
import { PublicationResults, Publication } from './model/response/publications';
import { NotificationFilter } from './model/request/notifications';
import { NotificationResults, Notification } from './model/response/notifications';

export abstract class EventingApiService extends ApiInterface {

  public abstract getEvents(apiUrl: string, params?: EventFilter, options?: HttpRequestOptions): Observable<EventResults>;

  public abstract getEvent(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<Event>;

  public abstract getSubscriptions(apiUrl: string, params?: SubscriptionFilter, options?: HttpRequestOptions): Observable<SubscriptionResults>;

  public abstract getSubscription(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<Subscription>;

  public abstract getPublications(apiUrl: string, params?: PublicationFilter, options?: HttpRequestOptions): Observable<PublicationResults>;

  public abstract getPublication(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<Publication>;

  public abstract getNotifications(apiUrl: string, params?: NotificationFilter, options?: HttpRequestOptions): Observable<NotificationResults>;

  public abstract getNotification(id: string, apiUrl: string, options?: HttpRequestOptions): Observable<Notification>;

}
