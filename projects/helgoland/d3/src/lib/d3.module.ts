import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3GeneralGraphComponent } from './d3-general-graph/d3-general-graph.component';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph/d3-overview-timeseries-graph.component';
import { D3GraphCopyrightComponent } from './d3-timeseries-graph/controls/d3-graph-copyright/d3-graph-copyright.component';
import { D3GraphHoverLineComponent } from './d3-timeseries-graph/controls/d3-graph-hover-line/d3-graph-hover-line.component';
import {
  D3GraphHoverPointComponent,
} from './d3-timeseries-graph/controls/d3-graph-hover-point/d3-graph-hover-point.component';
import {
  D3GraphOverviewSelectionComponent,
} from './d3-timeseries-graph/controls/d3-graph-overview-selection/d3-graph-overview-selection.component';
import {
  D3GraphPanZoomInteractionComponent,
} from './d3-timeseries-graph/controls/d3-graph-pan-zoom-interaction/d3-graph-pan-zoom-interaction.component';
import { D3YAxisModifierComponent } from './d3-timeseries-graph/controls/d3-y-axis-modifier/d3-y-axis-modifier.component';
import {
  D3TimeseriesGraphErrorHandler,
  D3TimeseriesSimpleGraphErrorHandler,
} from './d3-timeseries-graph/d3-timeseries-graph-error-handler.service';
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
  D3GeneralGraphComponent,
  D3GraphCopyrightComponent,
  D3GraphHoverLineComponent,
  D3GraphHoverPointComponent,
  D3GraphOverviewSelectionComponent,
  D3GraphPanZoomInteractionComponent,
  D3OverviewTimeseriesGraphComponent,
  D3TimeseriesGraphComponent,
  D3TrajectoryGraphComponent,
  D3YAxisModifierComponent,
  ExportImageButtonComponent,
  ExtendedDataD3TimeseriesGraphComponent,
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
        D3TimeseriesGraphComponent,
        // configured default generalizer, can be overridden by self provided service
        {
            provide: D3DataGeneralizer,
            useClass: D3DataSimpleGeneralizer
        },
        {
            provide: D3TimeseriesGraphErrorHandler,
            useClass: D3TimeseriesSimpleGraphErrorHandler
        }
    ]
})
export class HelgolandD3Module { }
