import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HelgolandLabelMapperModule } from "../label-mapper.module";
import { LABEL_MAPPER_HANDLER } from "../label-mapper.service";
import { VocabNercLabelMapperService } from "./vocab-nerc-label-mapper.service";

@NgModule({
  imports: [
    CommonModule,
    HelgolandLabelMapperModule
  ],
  providers: [
    {
      provide: LABEL_MAPPER_HANDLER,
      useClass: VocabNercLabelMapperService,
      multi: true
    }
  ]
})
export class VocabNercLabelMapperModule { }
