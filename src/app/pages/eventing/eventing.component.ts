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
  imports: [
    CommonModule
  ],
  standalone: true
})
export class EventingComponent {

  private readonly url = '';

  public loading: boolean;

  public requestError: string;

  public eventResults: EventResults | null;

  public subscriptionResults: SubscriptionResults | null;

  public publicationResults: PublicationResults;

  public notificationResults: NotificationResults;

  constructor(
    private basicAuthServices: BasicAuthServiceMaintainer,
    private eventingApi: EventingApiService
  ) {
    this.basicAuthServices.registerService(this.url);
  }

  public requestEvents() {
    this.startloading();
    const params: EventFilter = {
      limit: 10,
      offset: 5,
      expanded: true,
      latest: true
    };
    this.eventingApi.getEvents(this.url, params).subscribe(
      res => this.eventResults = res,
      (error: HttpErrorResponse) => this.requestError = error.message,
      () => this.loading = false
    );
  }

  public requestSubscriptions() {
    this.startloading();
    const params: SubscriptionFilter = { limit: 1 };
    this.eventingApi.getSubscriptions(this.url, params).subscribe(
      res => this.subscriptionResults = res,
      (error: HttpErrorResponse) => this.requestError = error.message,
      () => this.loading = false
    );
  }

  public requestPublications() {
    this.startloading();
    const params: PublicationFilter = { limit: 1 };
    this.eventingApi.getPublications(this.url, params).subscribe(
      res => this.publicationResults = res,
      this.showError(),
      () => this.loading = false
    );
  }

  private showError(): (error: any) => void {
    return (error: HttpErrorResponse) => this.requestError = error.message;
  }

  public requestNotifications() {
    this.startloading();
    const params: NotificationFilter = { limit: 10, publications: ['80', '81'] };
    this.eventingApi.getNotifications(this.url, params).subscribe(
      res => this.notificationResults = res,
      (error: HttpErrorResponse) => this.requestError = error.message,
      () => this.loading = false
    );
  }

  private startloading() {
    this.loading = true;
    this.eventResults = null;
    this.subscriptionResults = null;
  }

}
