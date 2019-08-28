import { Component } from '@angular/core';

import { LayerControlComponent } from '../layer-control-component';
import { MapHandlerService } from './../../base/map-handler.service';

@Component({
  selector: 'n52-layer-visible-toggler',
  templateUrl: './layer-visible-toggler.component.html',
  styleUrls: ['./layer-visible-toggler.component.css']
})
export class LayerVisibleTogglerComponent extends LayerControlComponent {

  constructor(
    private mapHandler: MapHandlerService
  ) {
    super();
  }

  public toggle() {
    this.mapHandler.toggleOverlayLayer(this.layeroptions, this.mapId);
  }

}
