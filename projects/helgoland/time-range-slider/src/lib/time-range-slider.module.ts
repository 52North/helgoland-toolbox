import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { TimeRangeSliderComponent } from './time-range-slider.component';
import { TimeRangeSliderCache } from './time-range-slider.service';

@NgModule({
  exports: [TimeRangeSliderComponent],
  imports: [CommonModule, HelgolandCoreModule, TimeRangeSliderComponent],
  providers: [TimeRangeSliderCache],
})
export class HelgolandTimeRangeSliderModule {}
