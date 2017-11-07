import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { ColorSelectorComponent } from './color-selector/color-selector.component';

const COMPONENTS = [
  ColorSelectorComponent
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
