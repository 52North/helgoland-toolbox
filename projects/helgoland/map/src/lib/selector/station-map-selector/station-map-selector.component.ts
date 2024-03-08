import * as L from 'leaflet';
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
    StatusIntervalResolverService,
    TimeseriesExtras,
    HelgolandServicesConnector,
    HelgolandTimeseries,
    HelgolandPlatform,
    DatasetType
} from '@helgoland/core';
import GeoJSON from 'geojson';
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
export class StationMapSelectorComponent extends MapSelectorComponent<HelgolandPlatform> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean | undefined;

    @Input()
    public clusterConfig: L.MarkerClusterGroupOptions | undefined;

    @Input()
    public statusIntervals: boolean | undefined;

    /**
     * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
     */
    @Input()
    public ignoreStatusIntervalIfBeforeDuration = Infinity;

    protected markerFeatureGroup: L.FeatureGroup | undefined;

    constructor(
        protected statusIntervalResolver: StatusIntervalResolverService,
        protected servicesConnector: HelgolandServicesConnector,
        protected override mapCache: MapCache,
        protected override kvDiffers: KeyValueDiffers,
        protected override cd: ChangeDetectorRef
    ) {
        super(mapCache, kvDiffers, cd);
    }

    public override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map && this.serviceUrl && changes['statusIntervals']) { this.drawGeometries(this.map, this.serviceUrl); }
    }

    protected drawGeometries(map: L.Map, serviceUrl: string) {
        this.onContentLoading.emit(true);
        if (this.markerFeatureGroup) { map.removeLayer(this.markerFeatureGroup); }
        if (this.statusIntervals && this.filter && this.filter.phenomenon) {
            this.createValuedMarkers(serviceUrl, map);
        } else {
            this.createStationGeometries(serviceUrl, map);
        }
    }

    protected createValuedMarkers(serviceUrl: string, map: L.Map) {
        this.servicesConnector.getDatasets(serviceUrl, {
            phenomenon: this.filter?.phenomenon,
            expanded: true,
            type: DatasetType.Timeseries
        }).subscribe(
            (datasets: HelgolandTimeseries[]) => {
                this.markerFeatureGroup = L.featureGroup();
                const obsList: Array<Observable<TimeseriesExtras>> = [];
                datasets.forEach((ts: HelgolandTimeseries) => {
                    const obs = this.servicesConnector.getDatasetExtras(ts.internalId);
                    obsList.push(obs);
                    obs.subscribe((extras: TimeseriesExtras) => {
                        let marker;
                        if (extras.statusIntervals) {
                            if (ts.lastValue?.timestamp && (ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
                                const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
                                if (interval) { marker = this.createColoredMarker(ts.platform, interval.color); }
                            }
                        }
                        if (!marker) { marker = this.createDefaultColoredMarker(ts.platform); }
                        marker.on('click', () => {
                            this.onSelected.emit(ts.platform);
                        });
                        this.markerFeatureGroup!.addLayer(marker);
                    });
                });

                forkJoin(obsList).subscribe(() => {
                    this.zoomToMarkerBounds(this.markerFeatureGroup!.getBounds(), map);
                    map.invalidateSize()
                    this.onContentLoading.emit(false);
                });

                this.markerFeatureGroup.addTo(map)
            },
            error => console.error(error)
        );
    }

    protected createColoredMarker(station: HelgolandPlatform, color: string): Layer {
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createFilledMarker) {
            return this.markerSelectorGenerator.createFilledMarker(station, color);
        }
        return this.createFilledMarker(station, color, 10);
    }

    protected createDefaultColoredMarker(station: HelgolandPlatform): Layer {
        if (this.markerSelectorGenerator && this.markerSelectorGenerator.createDefaultFilledMarker) {
            return this.markerSelectorGenerator.createDefaultFilledMarker(station);
        }
        return this.createFilledMarker(station, '#000', 10);
    }

    protected createFilledMarker(station: HelgolandPlatform, color: string, radius: number): Layer {
        let geometry: Layer;
        if (station.geometry?.type === 'Point') {
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
                style: (feature) => ({
                    color: '#000',
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: 2
                })
            });
        }
        if (geometry) {
            geometry.on('click', () => this.onSelected.emit(station));
            return geometry;
        }
        throw new Error('Could not create geometry');
    }

    protected createStationGeometries(serviceUrl: string, map: L.Map) {
        this.servicesConnector.getPlatforms(serviceUrl, this.filter)
            .subscribe({
                next: (res) => {
                    if (this.cluster) {
                        this.markerFeatureGroup = L.markerClusterGroup({ animate: true, ...this.clusterConfig });
                    } else {
                        this.markerFeatureGroup = L.featureGroup();
                    }
                    if (res instanceof Array && res.length > 0) {
                        res.forEach((entry) => {
                            const marker = this.createDefaultGeometry(entry);
                            if (marker) { this.markerFeatureGroup!.addLayer(marker); }
                        });
                        this.markerFeatureGroup.addTo(map);
                        this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds(), map);
                    } else {
                        this.onNoResultsFound.emit(true);
                    }
                    map.invalidateSize();
                    this.onContentLoading.emit(false);
                },
                error: (error) => {
                    map.setView([0, 0], 1);
                    this.onContentLoading.emit(false);
                }
            });
    }

    protected createDefaultGeometry(station: HelgolandPlatform): Layer | undefined {
        let layer: Layer | undefined = undefined;
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
