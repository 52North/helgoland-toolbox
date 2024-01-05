import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
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
  standalone: true,
})
export class EventingComponent {
  private readonly url = '';

  public loading: boolean = false;

  public requestError: string | undefined;

  public eventResults: EventResults | undefined;

  public subscriptionResults: SubscriptionResults | undefined;

  public publicationResults: PublicationResults | undefined;

  public notificationResults: NotificationResults | undefined;

  constructor(
    private basicAuthServices: BasicAuthServiceMaintainer,
    private eventingApi: EventingApiService,
  ) {
    this.basicAuthServices.registerService(this.url);
  }

  public requestEvents() {
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

  public requestSubscriptions() {
    this.startloading();
    const params: SubscriptionFilter = { limit: 1 };
    this.eventingApi.getSubscriptions(this.url, params).subscribe({
      next: (res) => (this.subscriptionResults = res),
      error: (error: HttpErrorResponse) => (this.requestError = error.message),
      complete: () => (this.loading = false),
    });
  }

  public requestPublications() {
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

  public requestNotifications() {
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
