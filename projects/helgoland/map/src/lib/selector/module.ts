import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { HelgolandMapModule } from '../base/map.module';
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
        HelgolandCoreModule,
        HelgolandMapModule
    ],
    exports: [
        COMPONENTS
    ],
    providers: [
    ]
})
export class HelgolandMapSelectorModule { }
