import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { HelgolandDepictionModule } from './../depiction/depiction.module';
import { DatasetByStationSelectorComponent } from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { ListSelectorService } from './list-selector/list-selector.service';
import { MultiPhenomenonListComponent } from './multi-phenomenon-list/multi-phenomenon-list.component';
import {
    MultiServiceFilterSelectorComponent,
} from './multi-service-filter-selector/multi-service-filter-selector.component';
import { ProviderSelectorComponent } from './provider-selector/provider-selector.component';
import { ProviderSelectorService } from './provider-selector/provider-selector.service';
import { ServiceFilterSelectorComponent } from './service-filter-selector/service-filter-selector.component';

const COMPONENTS = [
    ProviderSelectorComponent,
    DatasetByStationSelectorComponent,
    ListSelectorComponent,
    MultiServiceFilterSelectorComponent,
    ServiceFilterSelectorComponent,
    MultiPhenomenonListComponent
];

@NgModule({
    imports: [
        CommonModule,
        HelgolandDepictionModule,
        NgbAccordionModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ],
    providers: [
        ProviderSelectorService,
        ListSelectorService
    ]
})
export class HelgolandSelectorModule {
}
