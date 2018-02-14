import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction/label-mapper';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetByStationSelectorComponent } from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { ListSelectorService } from './list-selector/list-selector.service';
import {
  MultiServiceFilterSelectorComponent,
} from './multi-service-filter-selector/multi-service-filter-selector.component';
import { ProviderSelectorComponent } from './provider-selector/provider-selector.component';
import { ProviderSelectorService } from './provider-selector/provider-selector.service';
import { ServiceFilterSelectorComponent } from './service-filter-selector/service-filter-selector.component';

@NgModule({
  declarations: [
    ProviderSelectorComponent,
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
    ProviderSelectorComponent,
    ServiceFilterSelectorComponent,
    DatasetByStationSelectorComponent,
    MultiServiceFilterSelectorComponent,
    ListSelectorComponent
  ],
  providers: [
    ProviderSelectorService,
    ListSelectorService
  ]
})
export class HelgolandSelectorModule { }
