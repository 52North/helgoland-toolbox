import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LabelMapperComponent } from './label-mapper/label-mapper.component';
import { LabelMapperService } from './label-mapper/label-mapper.service';

const COMPONENTS = [
  LabelMapperComponent
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
  ],
  providers: [
    LabelMapperService
  ]
})
export class HelgolandDepictionModule {
}
