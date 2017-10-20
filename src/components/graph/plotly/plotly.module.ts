import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../../services/services.module';
import { PlotlyProfileGraphComponent } from './plotly-profile-graph/plotly-profile-graph.component';

const COMPONENTS = [
    PlotlyProfileGraphComponent
];

@NgModule({
    imports: [
        HelgolandServicesModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class HelgolandPlotlyGraphModule {
}
