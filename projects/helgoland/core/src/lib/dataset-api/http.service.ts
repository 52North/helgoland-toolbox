import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

export const HTTP_SERVICE_INTERCEPTORS = new InjectionToken<HttpServiceInterceptor>('HTTP_SERVICE_INTERCEPTORS');

export interface HttpServiceMetadata {
    forceUpdate?: boolean;
    expirationAtMs?: number;
}

export interface HttpServiceHandler {
    handle(req: HttpRequest<any>, metadata: Partial<HttpServiceMetadata>);
}

export interface HttpServiceInterceptor {
    intercept(req: HttpRequest<any>, metadata: Partial<HttpServiceMetadata>, next: HttpServiceHandler);
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private handler: HttpServiceHandler;

    constructor(
        protected httpHandler: HttpHandler,
        @Optional() @Inject(HTTP_SERVICE_INTERCEPTORS) interceptors: HttpServiceInterceptor[] | null
    ) {
        let handler: HttpServiceHandler = {
            handle: (req, metadata) => httpHandler.handle(req)
        };
        if (interceptors) {
            handler = interceptors.reduceRight((next, interceptor) => ({
                handle: (req, metadata) => interceptor.intercept(req, metadata, next)
            }), handler);
        }
        this.handler = handler;
    }

    public client(metadata: HttpServiceMetadata = {}): HttpClient {
        return new HttpClient({
            handle: (req) => this.handler.handle(req, metadata)
        });
    }
}
