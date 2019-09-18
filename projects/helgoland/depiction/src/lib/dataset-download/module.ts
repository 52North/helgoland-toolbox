import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { MatDialogModule } from '@angular/material';

import { DatasetPermalinkDownloadComponent } from './dataset-permalink-download/dataset-permalink-download.component';
import { DatasetExportComponent } from './dataset-export/dataset-export.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandCoreModule,
    MatDialogModule,
  ],
  declarations: [
    DatasetExportComponent,
    DatasetPermalinkDownloadComponent
  ],
  exports: [
    DatasetExportComponent,
    DatasetPermalinkDownloadComponent
  ],
  providers: []
})
export class HelgolandDatasetDownloadModule { }
