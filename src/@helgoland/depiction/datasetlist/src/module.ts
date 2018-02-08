import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@helgoland/core';
import { LabelMapperModule } from '@helgoland/depiction/label-mapper';
import { FavoriteModule } from '@helgoland/favorite';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileEntryComponent } from './profile-entry/profile-entry.component';
import { ReferenceValueColorCache, TimeseriesEntryComponent } from './timeseries-entry/timeseries-entry.component';
import { TrajectoryEntryComponent } from './trajectory-entry/trajectory-entry.component';

const COMPONENTS = [
  TimeseriesEntryComponent,
  ProfileEntryComponent,
  TrajectoryEntryComponent
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    LabelMapperModule,
    FavoriteModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    ReferenceValueColorCache
  ]
})
export class HelgolandDatasetlistModule {
}
