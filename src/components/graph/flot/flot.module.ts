import { NgModule } from '@angular/core';

import { HelgolandServicesModule } from './../../../services/services.module';
import {
    FlotOverviewTimeseriesGraphComponent,
} from './flot-overview-timeseries-graph/flot-overview-timeseries-graph.component';
import { FlotTimeseriesGraphComponent } from './flot-timeseries-graph/flot-timeseries-graph.component';

const COMPONENTS = [
  FlotTimeseriesGraphComponent,
  FlotOverviewTimeseriesGraphComponent
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
export class HelgolandFlotGraphModule {
}
