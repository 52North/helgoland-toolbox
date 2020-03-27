import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestOptions, HttpServiceHandler, HttpServiceInterceptor } from '@helgoland/core';
import { Observable, Observer, of } from 'rxjs';
import { share } from 'rxjs/operators';

import { HttpCache, OnGoingHttpCache } from '../model';

@Injectable()
export class CachingInterceptor implements HttpServiceInterceptor {
    constructor(
        protected cache: HttpCache,
        protected ongoingCache: OnGoingHttpCache
    ) { }

    public intercept(
        req: HttpRequest<any>, metadata: HttpRequestOptions, next: HttpServiceHandler
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
        const cachedResponse = this.cache.get(req, metadata.expirationAtMs);
        if (cachedResponse) {
            // A cached response exists. Serve it instead of forwarding
            // the request to the next handler.
            return of(cachedResponse.clone({ body: JSON.parse(JSON.stringify(cachedResponse.body)) }));
        }

        // check if the same request is still in the pipe
        if (this.ongoingCache.has(req)) {
            return this.ongoingCache.observe(req);
        } else {
            // No cached response exists. Go to the network, and cache
            // the response when it arrives.
            return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
                const shared = next.handle(req, metadata).pipe(share());
                shared.subscribe((res) => {
                    if (res instanceof HttpResponse) {
                        this.cache.put(req, res, metadata.expirationAtMs);
                        this.ongoingCache.clear(req);
                        observer.next(res.clone({ body: JSON.parse(JSON.stringify(res.body)) }));
                        observer.complete();
                    }
                }, (error) => {
                    observer.error(error);
                    observer.complete();
                });
                this.ongoingCache.set(req, shared);
            });
        }
    }
}
