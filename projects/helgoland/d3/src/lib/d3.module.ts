import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3GeneralGraphComponent } from './d3-general-graph/d3-general-graph.component';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph/d3-overview-timeseries-graph.component';
import { D3GraphCopyrightComponent } from './d3-timeseries-graph/controls/d3-graph-copyright/d3-graph-copyright.component';
import {
  D3GraphPanZoomInteractionComponent,
} from './d3-timeseries-graph/controls/d3-graph-pan-zoom-interaction/d3-graph-pan-zoom-interaction.component';
import { D3YAxisModifierComponent } from './d3-timeseries-graph/controls/d3-y-axis-modifier/d3-y-axis-modifier.component';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import { ExportImageButtonComponent } from './export-image-button/export-image-button.component';
import {
  ExtendedDataD3TimeseriesGraphComponent,
} from './extended-data-d3-timeseries-graph/extended-data-d3-timeseries-graph.component';
import { D3TimeFormatLocaleService } from './helper/d3-time-format-locale.service';
import { D3DataGeneralizer } from './helper/generalizing/d3-data-generalizer';
import { D3DataSimpleGeneralizer } from './helper/generalizing/d3-data-simple-generalizer.service';

const COMPONENTS = [
  D3TrajectoryGraphComponent,
  D3TimeseriesGraphComponent,
  D3OverviewTimeseriesGraphComponent,
  ExtendedDataD3TimeseriesGraphComponent,
  D3GeneralGraphComponent,
  ExportImageButtonComponent,
  D3YAxisModifierComponent,
  D3GraphPanZoomInteractionComponent,
  D3GraphCopyrightComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    HelgolandCoreModule,
    CommonModule
  ],
  exports: COMPONENTS,
  providers: [
    D3TimeFormatLocaleService,
    D3TimeseriesGraphComponent,
    // configured default generalizer, can be overridden by self provided service
    {
      provide: D3DataGeneralizer,
      useClass: D3DataSimpleGeneralizer
    }
  ],
  entryComponents: [
    D3TimeseriesGraphComponent,
  ]
})
export class HelgolandD3Module { }
