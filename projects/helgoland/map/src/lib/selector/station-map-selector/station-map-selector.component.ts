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
    EventEmitter,
    Output
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
import { forkJoin, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LastValueLabelGenerator } from '../services/last-value-label-generator.interface';

export const enum LastValuePresentation {
    None,
    Colorized,
    Textual,
}

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

    @Input()
    public lastValueSeriesIDs: string[];

    @Input()
    public lastValuePresentation: LastValuePresentation = LastValuePresentation.Colorized;

    /**
     * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
     */
    @Input()
    public ignoreStatusIntervalIfBeforeDuration = Infinity;

    @Output()
    public onSelectedTimeseries: EventEmitter<Timeseries> = new EventEmitter();

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        protected statusIntervalResolver: StatusIntervalResolverService,
        protected apiInterface: DatasetApiInterface,
        protected mapCache: MapCache,
        protected differs: KeyValueDiffers,
        protected cd: ChangeDetectorRef,
        protected lastValueLabelGenerator: LastValueLabelGenerator
    ) {
        super(mapCache, differs, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map && changes.statusIntervals) { this.drawGeometries(); }
    }

    protected drawGeometries() {
        this.isContentLoading(true);
        if (this.map && this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        if (this.statusIntervals && this.filter && this.filter.phenomenon) {
            this.createPhenomenonMarkers();
        } else if (this.lastValueSeriesIDs && this.lastValueSeriesIDs.length) {
            this.createMarkersBySeriesIDs();
        } else {
            this.createStationGeometries();
        }
    }

    private createPhenomenonMarkers() {
        const tempFilter: ParameterFilter = {
            phenomenon: this.filter.phenomenon,
            expanded: true
        };
        this.apiInterface.getTimeseries(this.serviceUrl, tempFilter).subscribe((timeseries: Timeseries[]) => {
            this.markerFeatureGroup = L.featureGroup();
            const obsList: Array<Observable<Layer>> = [];
            timeseries.forEach((ts: Timeseries) => {
                obsList.push(this.createMarker(ts).pipe(tap(m => this.markerFeatureGroup.addLayer(m))));
            });
            this.finalizeMarkerObservables(obsList);
        });
    }

    private createMarkersBySeriesIDs() {
        this.markerFeatureGroup = L.featureGroup();
        const obsList: Array<Observable<Timeseries>> = [];
        this.lastValueSeriesIDs.forEach(entry => {
            obsList.push(this.apiInterface.getSingleTimeseriesByInternalId(entry).pipe(tap(ts => {
                this.createMarker(ts).subscribe(m => {
                    this.markerFeatureGroup.addLayer(m);
                    m.on('click', () => this.onSelectedTimeseries.emit(ts));
                });
            })));
        });
        this.finalizeMarkerObservables(obsList);
    }

    private createMarker(ts: Timeseries) {
        switch (this.lastValuePresentation) {
            case LastValuePresentation.Colorized:
                return this.createColorizedMarker(ts);
            case LastValuePresentation.Textual:
                return this.createLabeledMarker(ts);
            default:
                break;
        }
    }

    private finalizeMarkerObservables(obsList: Observable<any>[]) {
        forkJoin(obsList).subscribe(() => {
            this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
            if (this.map) {
                this.map.invalidateSize();
            }
            this.isContentLoading(false);
        });
        if (this.map) {
            this.markerFeatureGroup.addTo(this.map);
        }
    }

    private createColorizedMarker(ts: Timeseries): Observable<Layer> {
        return new Observable<Layer>((observer: Observer<Layer>) => {
            this.apiInterface.getTimeseriesExtras(ts.id, this.serviceUrl).subscribe((extras: TimeseriesExtras) => {
                let marker;
                if (extras.statusIntervals) {
                    if ((ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
                        const interval = this.statusIntervalResolver.getMatchingInterval(ts.lastValue.value, extras.statusIntervals);
                        if (interval) {
                            marker = this.createColoredMarker(ts.station, interval.color);
                        }
                    }
                }
                if (!marker) {
                    marker = this.createDefaultColoredMarker(ts.station);
                }
                observer.next(marker);
                observer.complete();
            });
        });
    }

    private createLabeledMarker(ts: Timeseries): Observable<Layer> {
        return new Observable<Layer>(observer => {
            const icon = this.lastValueLabelGenerator.createIconLabel(ts);
            if (ts.station.geometry.type === 'Point') {
                const point = ts.station.geometry as GeoJSON.Point;
                observer.next(L.marker([point.coordinates[1], point.coordinates[0]], { icon }));
                observer.complete();
            }
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
                style: () => {
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
