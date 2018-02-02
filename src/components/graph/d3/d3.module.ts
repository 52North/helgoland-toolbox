import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../../services/services.module';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import { D3FlotTimeseriesGraphComponent } from './d3-flot-timeseries-graph/d3-flot-timeseries-graph.component';

const COMPONENTS = [
  D3TrajectoryGraphComponent,
  D3FlotTimeseriesGraphComponent
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
export class HelgolandD3GraphModule {
}
