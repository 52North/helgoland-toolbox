import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetDownloadComponent } from './dataset-download.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandCoreModule
  ],
  declarations: [
    DatasetDownloadComponent
  ],
  exports: [
    DatasetDownloadComponent
  ],
  providers: []
})
export class HelgolandDatasetDownloadModule { }
