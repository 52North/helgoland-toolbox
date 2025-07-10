import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Timespan } from '@helgoland/core';
import { Observable } from 'rxjs';

import {
  CachedIntersection,
  CachedObject,
} from './get-data-cache/local-http-cache-interval';

export abstract class HttpCache {
  /**
   * Returns a cached response, if any, or null, if not present.
   */
  abstract get(
    req: HttpRequest<any>,
    expirationAtMs?: number,
  ): HttpResponse<any> | null;

  /**
   * Adds or updates the response in the cache.
   */
  abstract put(
    req: HttpRequest<any>,
    resp: HttpResponse<any>,
    expirationAtMs?: number,
  ): void;
}

export abstract class OnGoingHttpCache {
  abstract has(req: HttpRequest<any>): boolean;
  abstract set(
    req: HttpRequest<any>,
    request: Observable<HttpEvent<any>>,
  ): void;
  abstract observe(req: HttpRequest<any>): Observable<HttpEvent<any>>;
  abstract clear(req: HttpRequest<any>): void;
}

export abstract class HttpCacheInterval {
  /**
   * Returns a cached response, if any, or null, if not present.
   */
  abstract get(url: string, generalized: boolean): CachedObject[] | null;
  /**
   * Returns a cached response with intersecting timespans, if any, or null, if not present.
   * Further returns an array of timespans that need to be requested (not covered by cached timespans),
   * if any, or null, if only one cached object covers the requested timespan.
   */
  abstract getIntersection(
    url: string,
    timespan: Timespan,
    generalized: boolean,
  ): CachedIntersection | null;
  /**
   * Saves new object into cache.
   * 'originReq' indicates, if the request is the original request (e.g. forceUpdate), so the cache can be filtered
   */
  abstract put(
    url: string,
    obj: CachedObject,
    generalized: boolean,
    originReq?: boolean,
  ): void;
}
