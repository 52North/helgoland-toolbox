import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { AxesOptionsComponent } from './axes-options/axes-options.component';

const COMPONENTS = [
  ColorSelectorComponent,
  AxesOptionsComponent
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
