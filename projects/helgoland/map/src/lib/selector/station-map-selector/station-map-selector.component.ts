import 'leaflet.markercluster';

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    KeyValueDiffers,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    HasLoadableContent,
    Mixin,
    ParameterFilter,
    StatusIntervalResolverService,
    TimeseriesExtras,
    HelgolandServicesHandlerService,
    HelgolandStation,
    HelgolandTimeseries
} from '@helgoland/core';
import GeoJSON from 'geojson';
import * as L from 'leaflet';
import { Observable } from 'rxjs';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';
import { Layer } from 'leaflet';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'n52-station-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class StationMapSelectorComponent extends MapSelectorComponent<HelgolandStation> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean;

    @Input()
    public statusIntervals: boolean;

    /**
     * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
     */
    @Input()
    public ignoreStatusIntervalIfBeforeDuration = Infinity;

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        protected statusIntervalResolver: StatusIntervalResolverService,
        protected servicesHandler: HelgolandServicesHandlerService,
        protected mapCache: MapCache,
        protected kvDiffers: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, kvDiffers, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map && changes.statusIntervals) { this.drawGeometries(); }
    }

    protected drawGeometries() {
        this.isContentLoading(true);
        if (this.map && this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        if (this.statusIntervals && this.filter && this.filter.phenomenon) {
            this.createValuedMarkers();
        } else {
            this.createStationGeometries();
        }
    }

    private createValuedMarkers() {
        const tempFilter: ParameterFilter = {
            phenomenon: this.filter.phenomenon,
            expanded: true
        };
        this.servicesHandler.getDatasets(this.serviceUrl, tempFilter).subscribe(datasets => {
            this.markerFeatureGroup = L.featureGroup();
            const obsList: Array<Observable<TimeseriesExtras>> = [];
            datasets.forEach((ts: HelgolandTimeseries) => {
                const obs = this.servicesHandler.getDatasetExtras(ts.internalId);
                obsList.push(obs);
                obs.subscribe((extras: TimeseriesExtras) => {
                    let marker;
                    if (extras.statusIntervals) {
                        if ((ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
                            const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
                            if (interval) { marker = this.createColoredMarker(ts.station, interval.color); }
                        }
                    }
                    if (!marker) { marker = this.createDefaultColoredMarker(ts.station); }
                    marker.on('click', () => {
                        this.onSelected.emit(ts.station);
                    });
                    this.markerFeatureGroup.addLayer(marker);
                });
            });

            forkJoin(obsList).subscribe(() => {
                this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
                if (this.map) { this.map.invalidateSize(); }
                this.isContentLoading(false);
            });

            if (this.map) { this.markerFeatureGroup.addTo(this.map); }
        });
    }

    private createColoredMarker(station: HelgolandStation, color: string): Layer {
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createFilledMarker) {
            return this.markerSelectorGenerator.createFilledMarker(station, color);
        }
        return this.createFilledMarker(station, color, 10);
    }

    private createDefaultColoredMarker(station: HelgolandStation): Layer {
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createDefaultFilledMarker) {
            return this.markerSelectorGenerator.createDefaultFilledMarker(station);
        }
        return this.createFilledMarker(station, '#000', 10);
    }

    private createFilledMarker(station: HelgolandStation, color: string, radius: number): Layer {
        let geometry: Layer;
        if (station.geometry.type === 'Point') {
            const point = station.geometry as GeoJSON.Point;
            geometry = L.circleMarker([point.coordinates[1], point.coordinates[0]], {
                color: '#000',
                fillColor: color,
                fillOpacity: 0.8,
                radius: 10,
                weight: 2
            });
        } else {
            geometry = L.geoJSON(station.geometry, {
                style: (feature) => {
                    return {
                        color: '#000',
                        fillColor: color,
                        fillOpacity: 0.8,
                        weight: 2
                    };
                }
            });
        }
        if (geometry) {
            geometry.on('click', () => {
                this.onSelected.emit(station);
            });
            return geometry;
        }
    }

    private createStationGeometries() {
        this.servicesHandler.getStations(this.serviceUrl, this.filter)
            .subscribe((res) => {
                if (this.cluster) {
                    this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
                } else {
                    this.markerFeatureGroup = L.featureGroup();
                }
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = this.createDefaultGeometry(entry);
                        if (marker) { this.markerFeatureGroup.addLayer(marker); }
                    });
                    this.markerFeatureGroup.addTo(this.map);
                    this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
                } else {
                    this.onNoResultsFound.emit(true);
                }
                this.map.invalidateSize();
                this.isContentLoading(false);
            });
    }

    private createDefaultGeometry(station: HelgolandStation): Layer {
        let layer: Layer;
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createDefaultGeometry) {
            layer = this.markerSelectorGenerator.createDefaultGeometry(station);
        } else if (station.geometry) {
            layer = L.geoJSON(station.geometry);
        } else {
            console.error(station.id + ' has no geometry');
        }
        // register click event
        if (layer) { layer.on('click', () => this.onSelected.emit(station)); }
        return layer;
    }
}
