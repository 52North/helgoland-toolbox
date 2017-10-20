import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { LabelMapperComponent } from './label-mapper/label-mapper.component';
import { LabelMapperService } from './label-mapper/label-mapper.service';

const COMPONENTS = [
  LabelMapperComponent
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModalModule
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
export class HelgolandDepictionModule {}
