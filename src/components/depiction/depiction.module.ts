import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { HelgolandServicesModule } from '../../services/services.module';
import { LabelMapperComponent } from './label-mapper/label-mapper.component';

const COMPONENTS = [
  LabelMapperComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HelgolandServicesModule,
    NgbModalModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandDepictionModule { }
