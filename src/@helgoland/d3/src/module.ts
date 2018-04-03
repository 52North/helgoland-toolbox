import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import { D3FlotTimeseriesGraphComponent } from './d3-flot-timeseries-graph/d3-flot-timeseries-graph.component';

@NgModule({
  declarations: [
    D3TrajectoryGraphComponent,
    D3FlotTimeseriesGraphComponent
  ],
  imports: [
    HelgolandCoreModule
  ],
  exports: [
    D3TrajectoryGraphComponent,
    D3FlotTimeseriesGraphComponent
  ],
  providers: []
})
export class HelgolandD3Module { }
