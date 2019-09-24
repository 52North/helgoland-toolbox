import { AfterViewInit, Component, Input } from '@angular/core';
import { Map } from 'ol';
import BaseLayer from 'ol/layer/Base';

import { OlBaseComponent } from '../../ol-base.component';

@Component({
  selector: 'n52-ol-layer',
  template: '',
})
export class OlLayerComponent extends OlBaseComponent implements AfterViewInit {

  @Input() layer: BaseLayer;

  mapInitialized(map: Map) {
    if (this.layer) {
      map.addLayer(this.layer);
    }
  }

}
