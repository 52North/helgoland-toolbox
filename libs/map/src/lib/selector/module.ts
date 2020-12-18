import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { HelgolandMapModule } from '../base/map.module';
import { LastValueMapSelectorComponent } from './last-value-map-selector/last-value-map-selector.component';
import { PlatformMapViewerComponent } from './platform-map-viewer/platform-map-viewer.component';
import { LastValueLabelGenerator } from './services/last-value-label-generator.interface';
import { LastValueLabelGeneratorService } from './services/last-value-label-generator.service';
import { StationMapSelectorComponent } from './station-map-selector/station-map-selector.component';
import { ProfileTrajectoryMapSelectorComponent } from './trajectory-map-selector/trajectory-map-selector.component';

const COMPONENTS = [
    StationMapSelectorComponent,
    ProfileTrajectoryMapSelectorComponent,
    LastValueMapSelectorComponent,
    PlatformMapViewerComponent
];

export interface HelgolandMapSelectorModuleConfig {
    lastValueLabelGeneratorService: Type<LastValueLabelGenerator>;
}

/**
 * The map selector module includes the following functionality:
 * - map based selection
 */
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
        { provide: LastValueLabelGenerator, useClass: LastValueLabelGeneratorService }
    ]
})
export class HelgolandMapSelectorModule {
    static forRoot(config?: HelgolandMapSelectorModuleConfig): ModuleWithProviders {
        return {
            ngModule: HelgolandMapSelectorModule,
            providers: [
                { provide: LastValueLabelGenerator, useClass: config && config.lastValueLabelGeneratorService || LastValueLabelGeneratorService }
            ]
        };
    }
}
