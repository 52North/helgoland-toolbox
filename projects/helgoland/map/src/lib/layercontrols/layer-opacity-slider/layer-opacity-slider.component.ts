import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { TileLayer } from 'leaflet';

import { FormsModule } from '@angular/forms';
import { LayerControlComponent } from '../layer-control-component';

@Component({
  selector: 'n52-layer-opacity-slider',
  templateUrl: './layer-opacity-slider.component.html',
  styleUrls: ['./layer-opacity-slider.component.css'],
  imports: [FormsModule],
})
export class LayerOpacitySliderComponent
  extends LayerControlComponent
  implements OnChanges
{
  opacity: number | undefined;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const layeroptions = this.layeroptions();
    if (
      changes['layeroptions'] &&
      layeroptions.layer instanceof TileLayer &&
      layeroptions.layer.options.opacity
    ) {
      this.opacity = layeroptions.layer.options.opacity * 100;
    }
  }

  setOpacity(o: number) {
    this.opacity = o;
    const layeroptions = this.layeroptions();
    if (layeroptions.layer instanceof TileLayer) {
      layeroptions.layer.setOpacity(this.opacity / 100);
    }
  }
}
