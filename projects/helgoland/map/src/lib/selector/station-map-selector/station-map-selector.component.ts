import 'leaflet.markercluster';
import 'rxjs/add/observable/forkJoin';

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
    DatasetApiInterface,
    HasLoadableContent,
    Mixin,
    ParameterFilter,
    Station,
    StatusIntervalResolverService,
    Timeseries,
    TimeseriesExtras,
} from '@helgoland/core';
import GeoJSON from 'geojson';
import * as L from 'leaflet';
import { Observable } from 'rxjs/Observable';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';
import { Layer } from 'leaflet';

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
        protected statusIntervalResolver: StatusIntervalResolverService,
        protected apiInterface: DatasetApiInterface,
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
        this.apiInterface.getTimeseries(this.serviceUrl, tempFilter).subscribe((timeseries: Timeseries[]) => {
            this.markerFeatureGroup = L.featureGroup();
            const obsList: Array<Observable<TimeseriesExtras>> = [];
            timeseries.forEach((ts: Timeseries) => {
                const obs = this.apiInterface.getTimeseriesExtras(ts.id, this.serviceUrl);
                obsList.push(obs);
                obs.subscribe((extras: TimeseriesExtras) => {
                    let marker;
                    if (extras.statusIntervals) {
                        const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
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
                if (this.map) { this.map.invalidateSize(); }
                this.isContentLoading(false);
            });

            if (this.map) { this.markerFeatureGroup.addTo(this.map); }
        });
    }

    private createColoredMarker(station: Station, color: string): Layer {
        return this.createFilledMarker(station, color, 10);
    }

    private createDefaultColoredMarker(station: Station): Layer {
        return this.createFilledMarker(station, '#000', 10);
    }

    private createFilledMarker(station: Station, color: string, radius: number): Layer {
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
        this.apiInterface.getStations(this.serviceUrl, this.filter)
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

    private createDefaultGeometry(station: Station) {
        if (station.geometry) {
            const geometry = L.geoJSON(station.geometry);
            geometry.on('click', () => this.onSelected.emit(station));
            return geometry;
        } else {
            console.error(station.id + ' has no geometry');
        }
    }
}
