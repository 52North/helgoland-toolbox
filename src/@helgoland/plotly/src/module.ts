import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { PlotlyProfileGraphComponent } from './plotly';

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
