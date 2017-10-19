import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { PredefinedTimespanSelectorComponent } from './predefined-timespan-selector/predefined-timespan-selector.component';
import { TimeListSelectorComponent } from './time-list-selector/time-list-selector.component';
import { TimeRangeSliderSelectorComponent } from './time-range-slider-selector/time-range-slider-selector.component';
import { TimespanSelectorComponent } from './timespan-selector/timespan-selector.component';
import { TimespanShiftSelectorComponent } from './timespan-shift-selector/timespan-shift-selector.component';

const COMPONENTS = [
  PredefinedTimespanSelectorComponent,
  TimeListSelectorComponent,
  TimeRangeSliderSelectorComponent,
  TimespanSelectorComponent,
  TimespanShiftSelectorComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
  ]
})
export class HelgolandTimeModule {
}
