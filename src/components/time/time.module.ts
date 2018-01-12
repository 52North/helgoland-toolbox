import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HelgolandServicesModule } from './../../services/services.module';
import { PredefinedTimespanSelectorComponent } from './predefined-timespan-selector/predefined-timespan-selector.component';
import { TimeListSelectorComponent } from './time-list-selector/time-list-selector.component';
import { TimeRangeSliderSelectorComponent } from './time-range-slider-selector/time-range-slider-selector.component';
import { TimeRangeSliderSelectorCache } from './time-range-slider-selector/time-range-slider-selector.service';
import { TimespanButtonComponent } from './timespan-button/timespan-button.component';
import { TimespanShiftSelectorComponent } from './timespan-shift-selector/timespan-shift-selector.component';

const COMPONENTS = [
  PredefinedTimespanSelectorComponent,
  TimeListSelectorComponent,
  TimeRangeSliderSelectorComponent,
  TimespanShiftSelectorComponent,
  TimespanButtonComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HelgolandServicesModule
  ],
  declarations: [
    COMPONENTS,
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    TimeRangeSliderSelectorCache
  ]
})
export class HelgolandTimeModule {
}
