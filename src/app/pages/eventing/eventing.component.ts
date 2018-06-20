import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BasicAuthService } from '@helgoland/auth';
import { HttpRequestOptions, Timespan } from '@helgoland/core';
import {
  EventingApiService,
  EventingEventFilter,
  EventingEventResults,
  EventingSubscriptionFilter,
  EventingSubscriptionResults,
} from '@helgoland/eventing';

@Component({
  templateUrl: './eventing.component.html',
  styleUrls: ['./eventing.component.css']
})
export class EventingComponent {

  private readonly username = '';
  private readonly password = '';
  private readonly url = '';

  public token: string;
  public authError: string;

  public loadingEvents: boolean;
  public eventResults: EventingEventResults;
  public eventResultsError: string;

  public loadingSubscriptions: boolean;
  public subscriptionResults: EventingSubscriptionResults;
  public subscriptionResultsError: string;

  constructor(
    private basicAuthSrvc: BasicAuthService,
    private eventingApi: EventingApiService
  ) {
    this.basicAuthSrvc.auth(this.username, this.password, this.url)
      .subscribe(
        (res) => {
          this.token = res;
        },
        (error: HttpErrorResponse) => this.authError = error.message
      );
  }

  public requestEvents() {
    this.loadingEvents = true;
    this.clearResults();
    const params: EventingEventFilter = {
      limit: 10,
      offset: 5,
      expanded: true,
      latest: true
    };
    const options: HttpRequestOptions = { basicAuthToken: this.token };
    this.eventingApi.getEvents(this.url, params, options).subscribe(
      res => this.eventResults = res,
      (error: HttpErrorResponse) => this.eventResultsError = error.message,
      () => this.loadingEvents = false
    );
  }

  public requestSubscriptions() {
    this.loadingSubscriptions = true;
    this.clearResults();
    const params: EventingSubscriptionFilter = { limit: 1 };
    const options: HttpRequestOptions = { basicAuthToken: this.token };
    this.eventingApi.getSubscriptions(this.url, params, options).subscribe(
      res => this.subscriptionResults = res,
      (error: HttpErrorResponse) => this.subscriptionResultsError = error.message,
      () => this.loadingSubscriptions = false
    );
  }

  private clearResults() {
    this.eventResults = null;
    this.subscriptionResults = null;
  }

}
