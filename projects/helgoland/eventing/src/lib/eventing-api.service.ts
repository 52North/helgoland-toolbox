import { ApiInterface, HttpRequestOptions } from '@helgoland/core';
import { Observable } from 'rxjs';

import { EventFilter } from './model/request/events';
import { NotificationFilter } from './model/request/notifications';
import { PublicationFilter } from './model/request/publications';
import { SubscriptionFilter } from './model/request/subscriptions';
import { Event, EventResults } from './model/response/events';
import {
  Notification,
  NotificationResults,
} from './model/response/notifications';
import { Publication, PublicationResults } from './model/response/publications';
import {
  Subscription,
  SubscriptionResults,
} from './model/response/subscriptions';

export abstract class EventingApiService extends ApiInterface {
  abstract getEvents(
    apiUrl: string,
    params?: EventFilter,
    options?: HttpRequestOptions,
  ): Observable<EventResults>;

  abstract getEvent(
    id: string,
    apiUrl: string,
    options?: HttpRequestOptions,
  ): Observable<Event>;

  abstract getSubscriptions(
    apiUrl: string,
    params?: SubscriptionFilter,
    options?: HttpRequestOptions,
  ): Observable<SubscriptionResults>;

  abstract getSubscription(
    id: string,
    apiUrl: string,
    options?: HttpRequestOptions,
  ): Observable<Subscription>;

  abstract getPublications(
    apiUrl: string,
    params?: PublicationFilter,
    options?: HttpRequestOptions,
  ): Observable<PublicationResults>;

  abstract getPublication(
    id: string,
    apiUrl: string,
    options?: HttpRequestOptions,
  ): Observable<Publication>;

  abstract getNotifications(
    apiUrl: string,
    params?: NotificationFilter,
    options?: HttpRequestOptions,
  ): Observable<NotificationResults>;

  abstract getNotification(
    id: string,
    apiUrl: string,
    options?: HttpRequestOptions,
  ): Observable<Notification>;
}
