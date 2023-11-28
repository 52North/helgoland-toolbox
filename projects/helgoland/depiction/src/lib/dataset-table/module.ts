import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HelgolandCoreModule } from "@helgoland/core";
import { TranslateModule } from "@ngx-translate/core";

import { DatasetTableComponent } from "./dataset-table.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandCoreModule,
    DatasetTableComponent
  ],
  exports: [
    DatasetTableComponent
  ],
  providers: []
})
export class HelgolandDatasetTableModule { }
