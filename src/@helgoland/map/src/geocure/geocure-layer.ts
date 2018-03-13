import { HttpClient } from '@angular/common/http';
import { GeoJSON, GeoJSONOptions, LatLngBounds, LeafletEvent } from 'leaflet';

export interface GeoCureGeoJSONOptions extends GeoJSONOptions {
    url: string;
    httpClient: HttpClient;
    showOnMinZoom?: number;
    showOnMaxZoom?: number;
}

export class GeoCureGeoJSON extends GeoJSON {

    public options: GeoCureGeoJSONOptions;

    constructor(options?: GeoCureGeoJSONOptions) {
        super();
        if (options) {
            this.options = options;
        }
    }

    public getEvents() {
        const events = {
            moveend: (event: LeafletEvent) => this.fetchData(event.target)
        };
        return events;
    }

    public onAdd(map: L.Map): this  {
        super.onAdd(map);
        this.fetchData(map);
        return this;
    }

    private fetchData(map: L.Map) {
        const matchMaxZoom = this.options.showOnMaxZoom ? map.getZoom() <= this.options.showOnMaxZoom : true;
        const matchMinZoom = this.options.showOnMinZoom ? map.getZoom() >= this.options.showOnMinZoom : true;
        if (matchMinZoom && matchMaxZoom) {
            this.loadData(map.getBounds());
        } else {
            this.clearLayers();
        }
    }

    private loadData(bounds: LatLngBounds) {
        const bboxparam = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(',');
        this.options.httpClient
            .get<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>(this.options.url, {
                params: {
                    bbox: bboxparam
                }
            })
            .subscribe((geojson) => {
                this.clearLayers();
                this.addData(geojson);
            });
    }
}
