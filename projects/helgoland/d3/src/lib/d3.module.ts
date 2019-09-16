import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3GeneralGraphComponent } from './d3-general-graph/d3-general-graph.component';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph/d3-overview-timeseries-graph.component';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import { D3YAxisModifierComponent } from './d3-y-axis-modifier/d3-y-axis-modifier.component';
import {
  ExtendedDataD3TimeseriesGraphComponent,
} from './extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';
import { D3TimeFormatLocaleService } from './helper/d3-time-format-locale.service';

const COMPONENTS = [
  D3TrajectoryGraphComponent,
  D3TimeseriesGraphComponent,
  D3OverviewTimeseriesGraphComponent,
  ExtendedDataD3TimeseriesGraphComponent,
  D3GeneralGraphComponent,
  D3YAxisModifierComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    HelgolandCoreModule
  ],
  exports: COMPONENTS,
  providers: [
    D3TimeFormatLocaleService
  ]
})
export class HelgolandD3Module { }
