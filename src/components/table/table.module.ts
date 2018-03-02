import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetTableComponent } from './dataset-table/dataset-table.component';
import { HelgolandPipesModule } from '../../pipes/pipes.module';

const COMPONENTS = [
    DatasetTableComponent
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        HelgolandPipesModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ],
    providers: [
    ]
})
export class HelgolandTableModule {
}
