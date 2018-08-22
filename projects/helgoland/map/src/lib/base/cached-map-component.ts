import { DoCheck, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { MapCache } from './map-cache.service';
import { LayerOptions } from './map-options';

const DEFAULT_BASE_LAYER_NAME = 'BaseLayer';
const DEFAULT_BASE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_BASE_LAYER_ATTRIBUTION = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

export abstract class CachedMapComponent implements OnChanges, DoCheck, OnDestroy, OnInit {

    /**
     * A map with the given ID is created inside this component. This ID can be used the get the map instance over the map cache service.
     */
    @Input()
    public mapId: string;

    /**
     * The corresponding leaflet map options (see: https://leafletjs.com/reference-1.3.4.html#map-option)
     */
    @Input()
    public mapOptions: L.MapOptions;

    /**
     * Bounds for the map
     */
    @Input()
    public fitBounds: L.LatLngBoundsExpression;

    /**
     * Map, which holds all overlay map layer (see: https://leafletjs.com/reference-1.3.4.html#layer)
     */
    @Input()
    public overlayMaps: Map<string, LayerOptions>;

    /**
     * Map, which holds all base map layer (see: https://leafletjs.com/reference-1.3.4.html#layer)
     */
    @Input()
    public baseMaps: Map<string, LayerOptions>;

    /**
     * Describes the the zoom options (see: https://leafletjs.com/reference-1.3.4.html#control-layers)
     */
    @Input()
    public layerControlOptions: L.Control.LayersOptions;

    /**
     * Describes the the zoom control options (see: https://leafletjs.com/reference-1.3.4.html#control-zoom)
     */
    @Input()
    public zoomControlOptions: L.Control.ZoomOptions;

    /**
     * The map object.
     */
    protected map: L.Map;

    protected oldOverlayLayer: L.Control.LayersObject = {};
    protected oldBaseLayer: L.Control.LayersObject = {};
    protected layerControl: L.Control.Layers;
    protected zoomControl: L.Control.Zoom;

    private _overlayMaps: Map<string, LayerOptions>;
    private _differOverlayMaps: KeyValueDiffer<string, LayerOptions>;
    private _baseMaps: Map<string, LayerOptions>;
    private _differBaseMaps: KeyValueDiffer<string, LayerOptions>;

    constructor(
        protected mapCache: MapCache,
        protected differs: KeyValueDiffers
    ) {
        this._differOverlayMaps = this.differs.find({}).create();
        this._differBaseMaps = this.differs.find({}).create();
    }

    public ngOnInit(): void {
        if (this.mapId === undefined || this.mapId === null) {
            this.mapId = this.generateUUID();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.map) {
            if (changes.fitBounds) {
                this.map.fitBounds(this.fitBounds);
            }
            if (changes.zoomControlOptions) {
                this.updateZoomControl();
            }
        }
    }

    public ngDoCheck(): void {
        if (this._differOverlayMaps) {
            const changes = this._differOverlayMaps.diff(this.overlayMaps);
            if (changes) {
                changes.forEachRemovedItem((e) => this.removeOverlayMap(e.previousValue));
                changes.forEachAddedItem((e) => this.addOverlayMap(e.currentValue));
                this.updateLayerControl();
            }
        }
        if (this._differBaseMaps) {
            const changes = this._differBaseMaps.diff(this.baseMaps);
            if (changes) {
                changes.forEachRemovedItem((e) => this.removeBaseMap(e.previousValue));
                changes.forEachAddedItem((e) => this.addBaseMap(e.currentValue));
                this.updateLayerControl();
            }
        }
    }

    public ngOnDestroy(): void {
        this.map.remove();
    }

    protected createMap(): void {
        if (!this.mapOptions || this.zoomControlOptions) { this.mapOptions = { zoomControl: false }; }
        this.map = L.map(this.mapId, this.mapOptions);
        this.mapCache.setMap(this.mapId, this.map);
        if (this.baseMaps && this.baseMaps.size > 0) {
            this.baseMaps.forEach((entry, key) => this.addBaseMap(entry));
        } else {
            this.addBaseMap();
        }
        if (this.overlayMaps) { this.overlayMaps.forEach((entry, key) => this.addOverlayMap(entry)); }
        this.updateZoomControl();
        this.updateLayerControl();
        if (this.fitBounds) {
            this.map.fitBounds(this.fitBounds);
        }
    }

    private generateUUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    private addOverlayMap(layerOptions: LayerOptions) {
        if (this.map) {
            if (!this.oldOverlayLayer.hasOwnProperty[layerOptions.label]) {
                this.oldOverlayLayer[layerOptions.label] = layerOptions.layer;
                if (layerOptions.visible) { layerOptions.layer.addTo(this.map); }
            }
        }
    }

    private removeOverlayMap(layerOptions: LayerOptions) {
        if (this.oldOverlayLayer.hasOwnProperty(layerOptions.label)) {
            this.map.removeLayer(this.oldOverlayLayer[layerOptions.label]);
            delete this.oldOverlayLayer[layerOptions.label];
        }
    }

    private addBaseMap(layerOptions?: LayerOptions) {
        if (this.map) {
            if (!this.baseMaps || this.baseMaps.size === 0) {
                layerOptions = {
                    label: DEFAULT_BASE_LAYER_NAME,
                    visible: true,
                    layer: L.tileLayer(DEFAULT_BASE_LAYER_URL, {
                        attribution: DEFAULT_BASE_LAYER_ATTRIBUTION
                    })
                };
            }
            if (!this.oldBaseLayer.hasOwnProperty[layerOptions.label]) {
                this.oldBaseLayer[layerOptions.label] = layerOptions.layer;
                if (layerOptions.visible) { layerOptions.layer.addTo(this.map); }
            }
        }
    }

    private removeBaseMap(layerOptions: LayerOptions) {
        if (this.oldBaseLayer.hasOwnProperty(layerOptions.label)) {
            this.map.removeLayer(this.oldBaseLayer[layerOptions.label]);
            delete this.oldBaseLayer[layerOptions.label];
        }
    }

    private updateLayerControl() {
        if (this.map) {
            if (this.layerControl) {
                this.map.removeControl(this.layerControl);
            }
            if (this.layerControlOptions
                && (Object.keys(this.oldBaseLayer).length > 1 || Object.keys(this.oldOverlayLayer).length > 0)) {
                this.layerControl =
                    L.control.layers(this.oldBaseLayer, this.oldOverlayLayer, this.layerControlOptions).addTo(this.map);
            }
        }
    }

    private updateZoomControl() {
        if (this.zoomControl) { this.map.removeControl(this.zoomControl); }
        if (this.zoomControlOptions) {
            this.zoomControl = L.control.zoom(this.zoomControlOptions).addTo(this.map);
        }
    }
}
