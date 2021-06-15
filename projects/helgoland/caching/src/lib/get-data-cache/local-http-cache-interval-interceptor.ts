import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {
  Data,
  HttpRequestOptions,
  HttpServiceHandler,
  HttpServiceInterceptor,
  ReferenceValues,
  Timespan,
  TimeValueTuple,
} from '@helgoland/core';
import moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

import { CacheConfig, CacheConfigService } from '../config';
import { HttpCacheInterval } from '../model';
import { CachedIntersection, CachedObject } from './local-http-cache-interval';

@Injectable()
export class LocalHttpCacheIntervalInterceptor implements HttpServiceInterceptor {

  private expirationAtMs = 30000;

  constructor(
    protected cache: HttpCacheInterval,
    @Optional() @Inject(CacheConfigService) config: CacheConfig
  ) {
    if (config && config.cachingDurationInMilliseconds) { this.expirationAtMs = config.cachingDurationInMilliseconds; }
  }

  /**
   * Interceptor for caching data for specific time intervals.
   * @param req {HttpRequest<any>} original request
   * @param metadata {HttpRequestOptions} further specification of the original request
   * @param next {HttpServiceHandler} forward to further functions
   */
  public intercept(
    req: HttpRequest<any>, metadata: HttpRequestOptions, next: HttpServiceHandler
  ): Observable<HttpEvent<any>> {

    const urlID = this.decodeID(req.url);
    let expanded = false;
    let generalize = false;

    // handle GET and getData requests only
    if (req.method !== 'GET') {
      return next.handle(req, metadata);
    }
    if (!req.url.includes('/getData')) {
      return next.handle(req, metadata);
    }
    if (req.urlWithParams.includes('expanded=true')) {
      expanded = true;
    }
    if (req.urlWithParams.includes('generalize=true')) {
      generalize = true;
    }

    // adapt request if necessary
    const customReqs = [];
    const reqOptions = [];

    let intersectedCache: CachedIntersection | null;

    if (!metadata.forceUpdate) {
      const reqTimespan = this.decodeTimespan(req.params.get('timespan'));
      // check cache for existing timespans
      intersectedCache = this.cache.getIntersection(req.url, reqTimespan, generalize);

      if (intersectedCache && (intersectedCache.timespans.length === 0 || (Math.floor(intersectedCache.timespans[0].from / 1000) === Math.floor(intersectedCache.timespans[0].to / 1000)))) {
        if (intersectedCache.cachedObjects[0]) {
          // requested timespan is covered by existing cachedObject
          return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
            const httpResponse = intersectedCache.cachedObjects[0].httpResponse;
            const resHttpEvent = this.createHttpResponse(urlID, expanded, httpResponse, intersectedCache);
            observer.next(resHttpEvent); // intersectedCache.cachedObjects[0].httpEvent);
            observer.complete();
          });
        } else {
          // case that there is intersection with cache, but the requested time interval contains no data values
          return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
            const body = {};
            body[urlID] = {
              values: [],
              referenceValues: []
            };
            observer.next(new HttpResponse({
              body: !expanded ? { values: [], referenceValues: [] } : body,
              // headers: ,
              status: 200,
              statusText: 'OK',
              url: req.url
            }));
            observer.complete();
          });
          // return next.handle(req, metadata);
        }
      } else {
        // requested timespan is not or not fully covered by existing cachedObjects
        if (intersectedCache && intersectedCache.timespans.length > 1) {
          // if more than one not covered timespans need to be requested, use origin request only
          // customReqs.push(req);
          // reqOptions.push(metadata);

          // TODO adapt here to handle more than one customized request, see 2 lines below

        } else if (intersectedCache && intersectedCache.timespans.length > 0) {
          // customize request, if requested timespan is not fully covered by existing cachedObjects
          // currently for one request only
          intersectedCache.timespans.forEach(ts => {
            let params = req.params;
            params = params.set('timespan', this.encodeTimespan(ts));
            const cReq = req.clone({ params });
            customReqs.push(cReq);
            const cMetadata = metadata;
            reqOptions.push(cMetadata);
          });
        }
      }
    }

    let originReq = false;
    // use default req & metadata
    if (customReqs.length === 0) {
      customReqs.push(req);
      originReq = true;
    }
    if (reqOptions.length === 0) { reqOptions.push(metadata); }

    const newRequest = customReqs[0];
    const newOptions = reqOptions[0];

    // use origin request for not covered timespans
    // or use custom request for not fully covered timespans
    return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
      const shared = next.handle(newRequest, newOptions).pipe(share());
      shared.subscribe((res) => {
        if (res instanceof HttpResponse) {
          const expirationTime = metadata.expirationAtMs ? metadata.expirationAtMs : this.expirationAtMs;
          const resultUrl = this.getUrlWithoutParams(res.url);
          // for ts data
          const cachedItem: CachedObject = {
            values: !expanded ? res.body : res.body[urlID],
            expirationDate: moment(moment(new Date())).add(expirationTime, 'milliseconds').toDate(),
            expirationAtMs: expirationTime,
            httpResponse: res,
            requestTs: this.decodeTimespan(newRequest.params.get('timespan'))
          };
          if (cachedItem.values.values.length > 0) {
            // update cache
            this.cache.put(resultUrl, cachedItem, generalize, originReq);
          }
          if (!originReq && intersectedCache && intersectedCache.cachedObjects.length > 0) {
            if (cachedItem.values.values.length > 0) {
              res = this.createHttpResponse(urlID, expanded, res, intersectedCache, cachedItem);
            } else {
              res = this.createHttpResponse(urlID, expanded, res, intersectedCache);
            }
          }
          observer.next(res);
          observer.complete();
        }

      }, (error) => {
        observer.error(error);
        observer.complete();
      });
    });

  }

  /**
   * Concat values of all intersected objects into a http response.
   * @param intersected
   * @param newCachedObject
   */
  private createHttpResponse(urlID: string, expanded: boolean, httpResponse: HttpResponse<any>, intersected: CachedIntersection, newCachedObject?: CachedObject): HttpEvent<any> {
    const resObj: Data<TimeValueTuple> = intersected.cachedObjects[0].values;
    let newObjValuesTimespan: Timespan;
    if (newCachedObject) {
      // add values of new cached object at the beginning
      newObjValuesTimespan = new Timespan(newCachedObject.values.values[0][0], newCachedObject.values.values[newCachedObject.values.values.length - 1][0]);
      if (newObjValuesTimespan.to <= resObj.values[0][0]) {
        resObj.values = newCachedObject.values.values.concat(resObj.values);
        resObj.referenceValues = this.concatReferenceValues(resObj, newCachedObject.values);
        resObj.valueBeforeTimespan = this.selectValueBeforeTimespan(resObj, newCachedObject.values);
        resObj.valueAfterTimespan = this.selectValueAfterTimespan(resObj, newCachedObject.values);
      }

    }
    for (let i = 1; i < intersected.cachedObjects.length; i++) {
      const currVal = intersected.cachedObjects[i].values;
      // add values of new cached object inbetween
      if (newCachedObject && newObjValuesTimespan.from >= resObj.values[resObj.values.length - 1][0] && newObjValuesTimespan.to <= currVal.values[0][0]) {
        resObj.values = resObj.values.concat(newCachedObject.values.values);
        resObj.referenceValues = this.concatReferenceValues(newCachedObject.values, resObj);
        resObj.valueBeforeTimespan = this.selectValueBeforeTimespan(resObj, newCachedObject.values);
        resObj.valueAfterTimespan = this.selectValueAfterTimespan(resObj, newCachedObject.values);
      }
      resObj.values = resObj.values.concat(currVal.values);
      resObj.referenceValues = this.concatReferenceValues(currVal, resObj);
      // add values of new cached object at the end
      if (i >= intersected.cachedObjects.length - 1 && newCachedObject && newObjValuesTimespan.from >= currVal.values[currVal.values.length - 1][0]) {
        resObj.values = resObj.values.concat(newCachedObject.values.values);
        resObj.referenceValues = this.concatReferenceValues(newCachedObject.values, resObj);
      }
      resObj.valueBeforeTimespan = this.selectValueBeforeTimespan(resObj, currVal);
      resObj.valueAfterTimespan = this.selectValueAfterTimespan(resObj, currVal);
    }
    if (resObj.valueBeforeTimespan && resObj.valueBeforeTimespan[0] > resObj.values[0][0]) {
      resObj.valueBeforeTimespan = resObj.values[0];
    }
    if (resObj.valueAfterTimespan && resObj.valueAfterTimespan[0] < resObj.values[resObj.values.length - 1][0]) {
      resObj.valueAfterTimespan = resObj.values[resObj.values.length - 1];
    }

    const body = {};
    body[urlID] = resObj;
    return new HttpResponse({
      body: !expanded ? resObj : body,
      headers: httpResponse.headers,
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      url: httpResponse.url
    });
  }

  /**
   * Function to combine data of referenceValues.
   * @param base {Data<TimeValueTuple>} array of values
   * @param adds {Data<TimeValueTuple>} array of values
   */
  private concatReferenceValues(base: Data<TimeValueTuple>, adds: Data<TimeValueTuple>): ReferenceValues<TimeValueTuple> {
    const res: ReferenceValues<TimeValueTuple> = Object.assign({}, base.referenceValues);
    // Object.assign(res, adds.referenceValues);
    // for (const key in res) {
    //   if (key) {
    //     if (base.referenceValues[key]) {
    //       // combine base and adds values with same key
    //       res[key] = res[key].concat(base.referenceValues[key].filter(item => res[key].findIndex(el => el[0] === item[0]) < 0));
    //       // sort
    //       res[key] = res[key].sort((a, b) => (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0));
    //       res[key] = res[key].filter(item => item[0]);
    //     }
    //   }
    // }
    return res;
  }

  /**
   * Function to identify only the url with id without any request parameters.
   * @param url {string} url of a request
   */
  private getUrlWithoutParams(url: string): string {
    const end = url.indexOf('?');
    return url.substring(0, end);
  }

  /**
   * Function to decode a string to a timespan.
   * @param ts {string} timespan as string format
   */
  private decodeTimespan(ts: string): Timespan {
    const idx = ts.indexOf('/');
    const start = ts.substring(0, idx);
    const end = ts.substring(idx + 1);
    return new Timespan(Math.min(moment(new Date(start)).unix() * 1000, moment(new Date(end)).unix() * 1000), Math.max(moment(new Date(start)).unix() * 1000, moment(new Date(end)).unix() * 1000));
  }

  /**
   * Function to encode timespan to a string format.
   * @param timespan {Timespan} timespan to be encoded to a string format
   */
  private encodeTimespan(timespan: Timespan): string {
    return (moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  /**
   * Get id from request url.
   * @param url {string} url
   */
  private decodeID(url: string): string {
    const idx = url.indexOf('/getData');
    const start = url.substring(0, idx);
    const idxID = start.lastIndexOf('/') + 1;
    return start.substring(idxID);
  }

  /**
   * Function to determine valueBeforeTimespan based on existing values.
   * @param el1 {Data<TimeValueTuple>}
   * @param el2 {Data<TimeValueTuple>}
   */
  private selectValueBeforeTimespan(el1: Data<TimeValueTuple>, el2: Data<TimeValueTuple>): TimeValueTuple {
    if (el1.valueBeforeTimespan) {
      if (el2.valueBeforeTimespan) {
        return el1.valueBeforeTimespan[0] < el2.valueBeforeTimespan[0] ? el1.valueBeforeTimespan : el2.valueBeforeTimespan;
      } else {
        return el1.valueBeforeTimespan;
      }
    }
    if (el2.valueBeforeTimespan) {
      return el2.valueBeforeTimespan;
    }
    return undefined;
  }

  /**
   * Function to determine valueAfterTimespan based on existing values.
   * @param el1 {Data<TimeValueTuple>}
   * @param el2 {Data<TimeValueTuple>}
   */
  private selectValueAfterTimespan(el1: Data<TimeValueTuple>, el2: Data<TimeValueTuple>): TimeValueTuple {
    if (el1.valueAfterTimespan) {
      if (el2.valueAfterTimespan) {
        return el1.valueAfterTimespan[0] < el2.valueAfterTimespan[0] ? el1.valueAfterTimespan : el2.valueAfterTimespan;
      } else {
        return el1.valueAfterTimespan;
      }
    }
    if (el2.valueAfterTimespan) {
      return el2.valueAfterTimespan;
    }
    return undefined;
  }
}
