import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet';

import { GeoSearch, GeoSearchOptions, GeoSearchResult } from '../../base/geosearch/geosearch';
import { MapCache } from '../../base/map-cache.service';

@Component({
    selector: 'n52-geosearch-control',
    templateUrl: './geosearch.component.html'
})
export class GeosearchControlComponent {

    @Input()
    public mapId: string;

    @Input()
    public options: GeoSearchOptions;

    @Output()
    public onResultChanged: EventEmitter<GeoSearchResult> = new EventEmitter<GeoSearchResult>();

    public result: GeoSearchResult;

    public resultGeometry: L.GeoJSON;

    public searchTerm: string;

    public loading: boolean;

    constructor(
        protected mapCache: MapCache,
        protected geosearch: GeoSearch
    ) { }

    public triggerSearch() {
        this.removeOldGeometry();
        if (this.searchTerm) {
            this.loading = true;
            this.geosearch.searchTerm(this.searchTerm, this.options).subscribe(
                (result) => {
                    if (!result) {
                        this.searchTerm = '';
                        return;
                    }
                    this.onResultChanged.emit(result);
                    this.result = result;
                    if (this.mapId) {
                        this.resultGeometry = L.geoJSON(result.geometry).addTo(this.mapCache.getMap(this.mapId));
                        if (result.bounds) {
                            this.mapCache.getMap(this.mapId).fitBounds(result.bounds);
                        } else {
                            this.mapCache.getMap(this.mapId).fitBounds(this.resultGeometry.getBounds());
                        }
                    }
                },
                (error) => this.searchTerm = 'error occurred',
                () => { this.loading = false; }
            );
        }
    }

    public clearSearch() {
        this.searchTerm = '';
        this.onResultChanged.emit(null);
        this.removeOldGeometry();
    }

    private removeOldGeometry() {
        if (this.resultGeometry) {
            this.resultGeometry.remove();
        }
    }

}
