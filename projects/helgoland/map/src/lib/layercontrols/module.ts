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

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    HelgolandCoreModule,
    HelgolandMapModule
  ],
  exports: [
    COMPONENTS
  ],
  providers: []
})
export class HelgolandLayerControlModule { }
