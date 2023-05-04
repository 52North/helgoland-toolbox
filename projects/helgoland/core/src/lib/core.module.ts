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
import { MatchLabelPipe } from './pipes/matchLabel/match-label.pipe';
import { SumValuesService } from './processing/sum-values.service';
import { SettingsService } from './settings/settings.service';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';
import { TzDatePipe } from './time/tz-date.pipe';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({});
  }
}

/**
 * The core module includes the following functionality:
 * - the communication to the different APIs
 * - describes the base internal model
 * - language handling
 * - settings handling
 * - some pipes
 * - time service for calculations
 */
@NgModule({
    imports: [
        HttpClientModule,
        MatchLabelPipe,
        TzDatePipe
    ],
    exports: [
        MatchLabelPipe,
        TzDatePipe,
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
        Time
    ]
})
export class HelgolandCoreModule { }
