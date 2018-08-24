import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph/d3-overview-timeseries-graph.component';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import {
  ExtendedDataD3TimeseriesGraphComponent,
} from './extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';
import { D3TimeFormatLocaleService } from './helper/d3-time-format-locale.service';

@NgModule({
  declarations: [
    D3TrajectoryGraphComponent,
    D3TimeseriesGraphComponent,
    D3OverviewTimeseriesGraphComponent,
    ExtendedDataD3TimeseriesGraphComponent
  ],
  imports: [
    HelgolandCoreModule
  ],
  exports: [
    D3TrajectoryGraphComponent,
    D3TimeseriesGraphComponent,
    D3OverviewTimeseriesGraphComponent,
    ExtendedDataD3TimeseriesGraphComponent
  ],
  providers: [
    D3TimeFormatLocaleService
  ]
})
export class HelgolandD3Module { }
