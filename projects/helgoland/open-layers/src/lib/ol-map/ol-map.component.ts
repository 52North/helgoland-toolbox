import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { View } from 'ol';
import { Control } from 'ol/control';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

import { OlMapService } from '../services/map.service';
import { OlMapId } from '../services/mapid.service';

/**
 * Basic open layers map component, which creates a map with an OSM layer as first base layer.
 */
@Component({
  selector: 'n52-ol-map',
  template: '<div class="map" [attr.id]="mapId()"></div>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../../node_modules/ol/ol.css',
    'ol-map.component.scss',
  ],
  providers: [OlMapId],
  standalone: true,
})
export class OlMapComponent implements AfterViewInit {
  private mapService = inject(OlMapService);
  private mapid = inject(OlMapId);

  /**
   * The map id, to reference this map outside of this component. If no id is given, a unique one is generated
   */
  readonly mapId = input.required<string>();

  /**
   * Longitude to center the map
   */
  readonly lon = input(0);

  /**
   * Latitude to center the map
   */
  readonly lat = input(0);

  /**
   * Zoom level of the map
   */
  readonly zoom = input(1);

  /**
   * Projection of the map
   */
  readonly projection = input('EPSG:3857');

  /**
   * Should the zoom controls be visible on the map
   */
  readonly showZoomControl = input(true);

  /**
   * Should the attribution label be visible on the map
   */
  readonly showAttributionControl = input(true);

  private map!: Map;

  ngAfterViewInit(): void {
    const controls: Control[] = [];
    if (this.showZoomControl()) {
      controls.push(new Zoom());
    }
    if (this.showAttributionControl()) {
      controls.push(new Attribution());
    }

    const center = fromLonLat([this.lon(), this.lat()]);
    this.map = new Map({
      layers: [new TileLayer({ source: new OSM() })],
      controls: controls,
      target: this.mapId(),
      view: new View({
        projection: this.projection(),
        center: center,
        zoom: this.zoom(),
      }),
    });
    const mapId = this.mapId();
    this.mapService.setMap(mapId, this.map);
    this.mapid.setId(mapId);
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
