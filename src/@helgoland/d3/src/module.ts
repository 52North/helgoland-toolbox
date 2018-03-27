import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';

@NgModule({
  declarations: [
    D3TrajectoryGraphComponent
  ],
  imports: [
    HelgolandCoreModule
  ],
  exports: [
    D3TrajectoryGraphComponent
  ],
  providers: []
})
export class HelgolandD3Module { }
