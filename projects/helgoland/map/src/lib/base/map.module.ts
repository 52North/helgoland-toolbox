import { Type } from "@angular/compiler";
import { NgModule } from "@angular/core";

import { MapCache } from "./map-cache.service";
import { MapHandlerService } from "./map-handler.service";

const COMPONENTS: Type[] = [
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
    MapCache,
    MapHandlerService
  ]
})
export class HelgolandMapModule { }
