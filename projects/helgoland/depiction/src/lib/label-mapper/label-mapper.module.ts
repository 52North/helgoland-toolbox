import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LabelMapperComponent } from './label-mapper.component';
import { LabelMapperService } from './label-mapper.service';

@NgModule({
  imports: [CommonModule, LabelMapperComponent],
  exports: [LabelMapperComponent],
  providers: [LabelMapperService],
})
export class HelgolandLabelMapperModule {}
