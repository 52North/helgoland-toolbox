import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiMapping } from './api-interface/api-mapping.service';
import { InternalIdHandler } from './api-interface/internal-id-handler.service';
import { LocalStorage } from './local-storage/local-storage.service';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [
    InternalIdHandler,
    ApiMapping,
    DefinedTimespanService,
    Time,
    LocalStorage
  ]
})
export class CoreModule { }
