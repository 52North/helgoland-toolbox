import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetTableComponent } from './dataset-table.component';

@NgModule({
    declarations: [
        DatasetTableComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        DatasetTableComponent
    ],
    providers: [
    ]
})
export class HelgolandDatasetTableModule { }
