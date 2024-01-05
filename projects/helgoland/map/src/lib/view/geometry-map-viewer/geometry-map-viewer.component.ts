import {
  AfterViewInit,
  Component,
  Input,
  KeyValueDiffers,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';

import { CachedMapComponent } from '../../base/cached-map-component';
import { MapCache } from '../../base/map-cache.service';

@Component({
  selector: 'n52-geometry-map-viewer',
  templateUrl: './geometry-map-viewer.component.html',
  styleUrls: ['./geometry-map-viewer.component.scss'],
  standalone: true,
})
export class GeometryMapViewerComponent
  extends CachedMapComponent
  implements AfterViewInit, OnChanges
{
  @Input()
  public highlight: GeoJSON.GeoJsonObject | undefined;

  @Input()
  public geometry: GeoJSON.GeoJsonObject | undefined;

  @Input()
  public zoomTo: GeoJSON.GeoJsonObject | undefined;

  @Input()
  public avoidZoomToGeometry: boolean | undefined;

  @Input()
  public customMarkerIcon: L.Icon | undefined;

  private highlightGeometryOnMap: L.GeoJSON | undefined;
  private geometryOnMap: L.GeoJSON | undefined;

  private defaultStyle: L.PathOptions = {
    color: 'red',
    weight: 5,
    opacity: 0.65,
  };

  private highlightStyle: L.PathOptions = {
    color: 'blue',
    weight: 10,
    opacity: 1,
  };

  constructor(
    protected override mapCache: MapCache,
    protected override kvDiffers: KeyValueDiffers,
  ) {
    super(mapCache, kvDiffers);
  }

  public ngAfterViewInit() {
    this.createMap();
    if (this.map) {
      this.drawGeometry(this.map);
      this.showHighlight(this.map);
    }
  }

  public override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map) {
      if (changes['highlight'] && changes['highlight'].currentValue) {
        this.showHighlight(this.map);
      }
      if (changes['geometry']) {
        this.drawGeometry(this.map);
      }
      if (changes['zoomTo']) {
        this.zoomToGeometry(this.map);
      }
    }
  }

  private zoomToGeometry(map: L.Map) {
    try {
      const geometry = L.geoJSON(this.zoomTo);
      map.fitBounds(geometry.getBounds());
    } catch (err) {
      console.error(err);
      return;
    }
  }

  private showHighlight(map: L.Map) {
    if (this.highlightGeometryOnMap) {
      map.removeLayer(this.highlightGeometryOnMap);
    }
    this.highlightGeometryOnMap = L.geoJSON(this.highlight, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, this.highlightStyle);
      },
    });
    this.highlightGeometryOnMap.setStyle(this.highlightStyle);
    this.highlightGeometryOnMap.addTo(map);
  }

  private drawGeometry(map: L.Map) {
    if (this.geometry) {
      if (this.geometryOnMap) {
        map.removeLayer(this.geometryOnMap);
      }
      this.geometryOnMap = L.geoJSON(this.geometry, {
        pointToLayer: (feature, latlng) => {
          if (this.customMarkerIcon) {
            return L.marker(latlng, { icon: this.customMarkerIcon });
          } else {
            return L.circleMarker(latlng, this.defaultStyle);
          }
        },
      });

      this.geometryOnMap.setStyle(this.defaultStyle);
      this.geometryOnMap.addTo(map);

      if (!this.avoidZoomToGeometry) {
        map.fitBounds(this.geometryOnMap.getBounds());
      }
    }
  }
}
