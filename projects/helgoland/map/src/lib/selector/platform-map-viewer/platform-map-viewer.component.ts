import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HelgolandPlatform } from '@helgoland/core';
import { Feature } from 'geojson';
import * as L from 'leaflet';

import { CachedMapComponent } from '../../base/cached-map-component';
import { MapCache } from '../../base/map-cache.service';

@Component({
  selector: 'n52-platform-map-viewer',
  templateUrl: './platform-map-viewer.component.html',
  styleUrls: ['./platform-map-viewer.component.scss'],
  standalone: true,
})
export class PlatformMapViewerComponent
  extends CachedMapComponent
  implements AfterViewInit, OnChanges
{
  @Input() public platforms: HelgolandPlatform[] | undefined;

  @Input() public customMarkerIcon: L.Icon | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onSelectedPlatform: EventEmitter<HelgolandPlatform> =
    new EventEmitter();

  private geometryOnMap: L.GeoJSON | undefined;

  private layer: L.MarkerClusterGroup | undefined;

  constructor(
    protected override mapCache: MapCache,
    protected override kvDiffers: KeyValueDiffers,
  ) {
    super(mapCache, kvDiffers);
  }

  ngAfterViewInit(): void {
    this.createMap();
    if (this.map) this.drawPlatforms(this.map);
  }

  public override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map) {
      if (changes['platforms']) {
        this.drawPlatforms(this.map);
      }
    }
  }

  private drawPlatforms(map: L.Map) {
    if (this.platforms) {
      if (this.layer) {
        map.removeLayer(this.layer);
      }
      this.layer = L.markerClusterGroup({ animate: false });

      this.geometryOnMap = L.geoJSON(undefined, {
        pointToLayer: (feature, latlng) => {
          if (this.customMarkerIcon) {
            return L.marker(latlng, { icon: this.customMarkerIcon });
          } else {
            return L.marker(latlng);
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties?.platform?.label);
          layer.on('click', (evt) => {
            console.log(evt.target.feature.id);
            this.onSelectedPlatform.emit(
              evt.target.feature.properties.platform,
            );
          });
        },
      });

      this.platforms.forEach((e) => {
        if (e.geometry) {
          const feature: Feature = {
            geometry: e.geometry,
            id: e.id,
            properties: {
              platform: e,
            },
            type: 'Feature',
          };
          this.geometryOnMap!.addData(feature);
        }
      });
      this.layer.addLayer(this.geometryOnMap);
      map.addLayer(this.layer);
      map.fitBounds(this.geometryOnMap.getBounds());
    }
  }
}
