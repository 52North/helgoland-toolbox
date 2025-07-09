import { Component, inject } from '@angular/core';

import { LayerControlComponent } from '../layer-control-component';
import { MapHandlerService } from './../../base/map-handler.service';

@Component({
  selector: 'n52-layer-visible-toggler',
  templateUrl: './layer-visible-toggler.component.html',
  styleUrls: ['./layer-visible-toggler.component.css'],
  standalone: true,
})
export class LayerVisibleTogglerComponent extends LayerControlComponent {
  private mapHandler = inject(MapHandlerService);

  public toggle() {
    this.mapHandler.toggleOverlayLayer(this.layeroptions(), this.mapId());
  }
}
