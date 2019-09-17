import { Component, Input, OnInit } from '@angular/core';
import { Required } from '@helgoland/core';
import { View } from 'ol';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import { transformExtent } from 'ol/proj';
import { TileWMS } from 'ol/source';

import { OlMapService } from '../../../services/map.service';
import { WmsCapabilitiesService } from '../../../services/wms-capabilities.service';

@Component({
  selector: 'n52-ol-layer-zoom-extent',
  templateUrl: './ol-layer-zoom-extent.component.html'
})
export class OlLayerZoomExtentComponent implements OnInit {

  @Required @Input() layer: BaseLayer;

  @Required @Input() mapId: string;

  private url: string;
  private layerid: string;
  private extent: number[];
  private crs: string;
  private view: View;

  constructor(
    private wmsCaps: WmsCapabilitiesService,
    private mapServices: OlMapService
  ) { }

  ngOnInit() {
    if (this.layer.getExtent()) {
      this.extent = this.layer.getExtent();
    } else if (this.layer instanceof Layer) {
      const source = this.layer.getSource();
      this.layer.getExtent();
      if (source instanceof TileWMS) {
        this.url = source.getUrls()[0];
        this.mapServices.getMap(this.mapId).subscribe(map => {
          this.view = map.getView();
          const epsgCode = this.view.getProjection().getCode();
          this.layerid = source.getParams()['layers'] || source.getParams()['LAYERS'];
          this.wmsCaps.getExtent(this.layerid, this.url, epsgCode).subscribe(res => {
            this.extent = res.extent;
            this.crs = res.crs;
          });
        });
      }
    }
  }

  public zoomToExtent() {
    if (this.extent) {
      if (!this.crs) {
        this.view.fit(this.extent);
      } else {
        const transformation = transformExtent(this.extent, this.crs, this.view.getProjection().getCode());
        this.view.fit(transformation);
      }
    }
  }
}
