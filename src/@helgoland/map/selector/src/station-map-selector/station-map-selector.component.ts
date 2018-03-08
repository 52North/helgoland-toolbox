import 'leaflet.markercluster';
import 'rxjs/add/observable/forkJoin';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, KeyValueDiffers } from '@angular/core';
import {
    ApiInterface,
    FirstLastValue,
    HasLoadableContent,
    Mixin,
    ParameterFilter,
    Station,
    StatusInterval,
    Timeseries,
    TimeseriesExtras,
} from '@helgoland/core';
import { MapCache } from '@helgoland/map';
import L from 'leaflet';
import { Observable } from 'rxjs/Observable';

import { MapSelectorComponent } from '../map-selector.component';

@Component({
    selector: 'n52-station-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class StationMapSelectorComponent extends MapSelectorComponent<Station> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean;

    @Input()
    public statusIntervals: boolean;

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        private apiInterface: ApiInterface,
        protected mapCache: MapCache,
        protected differs: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, differs, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map) {
            if (changes.statusIntervals) {
                this.drawGeometries();
            }
        }
    }

    protected drawGeometries() {
        this.noResultsFound = false;
        this.isContentLoading(true);
        if (this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        if (this.statusIntervals && this.filter && this.filter.phenomenon) {
            this.createValuedMarkers();
        } else {
            this.createStationMarkers();
        }
    }

    private createValuedMarkers() {
        const tempFilter: ParameterFilter = {
            phenomenon: this.filter.phenomenon,
            expanded: true
        };
        this.apiInterface.getTimeseries(this.serviceUrl, tempFilter).subscribe((timeseries: Timeseries[]) => {
            this.markerFeatureGroup = L.featureGroup();
            const obsList: Array<Observable<TimeseriesExtras>> = [];
            timeseries.forEach((ts: Timeseries) => {
                const obs = this.apiInterface.getTimeseriesExtras(ts.id, this.serviceUrl);
                obsList.push(obs);
                obs.subscribe((extras: TimeseriesExtras) => {
                    let marker;
                    if (extras.statusIntervals) {
                        const interval = this.getMatchingInterval(ts.lastValue, extras.statusIntervals);
                        if (interval) {
                            marker = this.createColoredMarker(ts.station, interval.color);
                        } else {
                            marker = this.createDefaultColoredMarker(ts.station);
                        }
                    } else {
                        marker = this.createDefaultColoredMarker(ts.station);
                    }
                    this.markerFeatureGroup.addLayer(marker);
                });
            });

            Observable.forkJoin(obsList).subscribe(() => {
                this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
                this.map.invalidateSize();
                this.isContentLoading(false);
            });

            this.markerFeatureGroup.addTo(this.map);
        });
    }

    private createColoredMarker(station: Station, color: string) {
        const marker = L.circleMarker([station.geometry.coordinates[1], station.geometry.coordinates[0]], {
            color: '#000',
            fillColor: color,
            fillOpacity: 0.8,
            radius: 10,
            weight: 2
        });
        marker.on('click', () => {
            this.onSelected.emit(station);
        });
        return marker;
    }

    private createDefaultColoredMarker(station: Station) {
        const marker = L.circleMarker([station.geometry.coordinates[1], station.geometry.coordinates[0]], {
            color: '#000',
            fillColor: '#000',
            fillOpacity: 0.8,
            radius: 5,
            weight: 2
        });
        marker.on('click', () => {
            this.onSelected.emit(station);
        });
        return marker;
    }

    private getMatchingInterval(lastValue: FirstLastValue, statusIntervals: StatusInterval[]): StatusInterval {
        if (lastValue && statusIntervals) {
            return statusIntervals.find((interval) => {
                const upper = interval.upper ? parseFloat(interval.upper) : Number.MAX_VALUE;
                const lower = interval.lower ? parseFloat(interval.lower) : Number.MIN_VALUE;
                if (lower < lastValue.value && lastValue.value < upper) { return true; }
            });
        }
    }

    private createStationMarkers() {
        this.apiInterface.getStations(this.serviceUrl, this.filter)
            .subscribe((res) => {
                if (this.cluster) {
                    this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
                } else {
                    this.markerFeatureGroup = L.featureGroup();
                }
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = this.createDefaultMarker(entry);
                        if (marker) { this.markerFeatureGroup.addLayer(marker); }
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

    private createDefaultMarker(entry: Station) {
        if (entry.geometry) {
            const marker = L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]]);
            marker.on('click', () => this.onSelected.emit(entry));
            return marker;
        } else {
            console.error(entry.id + ' has no geometry');
        }
    }
}
