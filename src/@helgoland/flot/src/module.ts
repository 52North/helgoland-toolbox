import { NgModule } from '@angular/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction/label-mapper';

import {
  FlotOverviewTimeseriesGraphComponent,
} from './flot-overview-timeseries-graph/flot-overview-timeseries-graph.component';
import { FlotTimeseriesGraphComponent } from './flot-timeseries-graph/flot-timeseries-graph.component';

@NgModule({
  declarations: [
    FlotTimeseriesGraphComponent,
    FlotOverviewTimeseriesGraphComponent
  ],
  imports: [
    HelgolandLabelMapperModule
  ],
  exports: [
    FlotTimeseriesGraphComponent,
    FlotOverviewTimeseriesGraphComponent
  ],
  providers: []
})
export class HelgolandFlotModule { }
