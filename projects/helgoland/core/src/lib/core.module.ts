import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';

import { ColorService } from './color/color.service';
import { DatasetApiMapping } from './dataset-api/api-mapping.service';
import { StatusIntervalResolverService } from './dataset-api/helper/status-interval-resolver.service';
import { HttpService } from './dataset-api/http.service';
import { InternalIdHandler } from './dataset-api/internal-id-handler.service';
import { LocalStorage } from './local-storage/local-storage.service';
import { Settings } from './model/settings/settings';
import { NotifierService } from './notifier/notifier.service';
import { DateProxyPipe } from './pipes/dateproxy/dateproxy.pipe';
import { SumValuesService } from './processing/sum-values.service';
import { SettingsService } from './settings/settings.service';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({});
  }
}

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
    ColorService,
    DatasetApiMapping,
    DefinedTimespanService,
    InternalIdHandler,
    LocalStorage,
    NotifierService,
    StatusIntervalResolverService,
    SumValuesService,
    HttpService,
    Time,
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    }
  ]
})
export class HelgolandCoreModule { }
