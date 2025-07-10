import {
  AfterViewInit,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { HelgolandPlatform } from '@helgoland/core';
import { Feature } from 'geojson';
import * as L from 'leaflet';

import { CachedMapComponent } from '../../base/cached-map-component';

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
  readonly platforms = input<HelgolandPlatform[]>();

  readonly customMarkerIcon = input<L.Icon>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelectedPlatform = output<HelgolandPlatform>();

  private geometryOnMap: L.GeoJSON | undefined;

  private layer: L.MarkerClusterGroup | undefined;

  ngAfterViewInit(): void {
    this.createMap();
    if (this.map) this.drawPlatforms(this.map);
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map) {
      if (changes['platforms']) {
        this.drawPlatforms(this.map);
      }
    }
  }

  private drawPlatforms(map: L.Map) {
    const platforms = this.platforms();
    if (platforms) {
      if (this.layer) {
        map.removeLayer(this.layer);
      }
      this.layer = L.markerClusterGroup({ animate: false });

      this.geometryOnMap = L.geoJSON(undefined, {
        pointToLayer: (feature, latlng) => {
          const customMarkerIcon = this.customMarkerIcon();
          if (customMarkerIcon) {
            return L.marker(latlng, { icon: customMarkerIcon });
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

      platforms.forEach((e) => {
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
