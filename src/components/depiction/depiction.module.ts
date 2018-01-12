import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from '../../services/services.module';
import { LabelMapperComponent } from './label-mapper/label-mapper.component';

const COMPONENTS = [
  LabelMapperComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HelgolandServicesModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandDepictionModule { }
