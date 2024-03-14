import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from 'ol/layer';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

/**
 * Legend component to ascertain the legend url, gathered by the WMS capabilities
 */
@Component({
  selector: 'n52-ol-layer-legend-url',
  templateUrl: './ol-layer-legend-url.component.html',
  standalone: true,
})
export class OlLayerLegendUrlComponent {
  @Input({ required: true })
  layer!: Layer;

  /**
   * Returns the legend url
   */
  @Output() legendUrl: EventEmitter<string> = new EventEmitter();

  constructor(private wmsCaps: WmsCapabilitiesService) {}

  public deliverLegendUrl() {
    const source = this.layer.getSource();
    this.layer.getExtent();
    if (source instanceof TileWMS && source.getUrls()?.length) {
      const url = source.getUrls()![0];
      const layerid =
        source.getParams()['layers'] || source.getParams()['LAYERS'];
      this.wmsCaps
        .getLegendUrl(layerid, url)
        .subscribe((res) => this.legendUrl.emit(res));
    }
  }
}
