import { AfterViewInit, ChangeDetectorRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { HasLoadableContent } from '../../../model/mixins/has-loadable-content';
import { MapOptions } from '../model/map-options';
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
    public mapOptions: MapOptions;

    @Input()
    public cluster: boolean;

    @Output()
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    public noResultsFound: boolean;
    protected map: L.Map;

    constructor(
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit() {
        if (!this.mapOptions) {
            this.mapOptions = {};
        }

        if (!this.mapOptions.baseMaps || this.mapOptions.baseMaps.size === 0) {
            this.mapOptions.baseMaps = new Map();
            this.mapOptions.baseMaps.set('BaseLayer', L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }));
        }

        if (!this.mapOptions.overlayMaps) {
            this.mapOptions.overlayMaps = new Map();
        }

        // create map
        this.map = L.map(this.mapId, {
            zoomControl: false
        });
        // add base maps to map
        const base: L.Control.LayersObject = {};
        this.mapOptions.baseMaps.forEach((layer, key) => {
            base[key] = layer;
            layer.addTo(this.map);
        });
        // add overlay maps to map
        const overlays: L.Control.LayersObject = {};
        this.mapOptions.overlayMaps.forEach((layer, key) => {
            overlays[key] = layer;
            layer.addTo(this.map);
        });

        if (this.mapOptions.layerControlOptions
            && (this.mapOptions.baseMaps.size > 1 || this.mapOptions.overlayMaps.size > 0)) {
            L.control.layers(base, overlays, this.mapOptions.layerControlOptions).addTo(this.map);
        }

        if (this.mapOptions.zoomOptions) {
            L.control.zoom(this.mapOptions.zoomOptions).addTo(this.map);
        }

        this.mapCache.setMap(this.mapId, this.map);
        setTimeout(() => {
            this.drawGeometries();
            this.cd.detectChanges();
        }, 10);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ((changes.serviceUrl || changes.filter) && this.map) {
            this.drawGeometries();
        }
    }

    protected abstract drawGeometries(): void;
}
