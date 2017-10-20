import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GeometryMapViewerComponent } from './geometry-map-viewer/geometry-map-viewer.component';

const COMPONENTS = [
  GeometryMapViewerComponent
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
  ]
})
export class HelgolandMapViewModule {
}
