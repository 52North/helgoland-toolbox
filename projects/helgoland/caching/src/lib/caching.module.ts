import { ModuleWithProviders, NgModule } from '@angular/core';
import { HelgolandCoreModule, HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { CachingInterceptor } from './cache-interceptor';
import { CacheConfig, CacheConfigService } from './config';
import { LocalHttpCache } from './local-http-cache';
import { LocalOngoingHttpCache } from './local-ongoing-http-cache';
import { HttpCacheInterval, HttpCache, OnGoingHttpCache } from './model';

import { LocalHttpCacheIntervalInterceptor } from './local-http-cache-interval-interceptor';
import { LocalHttpCacheInterval } from './local-http-cache-interval';

const PROVIDERS = [
  {
    provide: HttpCache,
    useClass: LocalHttpCache
  },
  {
    provide: HttpCacheInterval,
    useClass: LocalHttpCacheInterval
  },
  {
    provide: HTTP_SERVICE_INTERCEPTORS,
    useClass: LocalHttpCacheIntervalInterceptor,
    // useClass: CachingInterceptor,
    multi: true
  },
  {
    provide: OnGoingHttpCache,
    useClass: LocalOngoingHttpCache
  }
];

@NgModule({
  declarations: [],
  imports: [
    HelgolandCoreModule
  ],
  exports: [],
  providers: PROVIDERS
})
export class HelgolandCachingModule {

  static forRoot(config: CacheConfig): ModuleWithProviders {
    return {
      ngModule: HelgolandCachingModule,
      providers: [
        {
          provide: CacheConfigService,
          useValue: config
        }
      ]
    };
  }

}
