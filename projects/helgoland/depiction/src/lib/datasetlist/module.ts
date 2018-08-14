import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { HelgolandLabelMapperModule } from '../label-mapper/label-mapper.module';
import { ProfileEntryComponent } from './profile-entry/profile-entry.component';
import { SimpleTimeseriesEntryComponent } from './simple-timeseries-entry/simple-timeseries-entry.component';
import { ReferenceValueColorCache, TimeseriesEntryComponent } from './timeseries-entry/timeseries-entry.component';
import { TrajectoryEntryComponent } from './trajectory-entry/trajectory-entry.component';
import { ConfigurableTimeseriesEntryComponent } from './configurable-timeseries-entry/configurable-timeseries-entry.component';

const COMPONENTS = [
  TimeseriesEntryComponent,
  ConfigurableTimeseriesEntryComponent,
  SimpleTimeseriesEntryComponent,
  ProfileEntryComponent,
  TrajectoryEntryComponent
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    HelgolandCoreModule,
    HelgolandLabelMapperModule,
    FormsModule
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
