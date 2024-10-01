import { Injectable } from '@angular/core';
import {
  FeatureGroup,
  GridLayer,
  ImageOverlay,
  Path,
  Popup,
  Tooltip,
} from 'leaflet';

import { MapCache } from './map-cache.service';
import { LayerMap, LayerOptions } from './map-options';

@Injectable({
  providedIn: 'root',
})
export class MapHandlerService {
  constructor(private mapCache: MapCache) {}

  toggleOverlayLayer(layer: LayerOptions, mapId: string) {
    if (this.mapCache.hasMap(mapId)) {
      const map = this.mapCache.getMap(mapId);
      if (layer.visible) {
        map.removeLayer(layer.layer);
      } else {
        map.addLayer(layer.layer);
      }
      layer.visible = !layer.visible;
    }
  }

  toggleBaseLayer(layer: LayerOptions, baseMaps: LayerMap, mapId: string) {
    if (!layer.visible) {
      const map = this.mapCache.getMap(mapId);
      layer.visible = !layer.visible;
      // disable all base layer
      baseMaps.forEach((v) => {
        v.visible = false;
        map.removeLayer(v.layer);
      });
      // enable current base layer
      layer.visible = true;
      map.addLayer(layer.layer);
      if (
        layer.layer instanceof ImageOverlay ||
        layer.layer instanceof GridLayer ||
        layer.layer instanceof Path ||
        layer.layer instanceof FeatureGroup ||
        layer.layer instanceof Popup ||
        layer.layer instanceof Tooltip
      ) {
        layer.layer.bringToBack();
      }
    }
  }
}
