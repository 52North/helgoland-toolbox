import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export abstract class HttpCache {
    /**
     * Returns a cached response, if any, or null if not present.
     */
    public abstract get(req: HttpRequest<any>, expirationAtMs?: number): HttpResponse<any> | null;

    /**
     * Adds or updates the response in the cache.
     */
    public abstract put(req: HttpRequest<any>, resp: HttpResponse<any>, expirationAtMs?: number): void;
}

export abstract class OnGoingHttpCache {

    public abstract has(req: HttpRequest<any>): boolean;
    public abstract set(req: HttpRequest<any>, request: Observable<HttpEvent<any>>): void;
    public abstract observe(req: HttpRequest<any>): Observable<HttpEvent<any>>;
    public abstract clear(req: HttpRequest<any>): void;

}
