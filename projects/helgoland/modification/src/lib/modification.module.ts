import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AxesOptionsComponent } from './axes-options/axes-options.component';
import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { DragOptionsComponent } from './drag-options/drag-options.component';

@NgModule({
  declarations: [
    ColorSelectorComponent,
    AxesOptionsComponent,
    DragOptionsComponent
  ],
  imports: [
    HelgolandCoreModule,
    ColorPickerModule
  ],
  exports: [
    ColorSelectorComponent,
    AxesOptionsComponent,
    DragOptionsComponent
  ],
  providers: [
  ]
})
export class HelgolandModificationModule { }
