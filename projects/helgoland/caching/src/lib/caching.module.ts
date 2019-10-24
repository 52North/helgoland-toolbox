import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS, HelgolandCoreModule } from '@helgoland/core';

import { CachingInterceptor } from './cache-interceptor';
import { LocalHttpCache } from './local-http-cache';
import { LocalOngoingHttpCache } from './local-ongoing-http-cache';
import { HttpCacheInterval, HttpCache, OnGoingHttpCache } from './model';

import { LocalHttpCacheIntervalInterceptor } from './local-http-cache-interval-interceptor';
import { LocalHttpCacheInterval } from './local-http-cache-interval';

@NgModule({
  declarations: [],
  imports: [
    HelgolandCoreModule
  ],
  exports: [],
  providers: [
    {
      provide: HttpCache,
      useClass: LocalHttpCache
    },
    // {
    //   provide: HTTP_SERVICE_INTERCEPTORS,
    //   useClass: CachingInterceptor,
    //   multi: true
    // },
    {
      provide: HttpCacheInterval,
      useClass: LocalHttpCacheInterval
    },
    {
      provide: HTTP_SERVICE_INTERCEPTORS,
      useClass: LocalHttpCacheIntervalInterceptor,
      multi: true
    },
    {
      provide: OnGoingHttpCache,
      useClass: LocalOngoingHttpCache
    },
  ]
})
export class HelgolandCachingModule { }
