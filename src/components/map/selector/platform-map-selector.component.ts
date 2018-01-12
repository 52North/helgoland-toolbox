import 'leaflet.markercluster';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import * as L from 'leaflet';

import { HasLoadableContent } from '../../../model/mixins/has-loadable-content';
import { Mixin } from '../../../model/mixins/Mixin.decorator';
import { Platform } from './../../../model/api/platform';
import { ApiInterface } from './../../../services/api-interface/api-interface';
import { MapCache } from './../../../services/map/map.service';
import { MapSelectorComponent } from './map-selector.component';

@Component({
    selector: 'n52-platform-map-selector',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class PlatformMapSelectorComponent extends MapSelectorComponent<Platform> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean;

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        private apiInterface: ApiInterface,
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, cd);
    }

    protected drawGeometries() {
        this.noResultsFound = false;
        this.isContentLoading(true);
        if (this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        this.apiInterface.getPlatforms(this.serviceUrl, this.filter)
            .subscribe((res) => {
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
                    this.noResultsFound = true;
                }
                this.map.invalidateSize();
                this.isContentLoading(false);
            });
    }
}
