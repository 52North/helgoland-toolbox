import { HttpRequest } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http/src/response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalOngoingHttpCache {

    private cache: { [key: string]: { request: Observable<HttpEvent<any>> } } = {};

    public has(req: HttpRequest<any>): boolean {
        return this.cache[req.urlWithParams] !== undefined;
    }

    public set(req: HttpRequest<any>, request: Observable<HttpEvent<any>>): void {
        this.cache[req.urlWithParams] = {
            request
        };
    }

    public observe(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.cache[req.urlWithParams].request;
    }

    public clear(req: HttpRequest<any>) {
        delete this.cache[req.urlWithParams];
    }
}
