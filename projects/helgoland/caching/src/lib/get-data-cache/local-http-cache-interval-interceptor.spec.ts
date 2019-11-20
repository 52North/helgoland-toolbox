import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { DatasetImplApiInterface, DefinedTimespanService, HelgolandCoreModule, HttpService } from '@helgoland/core';
import { TranslateTestingModule } from 'projects/testing/translate.testing.module';

import { HelgolandCachingModule } from '../caching.module';
import { HttpCacheInterval } from '../model';
import { LocalHttpCacheIntervalInterceptor } from './local-http-cache-interval-interceptor';

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
