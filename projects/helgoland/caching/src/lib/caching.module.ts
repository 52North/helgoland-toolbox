import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  HelgolandCoreModule,
  HTTP_SERVICE_INTERCEPTORS,
} from '@helgoland/core';

import { CacheConfig, CacheConfigService } from './config';
import { LocalHttpCacheInterval } from './get-data-cache/local-http-cache-interval';
import { LocalHttpCacheIntervalInterceptor } from './get-data-cache/local-http-cache-interval-interceptor';
import { CachingInterceptor } from './http-get-cache/cache-interceptor';
import { LocalHttpCache } from './http-get-cache/local-http-cache';
import { LocalOngoingHttpCache } from './http-get-cache/local-ongoing-http-cache';
import { HttpCache, HttpCacheInterval, OnGoingHttpCache } from './model';

const GET_DATA_CACHE_PROVIDERS = [
  {
    provide: HTTP_SERVICE_INTERCEPTORS,
    useClass: LocalHttpCacheIntervalInterceptor,
    multi: true,
  },
  {
    provide: HttpCacheInterval,
    useClass: LocalHttpCacheInterval,
  },
];

const HTTP_GET_PROVIDERS = [
  {
    provide: HttpCache,
    useClass: LocalHttpCache,
  },
  {
    provide: HTTP_SERVICE_INTERCEPTORS,
    useClass: CachingInterceptor,
    multi: true,
  },
  {
    provide: OnGoingHttpCache,
    useClass: LocalOngoingHttpCache,
  },
];

/**
 * The caching module includes the following functionality:
 * - caches similar requests
 */
@NgModule({
  declarations: [],
  imports: [HelgolandCoreModule],
  exports: [],
  providers: [HTTP_GET_PROVIDERS],
})
export class HelgolandCachingModule {
  static forRoot(
    config: CacheConfig,
  ): ModuleWithProviders<HelgolandCachingModule> {
    return {
      ngModule: HelgolandCachingModule,
      providers: [
        ...(config.getDataCacheActive ? GET_DATA_CACHE_PROVIDERS : []),
        {
          provide: CacheConfigService,
          useValue: config,
        },
      ],
    };
  }
}
