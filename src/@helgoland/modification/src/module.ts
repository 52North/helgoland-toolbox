import { NgModule } from '@angular/core';
import { CoreModule } from '@helgoland/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AxesOptionsComponent } from './axes-options/axes-options.component';
import { ColorSelectorComponent } from './color-selector/color-selector.component';

@NgModule({
  declarations: [
    ColorSelectorComponent,
    AxesOptionsComponent
  ],
  imports: [
    CoreModule,
    ColorPickerModule
  ],
  exports: [
    ColorSelectorComponent,
    AxesOptionsComponent
  ],
  providers: [
  ]
})
export class ModificationModule { }
