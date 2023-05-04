import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { HelgolandMapModule } from '../base/map.module';
import { LayerOpacitySliderComponent } from './layer-opacity-slider/layer-opacity-slider.component';
import { LayerVisibleTogglerComponent } from './layer-visible-toggler/layer-visible-toggler.component';

const COMPONENTS = [
  LayerVisibleTogglerComponent,
  LayerOpacitySliderComponent,
];

/**
 * The layer controls module includes the following functionality:
 * - controls to handle layer
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HelgolandCoreModule,
        HelgolandMapModule,
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ],
    providers: []
})
export class HelgolandLayerControlModule { }
