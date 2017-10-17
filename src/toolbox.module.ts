import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiInterface } from './services/api-interface/api-interface.service';
import { ApiMapping } from './services/api-interface/api-mapping.service';
import { CachingInterceptor, HttpCache } from './services/api-interface/caching/caching-interceptor';
import { LocalHttpCache } from './services/api-interface/caching/local-cache';
import { InternalIdHandler } from './services/api-interface/internal-id-handler.service';
import { ColorService } from './services/color/color.service';
import { LocalStorage } from './services/local-storage/local-storage.service';
import { MapCache } from './services/map/map.service';
import { Time } from './services/time/time.service';

@NgModule({
  providers: [
    {
      provide: HttpCache,
      useClass: LocalHttpCache
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    ApiInterface,
    ApiMapping,
    InternalIdHandler,
    LocalStorage,
    Time,
    MapCache,
    ColorService
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class HelgolandToolboxModule {
}
