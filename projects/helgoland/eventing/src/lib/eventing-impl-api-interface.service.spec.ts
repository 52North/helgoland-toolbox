import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { BasicAuthService } from '@helgoland/auth';
import {
  HelgolandCoreModule,
  HttpRequestOptions,
  Timespan,
} from '@helgoland/core';
import moment from 'moment';

import { EventingImplApiInterface } from './eventing-impl-api-interface.service';
import { EventFilter } from './model/request/events';
import { NotificationFilter } from './model/request/notifications';
import { PublicationFilter } from './model/request/publications';
import { Event, EventResults } from './model/response/events';
import { NotificationResults } from './model/response/notifications';
import { PublicationResults } from './model/response/publications';
import {
  Subscription,
  SubscriptionResults,
} from './model/response/subscriptions';

const testUrl = '/';

describe('EventingImplApiInterface', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventingImplApiInterface, BasicAuthService],
      imports: [HttpClientTestingModule, HelgolandCoreModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      expect(service).toBeTruthy();
    },
  ));

  it('get subscriptions', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: SubscriptionResults = require('../test-data/subscriptions.json');
      service
        .getSubscriptions(testUrl)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'subscriptions');
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get subscriptions with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: SubscriptionResults = require('../test-data/subscriptions.json');
      const options = createRequestOptions();
      service
        .getSubscriptions(testUrl, {}, options)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'subscriptions');
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get subscription', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Subscription = require('../test-data/subscription.json');
      service
        .getSubscription(testData.id, testUrl)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'subscriptions/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get subscription with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Subscription = require('../test-data/subscription.json');
      const options: HttpRequestOptions = createRequestOptions();
      service
        .getSubscription(testData.id, testUrl, options)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'subscriptions/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get events', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: EventResults = require('../test-data/events.json');
      service
        .getEvents(testUrl)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'events');
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get events with filter', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: EventResults = require('../test-data/events.json');
      const timespan = new Timespan(
        new Date(2017, 10, 7, 11, 30).getTime(),
        new Date(2017, 10, 7, 11, 46).getTime(),
      );
      const filterParameter: EventFilter = {
        expanded: true,
        latest: true,
        offset: 10,
        limit: 12,
        subscriptions: ['123'],
        timespan: timespan,
      };
      service
        .getEvents(testUrl, filterParameter)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(
        (request) => request.method === 'GET',
      );
      expect(req.request.params.get('expanded')).toBeTruthy();
      expect(req.request.params.get('latest')).toBeTruthy();
      expect(req.request.params.get('offset') + '').toEqual(
        filterParameter.offset + '',
      );
      expect(req.request.params.get('limit') + '').toEqual(
        filterParameter.limit + '',
      );
      expect(req.request.params.get('subscriptions') + '').toEqual(
        filterParameter.subscriptions + '',
      );
      expect(req.request.params.get('timespan') + '').toEqual(
        moment(timespan.from).format() + '/' + moment(timespan.to).format(),
      );
      req.flush(testData);
    },
  ));

  it('get events with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: EventResults = require('../test-data/events.json');
      const options: HttpRequestOptions = createRequestOptions();
      service
        .getEvents(testUrl, {}, options)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'events');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get event', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/event.json');
      service
        .getEvent(testData.id, testUrl)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'events/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get event with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/event.json');
      const options = createRequestOptions();
      service
        .getEvent(testData.id, testUrl, options)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'events/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get publications with filter', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: PublicationResults = require('../test-data/publications.json');
      const filterParameter: PublicationFilter = {
        expanded: true,
        offset: 10,
        limit: 12,
        feature: 'test',
      };
      service
        .getPublications(testUrl, filterParameter)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(
        (request) => request.method === 'GET',
      );
      expect(req.request.params.get('expanded')).toBeTruthy();
      expect(req.request.params.get('offset') + '').toEqual(
        filterParameter.offset + '',
      );
      expect(req.request.params.get('limit') + '').toEqual(
        filterParameter.limit + '',
      );
      expect(req.request.params.get('feature') + '').toEqual(
        filterParameter.feature + '',
      );
      req.flush(testData);
    },
  ));

  it('get publications with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: PublicationResults = require('../test-data/publications.json');
      const options: HttpRequestOptions = createRequestOptions();
      service
        .getPublications(testUrl, {}, options)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'publications');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get publication', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/publication.json');
      service
        .getPublication(testData.id, testUrl)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'publications/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get publication with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/publication.json');
      const options = createRequestOptions();
      service
        .getPublication(testData.id, testUrl, options)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'publications/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get notifications with filter', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: NotificationResults = require('../test-data/notifications.json');
      const filterParameter: NotificationFilter = {
        expanded: true,
        offset: 10,
        limit: 12,
        publications: ['test', 'bla'],
      };
      service
        .getNotifications(testUrl, filterParameter)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(
        (request) => request.method === 'GET',
      );
      expect(req.request.params.get('expanded')).toBeTruthy();
      expect(req.request.params.get('offset') + '').toEqual(
        filterParameter.offset + '',
      );
      expect(req.request.params.get('limit') + '').toEqual(
        filterParameter.limit + '',
      );
      expect(req.request.params.get('publications') + '').toEqual(
        filterParameter.publications + '',
      );
      req.flush(testData);
    },
  ));

  it('get notifications with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: NotificationResults = require('../test-data/notifications.json');
      const options: HttpRequestOptions = createRequestOptions();
      service
        .getNotifications(testUrl, {}, options)
        .subscribe((data) => expect(data).toEqual(testData));
      const req = httpTestingController.expectOne(testUrl + 'notifications');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));

  it('get notification', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/notification.json');
      service
        .getNotification(testData.id, testUrl)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'notifications/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    },
  ));

  it('get notification with basic auth', inject(
    [EventingImplApiInterface],
    (service: EventingImplApiInterface) => {
      const testData: Event = require('../test-data/notification.json');
      const options = createRequestOptions();
      service
        .getNotification(testData.id, testUrl, options)
        .subscribe((data) => expect(data.id).toEqual(testData.id));
      const req = httpTestingController.expectOne(
        testUrl + 'notifications/' + testData.id,
      );
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(
        options.basicAuthToken!,
      );
      req.flush(testData);
    },
  ));
});

// function checkRequest(req: TestRequest, options?: HttpRequestOptions) {
//   expect(req.request.method).toEqual('GET');
//   if (options) {
//     expect(req.request.headers.get('Authorization')).toEqual(options.basicAuthToken);
//   }
// }

function createRequestOptions(): HttpRequestOptions {
  return { basicAuthToken: '12345' };
}
