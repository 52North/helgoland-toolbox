import { NgModule } from '@angular/core';
import { CoreModule } from '@helgoland/core';

import { PlotlyProfileGraphComponent } from './plotly';

@NgModule({
  declarations: [
    PlotlyProfileGraphComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    PlotlyProfileGraphComponent
  ],
  providers: []
})
export class PlotlyModule { }
