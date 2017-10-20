import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../../services/services.module';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph/d3-timeseries-graph.component';

const COMPONENTS = [
  D3TimeseriesGraphComponent
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
