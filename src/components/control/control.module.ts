import { StringTogglerComponent } from './string-toggler/string-toggler.component';
import { BoolTogglerComponent } from './bool-toggler/bool-toggler.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const COMPONENTS = [
  BoolTogglerComponent,
  StringTogglerComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandControlModule {
}
