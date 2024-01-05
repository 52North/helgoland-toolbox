import { HttpClient } from '@angular/common/http';
import {
  GeoJSON,
  GeoJSONOptions,
  LatLngBounds,
  LeafletEvent,
  Map,
} from 'leaflet';

export interface GeoCureGeoJSONOptions extends GeoJSONOptions {
  url: string;
  httpClient: HttpClient;
  showOnMinZoom?: number;
  showOnMaxZoom?: number;
}

export class GeoCureGeoJSON extends GeoJSON {
  public override options: GeoCureGeoJSONOptions;

  constructor(options: GeoCureGeoJSONOptions) {
    super();
    this.options = options;
  }

  public override getEvents() {
    const events = {
      moveend: (event: LeafletEvent) => this.fetchData(event.target),
    };
    return events;
  }

  public override onAdd(map: Map): this {
    super.onAdd(map);
    this.fetchData(map);
    return this;
  }

  private fetchData(map: Map) {
    const matchMaxZoom = this.options.showOnMaxZoom
      ? map.getZoom() <= this.options.showOnMaxZoom
      : true;
    const matchMinZoom = this.options.showOnMinZoom
      ? map.getZoom() >= this.options.showOnMinZoom
      : true;
    if (matchMinZoom && matchMaxZoom) {
      this.loadData(map.getBounds());
    } else {
      this.clearLayers();
    }
  }

  private loadData(bounds: LatLngBounds) {
    const bboxparam = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(',');
    this.options.httpClient
      .get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(
        this.options.url,
        {
          params: {
            bbox: bboxparam,
          },
        },
      )
      .subscribe((geojson) => {
        this.clearLayers();
        this.addData(geojson);
      });
  }
}
