import {
  AfterViewInit,
  Component,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';
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
  standalone: true,
})
export class OlLayerComponent
  extends OlBaseComponent
  implements AfterViewInit, OnChanges
{
  /**
   * Configured layer
   */
  readonly layer = input.required<BaseLayer>();

  private map!: Map;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.layer()) {
      this.addLayer();
    }
  }

  mapInitialized(map: Map) {
    this.map = map;
    this.addLayer();
  }

  private addLayer() {
    const layer = this.layer();
    if (this.map && layer) {
      this.map.addLayer(layer);
    }
  }
}
