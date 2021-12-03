import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3GeneralGraphComponent } from './d3-general-graph/d3-general-graph.component';
import { D3GraphCopyrightComponent } from './d3-series-graph/controls/d3-graph-copyright/d3-graph-copyright.component';
import { D3GraphHoverLineComponent } from './d3-series-graph/controls/d3-graph-hover-line/d3-graph-hover-line.component';
import { D3GraphHoverPointComponent } from './d3-series-graph/controls/d3-graph-hover-point/d3-graph-hover-point.component';
import {
  D3GraphOverviewSelectionComponent,
} from './d3-series-graph/controls/d3-graph-overview-selection/d3-graph-overview-selection.component';
import {
  D3GraphPanZoomInteractionComponent,
} from './d3-series-graph/controls/d3-graph-pan-zoom-interaction/d3-graph-pan-zoom-interaction.component';
import { D3YAxisModifierComponent } from './d3-series-graph/controls/d3-y-axis-modifier/d3-y-axis-modifier.component';
import {
  D3SeriesGraphOverviewWrapperComponent,
} from './d3-series-graph/d3-series-graph-overview-wrapper/d3-series-graph-overview-wrapper.component';
import { D3SeriesGraphWrapperComponent } from './d3-series-graph/d3-series-graph-wrapper/d3-series-graph-wrapper.component';
import { D3SeriesGraphComponent } from './d3-series-graph/d3-series-graph.component';
import {
  D3SeriesGraphErrorHandler,
  D3SeriesSimpleGraphErrorHandler,
} from './d3-timeseries-graph/d3-series-graph-error-handler.service';
import { D3TrajectoryGraphComponent } from './d3-trajectory-graph/d3-trajectory-graph.component';
import { ExportImageButtonComponent } from './export-image-button/export-image-button.component';
import { D3TimeFormatLocaleService } from './helper/d3-time-format-locale.service';
import { D3DataGeneralizer } from './helper/generalizing/d3-data-generalizer';
import { D3DataSimpleGeneralizer } from './helper/generalizing/d3-data-simple-generalizer.service';

const COMPONENTS = [
  D3SeriesGraphComponent,
  D3SeriesGraphWrapperComponent,
  D3SeriesGraphOverviewWrapperComponent,
  D3GeneralGraphComponent,
  D3GraphCopyrightComponent,
  D3GraphHoverLineComponent,
  D3GraphHoverPointComponent,
  D3GraphOverviewSelectionComponent,
  D3GraphPanZoomInteractionComponent,
  D3TrajectoryGraphComponent,
  D3YAxisModifierComponent,
  ExportImageButtonComponent,
];

/**
 * The d3 module includes the following functionality:
 * - on d3 based graphs
 * - timeseries graph component
 * - trajectory graph component
 * - different graph controls
 * - graph export control
 */
@NgModule({
  declarations: COMPONENTS,
  imports: [
    HelgolandCoreModule,
    CommonModule
  ],
  exports: COMPONENTS,
  providers: [
    D3TimeFormatLocaleService,
    // configured default generalizer, can be overridden by self provided service
    {
      provide: D3DataGeneralizer,
      useClass: D3DataSimpleGeneralizer
    },
    {
      provide: D3SeriesGraphErrorHandler,
      useClass: D3SeriesSimpleGraphErrorHandler
    }
  ],
  entryComponents: [
  ]
})
export class HelgolandD3Module { }
