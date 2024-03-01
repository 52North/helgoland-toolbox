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

    @Input()
    public customMarkerIcon: L.Icon;

    private highlightGeometryOnMap: L.GeoJSON;
    private geometryOnMap: L.GeoJSON;

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
        protected override mapCache: MapCache,
        protected override kvDiffers: KeyValueDiffers
    ) {
        super(mapCache, kvDiffers);
    }

    public ngAfterViewInit() {
        this.createMap();
        this.drawGeometry();
        this.showHighlight();
    }

    public override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map) {
            if (changes['highlight'] && changes['highlight'].currentValue) {
                this.showHighlight();
            }
            if (changes['geometry']) {
                this.drawGeometry();
            }
            if (changes['zoomTo']) {
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
        if (this.highlightGeometryOnMap) {
            this.map.removeLayer(this.highlightGeometryOnMap);
        }
        this.highlightGeometryOnMap = L.geoJSON(this.highlight, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, this.highlightStyle);
            }
        });
        this.highlightGeometryOnMap.setStyle(this.highlightStyle);
        this.highlightGeometryOnMap.addTo(this.map);
    }

    private drawGeometry() {
        if (this.geometry) {
            if (this.geometryOnMap) {
                this.map.removeLayer(this.geometryOnMap);
            }
            this.geometryOnMap = L.geoJSON(this.geometry, {
                pointToLayer: (feature, latlng) => {
                    if (this.customMarkerIcon) {
                        return L.marker(latlng, {icon: this.customMarkerIcon});
                    } else {
                        return L.circleMarker(latlng, this.defaultStyle);
                    }
                }
            });

            this.geometryOnMap.setStyle(this.defaultStyle);
            this.geometryOnMap.addTo(this.map);

            if (!this.avoidZoomToGeometry) {
                this.map.fitBounds(this.geometryOnMap.getBounds());
            }
        }
    }
}
