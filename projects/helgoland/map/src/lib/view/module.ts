import { NgModule } from '@angular/core';

import { HelgolandMapModule } from '../base/map.module';
import { GeometryMapViewerComponent } from './geometry-map-viewer/geometry-map-viewer.component';

/**
 * The map view module includes the following functionality:
 * - geometry map viewer component
 */
@NgModule({
  imports: [HelgolandMapModule, GeometryMapViewerComponent],
  exports: [GeometryMapViewerComponent],
  providers: [],
})
export class HelgolandMapViewModule {}
