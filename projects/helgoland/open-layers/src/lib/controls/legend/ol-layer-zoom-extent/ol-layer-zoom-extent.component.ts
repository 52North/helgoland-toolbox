import { Component, Input, OnInit } from "@angular/core";
import { Required } from "@helgoland/core";
import { View } from "ol";
import BaseLayer from "ol/layer/Base";
import Layer from "ol/layer/Layer";
import { transformExtent } from "ol/proj";
import { TileWMS } from "ol/source";

import { OlMapService } from "../../../services/map.service";
import { WmsCapabilitiesService } from "../../../services/wms-capabilities.service";

/**
 * Legend component to gather the layer extent by the WMS capabilities and provide the ability to zoom to the extent
 */
@Component({
  selector: "n52-ol-layer-zoom-extent",
  templateUrl: "./ol-layer-zoom-extent.component.html",
  standalone: true
})
export class OlLayerZoomExtentComponent implements OnInit {

  @Input()
  @Required
    layer!: BaseLayer;

  /**
   * corresponding map id
   */
  @Input()
  @Required
    mapId!: string;

  private extent: number[] | undefined;
  private crs: string | undefined;
  private view: View | undefined;

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
      if (source instanceof TileWMS && source.getUrls()?.length) {
        const url = source.getUrls()![0];
        this.mapServices.getMap(this.mapId).subscribe(map => {
          this.view = map.getView();
          const epsgCode = this.view.getProjection().getCode();
          const layerid = source.getParams()["layers"] || source.getParams()["LAYERS"];
          this.wmsCaps.getExtent(layerid, url, epsgCode).subscribe(res => {
            if (res) {
              this.extent = res.extent;
              this.crs = res.crs;
            }
          });
        });
      }
    }
  }

  public zoomToExtent() {
    if (this.extent && this.view) {
      if (!this.crs) {
        this.view.fit(this.extent);
      } else {
        const transformation = transformExtent(this.extent, this.crs, this.view.getProjection().getCode());
        this.view.fit(transformation);
      }
    }
  }
}
