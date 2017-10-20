import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { TimeseriesStyleSelectorComponent } from './timeseries-style-selector/timeseries-style-selector.component';

const COMPONENTS = [
  TimeseriesStyleSelectorComponent
];

@NgModule({
  imports: [
    ColorPickerModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandModificationModule {
}
