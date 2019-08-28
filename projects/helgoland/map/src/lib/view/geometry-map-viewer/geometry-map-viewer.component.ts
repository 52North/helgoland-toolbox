import { AfterViewInit, Component, Input, KeyValueDiffers, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { CachedMapComponent } from '../../base/cached-map-component';
import { MapCache } from '../../base/map-cache.service';

@Component({
    selector: 'n52-geometry-map-viewer',
    templateUrl: './geometry-map-viewer.component.html',
    styleUrls: ['./geometry-map-viewer.component.scss']
})
export class GeometryMapViewerComponent extends CachedMapComponent implements AfterViewInit, OnChanges {

    @Input()
    public highlight: GeoJSON.GeoJsonObject;

    @Input()
    public geometry: GeoJSON.GeoJsonObject;

    @Input()
    public zoomTo: GeoJSON.GeoJsonObject;

    @Input()
    public avoidZoomToGeometry: boolean;

    private highlightGeometry: L.GeoJSON;

    private defaultStyle: L.PathOptions = {
        color: 'red',
        weight: 5,
        opacity: 0.65
    };

    private highlightStyle: L.PathOptions = {
        color: 'blue',
        weight: 10,
        opacity: 1
    };

    constructor(
        protected mapCache: MapCache,
        protected kvDiffers: KeyValueDiffers
    ) {
        super(mapCache, kvDiffers);
    }

    public ngAfterViewInit() {
        this.createMap();
        this.drawGeometry();
        this.showHighlight();
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map) {
            if (changes.highlight && changes.highlight.currentValue) {
                this.showHighlight();
            }
            if (changes.geometry) {
                this.drawGeometry();
            }
            if (changes.zoomTo) {
                this.zoomToGeometry();
            }
        }
    }

    private zoomToGeometry() {
        try {
            const geometry = L.geoJSON(this.zoomTo);
            this.map.fitBounds(geometry.getBounds());
        } catch (err) {
            console.error(err);
            return;
        }
    }

    private showHighlight() {
        if (this.highlightGeometry) {
            this.map.removeLayer(this.highlightGeometry);
        }
        this.highlightGeometry = L.geoJSON(this.highlight, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, this.highlightStyle);
            }
        });
        this.highlightGeometry.setStyle(this.highlightStyle);
        this.highlightGeometry.addTo(this.map);
    }

    private drawGeometry() {
        if (this.geometry) {
            const geojson = L.geoJSON(this.geometry, {
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, this.defaultStyle);
                }
            });

            geojson.setStyle(this.defaultStyle);
            geojson.addTo(this.map);

            if (!this.avoidZoomToGeometry) {
                this.map.fitBounds(geojson.getBounds());
            }
        }
    }
}
