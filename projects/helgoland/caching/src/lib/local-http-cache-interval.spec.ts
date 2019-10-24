import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HttpService, Timespan, DefinedTimespanService, DefinedTimespan } from '@helgoland/core';

import { LocalHttpCacheInterval, CachedObject } from './local-http-cache-interval';
import { HelgolandCachingModule } from './caching.module';

describe('LocalHttpCacheInterval', () => {
    let defTsSrvc: DefinedTimespanService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCachingModule
            ],
            providers: [
                LocalHttpCacheInterval,
                DefinedTimespanService
            ]
        });
        defTsSrvc = TestBed.get(DefinedTimespanService);
    });

    it('should be created', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        expect(service).toBeTruthy();
    }));

    it('should cache', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const url = 'uniqueID';
        const el: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan.from, 1],
                    [currTimespan.to, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        service.put(url, el);

        expect(service.get(url)).toBeTruthy();
        expect(service.get(url)).toBeDefined();
        expect(service.get(url)).toContain(el);
        expect(service.get(url)).toEqual([el]);
    }));

    it('should cache two objects', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const currTimespan2 = defTsSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
        const url1 = 'uniqueID1';
        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan1.from, 1],
                    [currTimespan1.to, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        const url2 = 'uniqueID2';
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan2.from, 1],
                    [currTimespan2.to, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };

        service.put(url2, el2);
        expect(service.get(url2)).toBeTruthy();
        expect(service.get(url2)).toBeDefined();
        expect(service.get(url2)).toContain(el2);
        expect(service.get(url2)).toEqual([el2]);


        service.put(url1, el1);
        service.put(url1, el2);

        expect(service.get(url1)).toBeTruthy();
        expect(service.get(url1)).toBeDefined();
        expect(service.get(url1)).toContain(el1);
        expect(service.get(url1)).toBeTruthy();
        expect(service.get(url1)).toBeDefined();
        expect(service.get(url1)).toContain(el2);
        expect(service.get(url1)).toEqual([el1, el2]);
    }));


});
