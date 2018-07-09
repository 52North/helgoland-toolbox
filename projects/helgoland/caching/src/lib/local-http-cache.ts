import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCache } from './model';

interface CachedItem {
    expirationTime: number;
    response: HttpResponse<any>;
}

interface Cache {
    [id: string]: CachedItem;
}

@Injectable()
export class LocalHttpCache extends HttpCache {

    private cache: Cache = {};

    public get(req: HttpRequest<any>): HttpResponse<any> {
        if (this.cache[req.urlWithParams]) {
            const expirationTime = this.cache[req.urlWithParams].expirationTime;
            const currentTime = new Date().getTime();
            if (expirationTime >= currentTime) {
                return this.cache[req.urlWithParams].response;
            } else {
                delete this.cache[req.urlWithParams];
            }
        }
        return null;
    }

    public put(req: HttpRequest<any>, expirationTime: number | Date, resp: HttpResponse<any>) {
        let time;
        if (expirationTime instanceof Date) {
            time = expirationTime.getTime();
        } else {
            time = new Date().getTime() + expirationTime;
        }
        this.cache[req.urlWithParams] = {
            expirationTime: time,
            response: resp
        };
    }
}
