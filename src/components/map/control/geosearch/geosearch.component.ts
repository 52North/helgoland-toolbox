import { Component, Input } from '@angular/core';
import * as L from 'leaflet';

import { GeoSearch, GeoSearchResult } from '../../../../services/geosearch/geosearch';
import { MapCache } from './../../../../services/map/map.service';

@Component({
    selector: 'n52-geosearch-control',
    templateUrl: './geosearch.component.html'
})
export class GeosearchControlComponent {

    @Input()
    public mapId: string;

    public result: GeoSearchResult;

    public resultGeometry: L.GeoJSON;

    public searchTerm: string;

    public loading: boolean;

    constructor(
        private mapCache: MapCache,
        private geosearch: GeoSearch
    ) { }

    public triggerSearch() {
        this.removeOldGeometry();
        if (this.searchTerm) {
            this.loading = true;
            this.geosearch.searchTerm(this.searchTerm).subscribe((result) => {
                this.result = result;
                this.resultGeometry = L.geoJSON(result.geometry).addTo(this.mapCache.getMap(this.mapId));
                if (result.bounds) {
                    this.mapCache.getMap(this.mapId).fitBounds(result.bounds);
                } else {
                    this.mapCache.getMap(this.mapId).fitBounds(this.resultGeometry.getBounds());
                }
                this.loading = false;
            });
        }
    }

    public clearSearch() {
        this.searchTerm = '';
        this.removeOldGeometry();
    }

    private removeOldGeometry() {
        if (this.resultGeometry) {
            this.resultGeometry.remove();
        }
    }

}
