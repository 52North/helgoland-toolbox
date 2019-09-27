import { AfterViewInit, Component, Input } from '@angular/core';
import { Map } from 'ol';
import BaseLayer from 'ol/layer/Base';

import { OlBaseComponent } from '../../ol-base.component';

/**
 * Component to configure an additional layer to the map. The component must be embedded as seen in the example
 *
 * @example
 * <n52-ol-map>
 *     <n52-ol-layer></n52-ol-layer>
 * </n52-ol-map>
 */
@Component({
  selector: 'n52-ol-layer',
  template: '',
})
export class OlLayerComponent extends OlBaseComponent implements AfterViewInit {

  /**
   * Configured layer
   */
  @Input() layer: BaseLayer;

  mapInitialized(map: Map) {
    if (this.layer) {
      map.addLayer(this.layer);
    }
  }

}
