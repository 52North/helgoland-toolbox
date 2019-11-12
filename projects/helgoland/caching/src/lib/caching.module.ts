import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { HelgolandCoreModule, HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { CachingInterceptor } from './cache-interceptor';
import { LocalHttpCache } from './local-http-cache';
import { LocalOngoingHttpCache } from './local-ongoing-http-cache';
import { HttpCache, OnGoingHttpCache } from './model';

/**
 * Configuration for the HelgolandCachingModule
 */
export interface CacheConfig {
  /**
   * Duration in milliseconds, how long equal request will be cached until refresh
   */
  cachingDurationInMilliseconds?: number;
}

export const CacheConfigService = new InjectionToken<CacheConfig>('CacheConfigService');

const PROVIDERS = [
  {
    provide: HttpCache,
    useClass: LocalHttpCache
  },
  {
    provide: HTTP_SERVICE_INTERCEPTORS,
    useClass: CachingInterceptor,
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
