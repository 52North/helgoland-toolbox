import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiMapping } from './api-interface/api-mapping.service';
import { InternalIdHandler } from './api-interface/internal-id-handler.service';
import { ColorService } from './color/color.service';
import { LocalStorage } from './local-storage/local-storage.service';
import { NotifierService } from './notifier/notifier.service';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';
import { DateProxyPipe } from './pipes/dateproxy/dateproxy.pipe';
 
@NgModule({
  declarations: [
    DateProxyPipe
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    DateProxyPipe
  ],
  providers: [
    InternalIdHandler,
    ApiMapping,
    DefinedTimespanService,
    Time,
    LocalStorage,
    NotifierService,
    ColorService
  ]
})
export class HelgolandCoreModule { }
