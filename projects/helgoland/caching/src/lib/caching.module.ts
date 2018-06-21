import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { CachingInterceptor } from './cache-interceptor';
import { LocalHttpCache } from './local-http-cache';
import { LocalOngoingHttpCache } from './local-ongoing-http-cache';
import { HttpCache, OnGoingHttpCache } from './model';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
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
    },
  ]
})
export class HelgolandCachingModule { }
