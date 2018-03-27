import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { AxesOptionsComponent } from './axes-options/axes-options.component';
import { DragOptionsComponent } from './drag-options/drag-options.component';

const COMPONENTS = [
  ColorSelectorComponent,
  AxesOptionsComponent,
  DragOptionsComponent
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
