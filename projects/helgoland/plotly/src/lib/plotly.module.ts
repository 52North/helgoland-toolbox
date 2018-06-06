import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { PlotlyProfileGraphComponent } from './plotly-profile-graph/plotly-profile-graph.component';

@NgModule({
  declarations: [
    PlotlyProfileGraphComponent
  ],
  imports: [
    HelgolandCoreModule
  ],
  exports: [
    PlotlyProfileGraphComponent
  ],
  providers: []
})
export class HelgolandPlotlyModule { }
