import { NgModule } from '@angular/core';

import { MapCache } from './map-cache.service';

const COMPONENTS = [
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
    MapCache
  ]
})
export class MapModule { }
