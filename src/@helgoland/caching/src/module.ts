import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { CachingInterceptor, HttpCache, LocalHttpCache, LocalOngoingHttpCache, OnGoingHttpCache } from './caching';

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
