import { NgModule } from '@angular/core';
import { MapModule } from '@helgoland/map';

import { GeometryMapViewerComponent } from './geometry-map-viewer/geometry-map-viewer.component';

@NgModule({
    declarations: [
        GeometryMapViewerComponent
    ],
    imports: [
        MapModule
    ],
    exports: [
        GeometryMapViewerComponent
    ],
    providers: [
    ]
})
export class MapViewModule { }
