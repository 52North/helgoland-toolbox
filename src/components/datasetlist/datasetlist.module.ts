import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HelgolandFavoriteModule } from '../favorite/favorite.module';
import { HelgolandServicesModule } from './../../services/services.module';
import { HelgolandDepictionModule } from './../depiction/depiction.module';
import { HelgolandMapViewModule } from './../map/view/view.module';
import { HelgolandModificationModule } from './../modification/modification.module';
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
    HelgolandModificationModule,
    HelgolandDepictionModule,
    HelgolandMapViewModule,
    HelgolandServicesModule,
    HelgolandFavoriteModule
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
