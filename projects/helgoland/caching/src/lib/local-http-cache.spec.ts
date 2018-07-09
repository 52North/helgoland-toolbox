import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HttpService } from '@helgoland/core';

import { LocalHttpCache } from './local-http-cache';
import { HelgolandCachingModule } from './caching.module';

describe('LocalHttpCache', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCachingModule
            ],
            providers: [
                LocalHttpCache
            ]
        });
    });

    it('should be created', inject([LocalHttpCache], (service: LocalHttpCache) => {
        expect(service).toBeTruthy();
    }));

    it('should be ', inject([LocalHttpCache, HttpService], (cache: LocalHttpCache, httpService: HttpService) => {
        const url = 'https://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/services';
        httpService.client({ expirationTime: 1000 }).get(url)
            .subscribe(res => {
            });
        setTimeout(() => {
            httpService.client().get(url).subscribe();
        }, 2000);
    }));

});
