import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@helgoland/core';
import { MapModule } from '@helgoland/map';

import { PlatformMapSelectorComponent } from './platform-map-selector/platform-map-selector.component';
import { StationMapSelectorComponent } from './station-map-selector/station-map-selector.component';
import { ProfileTrajectoryMapSelectorComponent } from './trajectory-map-selector/trajectory-map-selector.component';

const COMPONENTS = [
    PlatformMapSelectorComponent,
    StationMapSelectorComponent,
    ProfileTrajectoryMapSelectorComponent
];

@NgModule({
    declarations: [
        COMPONENTS
    ],
    imports: [
        CommonModule,
        CoreModule,
        MapModule
    ],
    exports: [
        COMPONENTS
    ],
    providers: [
    ]
})
export class MapSelectorModule { }
