import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HelgolandServicesModule } from './../../services/services.module';
import { HelgolandDepictionModule } from './../depiction/depiction.module';
import { DatasetByStationSelectorComponent } from './dataset-by-station-selector/dataset-by-station-selector.component';
import { ListSelectorComponent } from './list-selector/list-selector.component';
import { ListSelectorService } from './list-selector/list-selector.service';
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
    ServiceFilterSelectorComponent
];

@NgModule({
    imports: [
        CommonModule,
        HelgolandDepictionModule,
        HelgolandServicesModule,
        NgbAccordionModule,
        TranslateModule
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
