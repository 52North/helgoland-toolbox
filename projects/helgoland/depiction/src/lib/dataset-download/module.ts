import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { DatasetExportComponent } from './dataset-export/dataset-export.component';
import { DatasetPermalinkDownloadComponent } from './dataset-permalink-download/dataset-permalink-download.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandCoreModule,
    DatasetExportComponent,
    DatasetPermalinkDownloadComponent,
  ],
  exports: [DatasetExportComponent, DatasetPermalinkDownloadComponent],
  providers: [],
})
export class HelgolandDatasetDownloadModule {}
