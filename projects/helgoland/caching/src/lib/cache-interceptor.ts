import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';

import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceHandler, HttpServiceInterceptor, HttpServiceMetadata } from '@helgoland/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { HttpCache, OnGoingHttpCache } from './model';

@Injectable()
export class CachingInterceptor implements HttpServiceInterceptor {
    constructor(
        protected cache: HttpCache,
        protected ongoingCache: OnGoingHttpCache
    ) { }

    public intercept(
        req: HttpRequest<any>, metadata: HttpServiceMetadata, next: HttpServiceHandler
    ): Observable<HttpEvent<any>> {

        // Before doing anything, it's important to only cache GET requests.
        // Skip this interceptor if the request method isn't GET.
        if (req.method !== 'GET') {
            return next.handle(req, metadata);
        }

        if (metadata.forceUpdate) {
            return next.handle(req, metadata);
        }

        // First, check the cache to see if this request exists.
        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            // A cached response exists. Serve it instead of forwarding
            // the request to the next handler.
            return Observable.of(cachedResponse);
        }

        // check if the same request is still in the pipe
        if (this.ongoingCache.has(req)) {
            return this.ongoingCache.observe(req);
        } else {
            // No cached response exists. Go to the network, and cache
            // the response when it arrives.
            return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
                const share = next.handle(req, metadata).share();
                share.subscribe((res) => {
                    if (res instanceof HttpResponse) {
                        this.cache.put(req, metadata.expirationTime, res);
                        this.ongoingCache.clear(req);
                        observer.next(res);
                        observer.complete();
                    }
                }, (error) => {
                    observer.error(error);
                    observer.complete();
                });
                this.ongoingCache.set(req, share);
            });
        }
    }
}
