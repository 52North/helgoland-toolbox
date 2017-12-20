import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiMapping } from './api-interface/api-mapping.service';
import { InternalIdHandler } from './api-interface/internal-id-handler.service';
import { ColorService } from './color/color.service';
import { LabelMapperService } from './label-mapper/label-mapper.service';
import { LocalStorage } from './local-storage/local-storage.service';
import { MapCache } from './map/map.service';
import { NotifierService } from './notifier/notifier.service';
import { DefinedTimespanService } from './time/defined-timespan.service';
import { Time } from './time/time.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        ApiMapping,
        InternalIdHandler,
        LocalStorage,
        Time,
        DefinedTimespanService,
        MapCache,
        ColorService,
        NotifierService,
        LabelMapperService
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class HelgolandServicesModule { }
