import { AfterViewInit, ChangeDetectorRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { HasLoadableContent } from '../../../model/mixins/has-loadable-content';
import { LayerOptions } from '../index';
import { ParameterFilter } from './../../../model/api/parameterFilter';
import { MapCache } from './../../../services/map/map.service';

export abstract class MapSelectorComponent<T> implements OnChanges, AfterViewInit, HasLoadableContent {

    @Input()
    public mapId: string;

    @Input()
    public serviceUrl: string;

    @Input()
    public filter: ParameterFilter;

    @Input()
    public fitBounds: L.LatLngBoundsExpression;

    @Input()
    public zoomControlOptions: L.Control.ZoomOptions;

    @Input()
    public avoidZoomToSelection: boolean;

    @Input()
    public baseMaps: Map<LayerOptions, L.Layer>;

    @Input()
    public overlayMaps: Map<LayerOptions, L.Layer>;

    @Input()
    public layerControlOptions: L.Control.LayersOptions;

    @Output()
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    public noResultsFound: boolean;
    protected map: L.Map;
    protected oldBaseLayer: L.Control.LayersObject = {};
    protected oldOverlayLayer: L.Control.LayersObject = {};
    protected layerControl: L.Control.Layers;
    protected zoomControl: L.Control.Zoom;

    constructor(
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit() {

        // create map
        this.map = L.map(this.mapId, {
            zoomControl: false
        });
        if (this.fitBounds) {
            this.map.fitBounds(this.fitBounds);
        }
        // add base maps to map
        this.addBaseMapsToMap();
        this.addOverlayMapsToMap();

        this.updateZoomControl();

        this.mapCache.setMap(this.mapId, this.map);
        setTimeout(() => {
            this.drawGeometries();
            this.cd.detectChanges();
        }, 10);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.map) {
            if (changes.serviceUrl || changes.filter || changes.cluster) {
                this.drawGeometries();
            }
            if (changes.baseMaps) {
                this.addBaseMapsToMap();
            }
            if (changes.overlayMaps) {
                this.addOverlayMapsToMap();
            }
            if (changes.zoomControlOptions) {
                this.updateZoomControl();
            }
            if (changes.fitBounds) {
                this.map.fitBounds(this.fitBounds);
            }
        }
    }

    protected abstract drawGeometries(): void;

    protected zoomToMarkerBounds(bounds: L.LatLngBoundsExpression) {
        if (!this.avoidZoomToSelection) {
            this.map.fitBounds(bounds);
        }
    }

    private addBaseMapsToMap() {
        if (!this.baseMaps || this.baseMaps.size === 0) {
            this.baseMaps = new Map();
            this.baseMaps.set(
                { name: 'BaseLayer', visible: true },
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            );
        }
        for (const key in this.oldBaseLayer) {
            if (this.oldBaseLayer.hasOwnProperty(key)) {
                const layer = this.oldBaseLayer[key];
                this.map.removeLayer(layer);
            }
        }
        this.oldBaseLayer = {};
        this.baseMaps.forEach((layer, key) => {
            this.oldBaseLayer[key.name] = layer;
            if (key.visible) {
                layer.addTo(this.map);
            }
        });
        this.updateLayerControl();
    }

    private addOverlayMapsToMap() {
        if (!this.overlayMaps) {
            this.overlayMaps = new Map();
        }
        for (const key in this.oldOverlayLayer) {
            if (this.oldOverlayLayer.hasOwnProperty(key)) {
                const layer = this.oldOverlayLayer[key];
                this.map.removeLayer(layer);
            }
        }
        this.oldOverlayLayer = {};
        if (this.overlayMaps) {
            this.overlayMaps.forEach((layer, key) => {
                this.oldOverlayLayer[key.name] = layer;
                if (key.visible) {
                    layer.addTo(this.map);
                }
            });
        }
        this.updateLayerControl();
    }

    private updateZoomControl() {
        if (this.zoomControl) { this.map.removeControl(this.zoomControl); }
        if (this.zoomControlOptions) {
            this.zoomControl = L.control.zoom(this.zoomControlOptions).addTo(this.map);
        }
    }

    private updateLayerControl() {
        if (this.layerControl) {
            this.map.removeControl(this.layerControl);
        }
        if (this.layerControlOptions
            && (this.baseMaps.size > 1 || this.overlayMaps.size > 0)) {
            this.layerControl =
                L.control.layers(this.oldBaseLayer, this.oldOverlayLayer, this.layerControlOptions).addTo(this.map);
        }
    }

}
