import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { View } from 'ol';
import { Attribution, Control, Zoom } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map.js';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';

import { OlMapService } from '../services/map.service';
import { OlMapId } from '../services/mapid.service';

@Component({
  selector: 'n52-ol-map',
  template: '<div class="map" [attr.id]="mapId"></div>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../../../../node_modules/ol/ol.css',
    'ol-map.component.scss'
  ],
  providers: [OlMapId]
})
export class OlMapComponent implements OnInit, AfterViewInit {

  /** Map id
     */
  @Input() mapId: string;

  /** Longitude of the map
   */
  @Input() lon = 0;

  /** Latitude of the map
   */
  @Input() lat = 0;

  /** Zoom of the map
   */
  @Input() zoom = 1;

  @Input() projection = 'EPSG:3857';

  @Input() showZoomControl = true;

  @Input() showAttributionControl = true;

  private map: Map;

  constructor(
    private mapService: OlMapService,
    private mapid: OlMapId,
  ) { }

  ngOnInit() {
    if (this.mapId === undefined || this.mapId === null) {
      this.mapId = this.generateUUID();
    }
  }

  ngAfterViewInit(): void {
    const controls: Control[] = [];
    if (this.showZoomControl) { controls.push(new Zoom()); }
    if (this.showAttributionControl) { controls.push(new Attribution()); }

    this.map = new Map({
      layers: [new TileLayer({ source: new OSM() })],
      controls: controls,
      target: this.mapId,
      view: new View({
        projection: this.projection,
        center: fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      })
    });
    this.mapService.setMap(this.mapId, this.map);
    this.mapid.setId(this.mapId);
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
