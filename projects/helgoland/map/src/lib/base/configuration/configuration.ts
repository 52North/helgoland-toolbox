import { tileLayer, TileLayerOptions, WMSOptions } from "leaflet";

import { LayerOptions } from "../map-options";

export interface LayerConfiguration {
    label: string;
    visible: boolean;
    type: string;
    options: any;
}

export interface WmsConfiguration extends LayerConfiguration {
    type: "wms";
    url: string;
    options: WMSOptions;
}

export interface TileLayerConfiguration extends LayerConfiguration {
    type: "tilelayer";
    urlTemplate: string;
    options: TileLayerOptions;
}

export class LayerCreator {

  public createLayerOptions(layerConf: LayerConfiguration): LayerOptions {
    switch (layerConf.type) {
      case "wms":
        return this.createWmsLayerOptions(layerConf as WmsConfiguration);
      case "tilelayer":
        return this.createTileLayerOptions(layerConf as TileLayerConfiguration);
      default:
        throw new Error(`Unknown layer configuration type: ${layerConf.type}`);
    }
  }

  private createWmsLayerOptions(conf: WmsConfiguration) {
    return {
      label: conf.label,
      visible: conf.visible,
      layer: tileLayer.wms(conf.url, conf.options)
    };
  }

  private createTileLayerOptions(conf: TileLayerConfiguration) {
    return {
      label: conf.label,
      visible: conf.visible,
      layer: tileLayer(conf.urlTemplate, conf.options)
    };
  }
}