import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AxesOptionsComponent } from './axes-options/axes-options.component';
import { ColorSelectorComponent } from './color-selector/color-selector.component';

@NgModule({
  declarations: [
    ColorSelectorComponent,
    AxesOptionsComponent
  ],
  imports: [
    HelgolandCoreModule,
    ColorPickerModule
  ],
  exports: [
    ColorSelectorComponent,
    AxesOptionsComponent
  ],
  providers: [
  ]
})
export class HelgolandModificationModule { }
