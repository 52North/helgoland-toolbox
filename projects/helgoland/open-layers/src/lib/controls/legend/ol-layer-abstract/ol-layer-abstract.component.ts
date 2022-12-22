import { Component, Input, OnInit } from '@angular/core';
import { Required } from '@helgoland/core';
import { Layer } from 'ol/layer';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

/**
 * Legend component to display the abstract, gathered by the WMS capabilities
 */
@Component({
  selector: 'n52-ol-layer-abstract',
  templateUrl: './ol-layer-abstract.component.html'
})
export class OlLayerAbstractComponent implements OnInit {

  @Required @Input() layer: Layer;

  public abstract: string;

  constructor(
    private wmsCaps: WmsCapabilitiesService,
  ) { }

  ngOnInit() {
    const source = this.layer.getSource();
    this.layer.getExtent();
    if (source instanceof TileWMS && source.getUrls()?.length) {
      const url = source.getUrls()![0];
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
      this.wmsCaps.getAbstract(layerid, url).subscribe(res => this.abstract = res);
    }
  }

}
