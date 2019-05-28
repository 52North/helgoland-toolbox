import 'leaflet.markercluster';

import { AfterViewInit, ChangeDetectorRef, Component, Input, KeyValueDiffers, OnChanges } from '@angular/core';
import { DatasetApiInterface, HasLoadableContent, Mixin, Platform } from '@helgoland/core';
import * as L from 'leaflet';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';

@Component({
    selector: 'n52-platform-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class PlatformMapSelectorComponent extends MapSelectorComponent<Platform> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean;

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        protected apiInterface: DatasetApiInterface,
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef,
        protected kvDiffers: KeyValueDiffers
    ) {
        super(mapCache, kvDiffers, cd);
    }

    protected drawGeometries() {
        this.isContentLoading(true);
        if (this.map && this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        this.apiInterface.getPlatforms(this.serviceUrl, this.filter)
            .subscribe((res) => {
                if (this.map) {
                    if (this.cluster) {
                        this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
                    } else {
                        this.markerFeatureGroup = L.featureGroup();
                    }
                    if (res instanceof Array && res.length > 0) {
                        res.forEach((entry) => {
                            const marker = L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]]);
                            marker.on('click', () => {
                                this.onSelected.emit(entry);
                            });
                            this.markerFeatureGroup.addLayer(marker);
                        });
                        this.markerFeatureGroup.addTo(this.map);
                        this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
                    } else {
                        this.onNoResultsFound.emit(true);
                    }
                    this.map.invalidateSize();
                    this.isContentLoading(false);
                }
            });
    }
}
