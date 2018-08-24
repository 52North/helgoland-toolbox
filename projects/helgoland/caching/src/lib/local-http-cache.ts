import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCache } from './model';

interface CachedItem {
    expirationAtMs: number;
    response: HttpResponse<any>;
}

interface Cache {
    [id: string]: CachedItem;
}

@Injectable()
export class LocalHttpCache extends HttpCache {

    private cache: Cache = {};

    public get(req: HttpRequest<any>, expirationAtMs?: number): HttpResponse<any> {
        const key = req.urlWithParams;
        if (this.cache[key]) {
            const currentTime = new Date().getTime();
            if (isNaN(this.cache[key].expirationAtMs)) {
                this.cache[key].expirationAtMs = expirationAtMs;
                return this.cache[key].response;
            } else {
                if (this.cache[key].expirationAtMs >= currentTime) {
                    if (this.cache[key].expirationAtMs > expirationAtMs) { this.cache[key].expirationAtMs = expirationAtMs; }
                    return this.cache[key].response;
                } else {
                    delete this.cache[key];
                }
            }
        }
        return null;
    }

    public put(req: HttpRequest<any>, resp: HttpResponse<any>, expirationAtMs?: number) {
        this.cache[req.urlWithParams] = {
            expirationAtMs: expirationAtMs || new Date().getTime() + 30000,
            response: resp
        };
    }
}
