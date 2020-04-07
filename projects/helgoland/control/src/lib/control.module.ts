import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BoolTogglerComponent } from './bool-toggler/bool-toggler.component';
import { RefreshButtonComponent } from './refresh-button/refresh-button.component';
import { StringTogglerComponent } from './string-toggler/string-toggler.component';

const COMPONENTS = [
  BoolTogglerComponent,
  StringTogglerComponent,
  RefreshButtonComponent
];

/**
 * The control module includes the following functionality:
 * - simple small control components
 */
@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
  ]
})
export class HelgolandControlModule { }
