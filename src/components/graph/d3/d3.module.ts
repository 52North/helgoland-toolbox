import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../../services/services.module';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';

const COMPONENTS = [
  D3TrajectoryGraphComponent
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
