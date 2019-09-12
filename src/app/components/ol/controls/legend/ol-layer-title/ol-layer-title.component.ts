import { Component, Input, OnInit } from '@angular/core';
import { Layer } from 'ol/layer';
import { TileWMS } from 'ol/source';

import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

@Component({
  selector: 'n52-ol-layer-title',
  templateUrl: './ol-layer-title.component.html'
})
export class OlLayerTitleComponent implements OnInit {

  @Input() layer: Layer;

  public title: string;

  constructor(
    private wmsCaps: WmsCapabilitiesService,
  ) { }

  ngOnInit() {
    const source = this.layer.getSource();
    this.layer.getExtent();
    if (source instanceof TileWMS) {
      const url = source.getUrls()[0];
      const layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
      this.wmsCaps.getTitle(layerid, url).subscribe(res => this.title = res);
    }
  }

}
