import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { HelgolandCoreModule, HttpService, DefinedTimespanService, DefinedTimespan, DatasetImplApiInterface } from '@helgoland/core';

import { LocalHttpCacheIntervalInterceptor } from './local-http-cache-interval-interceptor';
import { HttpCacheInterval } from './model';
import { HelgolandCachingModule } from './caching.module';
import { TranslateTestingModule } from 'projects/testing/translate.testing.module';

describe('LocalHttpCacheIntervalInterceptor', () => {
  let definedTimespanSrvc: DefinedTimespanService;
  let apiSrvc: DatasetImplApiInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HelgolandCoreModule,
        HelgolandCachingModule,
        TranslateTestingModule
      ],
      providers: [
        DefinedTimespanService,
        DatasetImplApiInterface,
        LocalHttpCacheIntervalInterceptor,
        HttpCacheInterval
      ]
    });
    apiSrvc = TestBed.get(DatasetImplApiInterface);
    definedTimespanSrvc = TestBed.get(DefinedTimespanService);
  });

  it('should be created', inject([LocalHttpCacheIntervalInterceptor], (service: LocalHttpCacheIntervalInterceptor) => {
    expect(service).toBeTruthy();
  }));

  it('should be ', inject([LocalHttpCacheIntervalInterceptor, HttpService], (service: LocalHttpCacheIntervalInterceptor, httpService: HttpService) => {
    const url = 'https://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/services';
    httpService.client({ expirationAtMs: new Date().getTime() + 1000 }).get(url)
      .subscribe(res => {
      });
    setTimeout(() => {
      httpService.client().get(url).subscribe();
    }, 2000);
  }));

});
