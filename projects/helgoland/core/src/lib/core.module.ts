import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ColorService } from './color/color.service';
import { DatasetApiMapping } from './dataset-api/api-mapping.service';
import { HttpService } from './dataset-api/http.service';
import { InternalIdHandler } from './dataset-api/internal-id-handler.service';
import { LocalStorage } from './local-storage/local-storage.service';
import { NotifierService } from './notifier/notifier.service';
import { DateProxyPipe } from './pipes/dateproxy/dateproxy.pipe';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';

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
    DatasetApiMapping,
    DefinedTimespanService,
    Time,
    LocalStorage,
    NotifierService,
    ColorService
  ]
})
export class HelgolandCoreModule { }
