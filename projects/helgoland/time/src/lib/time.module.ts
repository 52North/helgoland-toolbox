import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { PredefinedTimespanSelectorComponent } from './predefined-timespan-selector/predefined-timespan-selector.component';
import { TimeListSelectorComponent } from './time-list-selector/time-list-selector.component';
import { TimespanButtonComponent } from './timespan-button/timespan-button.component';
import { TimespanShiftSelectorComponent } from './timespan-shift-selector/timespan-shift-selector.component';
import { AutoUpdateTimespanComponent } from './auto-update-timespan/auto-update-timespan.component';

const COMPONENTS = [
  PredefinedTimespanSelectorComponent,
  TimeListSelectorComponent,
  TimespanShiftSelectorComponent,
  TimespanButtonComponent,
  AutoUpdateTimespanComponent
];

/**
 * The time module includes the following functionality:
 * - different time controls to manipulate a timestamp or timeinterval
 */
@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    HelgolandCoreModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandTimeModule { }
