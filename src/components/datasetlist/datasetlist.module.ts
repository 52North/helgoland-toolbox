import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../services/services.module';
import { HelgolandDepictionModule } from './../depiction/depiction.module';
import { HelgolandMapViewModule } from './../map/view/view.module';
import { HelgolandModificationModule } from './../modification/modification.module';
import { ProfileEntryComponent } from './profile-entry/profile-entry.component';
import { TimeseriesEntryComponent } from './timeseries-entry/timeseries-entry.component';

const COMPONENTS = [
  TimeseriesEntryComponent,
  ProfileEntryComponent
];

@NgModule({
  imports: [
    CommonModule,
    HelgolandModificationModule,
    HelgolandDepictionModule,
    HelgolandMapViewModule,
    HelgolandServicesModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandDatasetlistModule {
}
