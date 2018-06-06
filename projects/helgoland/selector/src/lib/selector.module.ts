import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetByStationSelectorComponent } from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { ListSelectorService } from './list-selector/list-selector.service';
import {
  MultiServiceFilterSelectorComponent,
} from './multi-service-filter-selector/multi-service-filter-selector.component';
import { ServiceFilterSelectorComponent } from './service-filter-selector/service-filter-selector.component';
import { ServiceSelectorComponent } from './service-selector/service-selector.component';
import { ServiceSelectorService } from './service-selector/service-selector.service';

@NgModule({
  declarations: [
    ServiceSelectorComponent,
    ServiceFilterSelectorComponent,
    DatasetByStationSelectorComponent,
    MultiServiceFilterSelectorComponent,
    ListSelectorComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandLabelMapperModule,
    HelgolandCoreModule
  ],
  exports: [
    ServiceSelectorComponent,
    ServiceFilterSelectorComponent,
    DatasetByStationSelectorComponent,
    MultiServiceFilterSelectorComponent,
    ListSelectorComponent
  ],
  providers: [
    ServiceSelectorService,
    ListSelectorService
  ]
})
export class HelgolandSelectorModule { }
