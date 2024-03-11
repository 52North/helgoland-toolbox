import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerAbstractComponent } from './controls/legend/ol-layer-abstract/ol-layer-abstract.component';
import { OlLayerAnimateTimeComponent } from './controls/legend/ol-layer-animate-time/ol-layer-animate-time.component';
import { OlLayerLegendUrlComponent } from './controls/legend/ol-layer-legend-url/ol-layer-legend-url.component';
import {
  OlLayerOpacitiySliderComponent,
} from './controls/legend/ol-layer-opacitiy-slider/ol-layer-opacitiy-slider.component';
import { OlLayerTimeSelectorComponent } from './controls/legend/ol-layer-time-selector/ol-layer-time-selector.component';
import { OlLayerTitleComponent } from './controls/legend/ol-layer-title/ol-layer-title.component';
import {
  OlLayerVisibilityTogglerComponent,
} from './controls/legend/ol-layer-visibility-toggler/ol-layer-visibility-toggler.component';
import { OlLayerZoomExtentComponent } from './controls/legend/ol-layer-zoom-extent/ol-layer-zoom-extent.component';
import { OlMousePositionComponent } from './controls/ol-mouse-position/ol-mouse-position.component';
import { OlOverviewMapComponent } from './controls/ol-overview-map/ol-overview-map.component';
import { OlLayerComponent } from './layers/ol-layer/ol-layer.component';
import { OlStationSelectorLayerComponent } from './layers/ol-station-selector-layer/ol-station-selector-layer.component';
import { OlMapComponent } from './ol-map/ol-map.component';

const COMPONENTS = [
  OlLayerAbstractComponent,
  OlLayerAnimateTimeComponent,
  OlLayerComponent,
  OlLayerLegendUrlComponent,
  OlLayerOpacitiySliderComponent,
  OlLayerTimeSelectorComponent,
  OlLayerTitleComponent,
  OlLayerVisibilityTogglerComponent,
  OlLayerZoomExtentComponent,
  OlMapComponent,
  OlMousePositionComponent,
  OlOverviewMapComponent,
  OlStationSelectorLayerComponent,
];

/**
 * The open layers module includes the following functionality:
 * - open-layers map component and different control components
 */
@NgModule({
    exports: COMPONENTS,
    imports: [
        CommonModule,
        FormsModule,
        HelgolandCoreModule,
        ...COMPONENTS
    ]
})
export class HelgolandOpenLayersModule { }
