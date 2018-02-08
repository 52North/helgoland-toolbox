import { NgModule } from '@angular/core';
import { CoreModule } from '@helgoland/core';

import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';

@NgModule({
  declarations: [
    D3TrajectoryGraphComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    D3TrajectoryGraphComponent
  ],
  providers: []
})
export class D3Module { }
