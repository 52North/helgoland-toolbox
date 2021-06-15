import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { PlotlyProfileGraphComponent } from './plotly-profile-graph/plotly-profile-graph.component';

import { PlotlyViaCDNModule } from 'angular-plotly.js';

PlotlyViaCDNModule.setPlotlyVersion('1.55.2');
PlotlyViaCDNModule.setPlotlyBundle('basic');

/**
 * The ploty module includes the following functionality:
 * - plotly based profile chart component
 */
@NgModule({
  declarations: [
    PlotlyProfileGraphComponent
  ],
  imports: [
    HelgolandCoreModule,
    PlotlyViaCDNModule
  ],
  exports: [
    PlotlyProfileGraphComponent
  ],
  providers: []
})
export class HelgolandPlotlyModule { }
