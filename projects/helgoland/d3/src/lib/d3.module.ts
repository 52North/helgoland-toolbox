import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3TimeseriesGraphComponent } from './d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';

@NgModule({
  declarations: [
    D3TrajectoryGraphComponent,
    D3TimeseriesGraphComponent
  ],
  imports: [
    HelgolandCoreModule
  ],
  exports: [
    D3TrajectoryGraphComponent,
    D3TimeseriesGraphComponent
  ],
  providers: []
})
export class HelgolandD3Module { }
