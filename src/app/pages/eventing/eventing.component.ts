import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { BasicAuthServiceMaintainer } from '@helgoland/auth';
import {
  EventFilter,
  EventingApiService,
  EventResults,
  NotificationFilter,
  NotificationResults,
  PublicationFilter,
  PublicationResults,
  SubscriptionFilter,
  SubscriptionResults,
} from '@helgoland/eventing';

@Component({
  templateUrl: './eventing.component.html',
  styleUrls: ['./eventing.component.css'],
  imports: [CommonModule],
})
export class EventingComponent {
  private basicAuthServices = inject(BasicAuthServiceMaintainer);
  private eventingApi = inject(EventingApiService);

  private readonly url = '';

  loading: boolean = false;

  requestError: string | undefined;

  eventResults: EventResults | undefined;

  subscriptionResults: SubscriptionResults | undefined;

  publicationResults: PublicationResults | undefined;

  notificationResults: NotificationResults | undefined;

  constructor() {
    this.basicAuthServices.registerService(this.url);
  }

  requestEvents() {
    this.startloading();
    const params: EventFilter = {
      limit: 10,
      offset: 5,
      expanded: true,
      latest: true,
    };
    this.eventingApi.getEvents(this.url, params).subscribe({
      next: (res) => (this.eventResults = res),
      error: (error: HttpErrorResponse) => (this.requestError = error.message),
      complete: () => (this.loading = false),
    });
  }

  requestSubscriptions() {
    this.startloading();
    const params: SubscriptionFilter = { limit: 1 };
    this.eventingApi.getSubscriptions(this.url, params).subscribe({
      next: (res) => (this.subscriptionResults = res),
      error: (error: HttpErrorResponse) => (this.requestError = error.message),
      complete: () => (this.loading = false),
    });
  }

  requestPublications() {
    this.startloading();
    const params: PublicationFilter = { limit: 1 };
    this.eventingApi.getPublications(this.url, params).subscribe({
      next: (res) => (this.publicationResults = res),
      error: this.showError(),
      complete: () => (this.loading = false),
    });
  }

  private showError(): (error: any) => void {
    return (error: HttpErrorResponse) => (this.requestError = error.message);
  }

  requestNotifications() {
    this.startloading();
    const params: NotificationFilter = {
      limit: 10,
      publications: ['80', '81'],
    };
    this.eventingApi.getNotifications(this.url, params).subscribe({
      next: (res) => (this.notificationResults = res),
      error: (error: HttpErrorResponse) => (this.requestError = error.message),
      complete: () => (this.loading = false),
    });
  }

  private startloading() {
    this.loading = true;
    this.eventResults = undefined;
    this.subscriptionResults = undefined;
  }
}
