import * as L from 'leaflet';
import 'leaflet.markercluster';

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    KeyValueDiffers,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    HelgolandDataset,
    HelgolandLocatedProfileData,
    HelgolandProfile,
    HelgolandServicesConnector,
    LocatedProfileDataEntry,
    Timespan,
} from '@helgoland/core';

import { MapCache } from '../../base/map-cache.service';
import { MapSelectorComponent } from '../map-selector.component';
import { TrajectoryResult } from '../model/trajectory-result';

@Component({
    selector: 'n52-profile-trajectory-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss']
})
export class ProfileTrajectoryMapSelectorComponent
    extends MapSelectorComponent<TrajectoryResult>
    implements OnChanges, AfterViewInit {

    @Input()
    public selectedTimespan: Timespan;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onTimeListDetermined: EventEmitter<number[]> = new EventEmitter();

    private layer: L.FeatureGroup;
    private data: LocatedProfileDataEntry[];
    private dataset: HelgolandDataset;

    private defaultStyle: L.PathOptions = {
        color: 'red',
        weight: 5,
        opacity: 0.65
    };

    private highlightStyle: L.PathOptions = {
        color: 'blue',
        weight: 7,
        opacity: 1
    };

    constructor(
        protected servicesConnector: HelgolandServicesConnector,
        protected mapCache: MapCache,
        protected kvDiffers: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, kvDiffers, cd);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.selectedTimespan && this.selectedTimespan && this.map) {
            this.clearMap();
            this.initLayer();
            this.data.forEach((entry) => {
                if (this.selectedTimespan.from <= entry.timestamp && entry.timestamp <= this.selectedTimespan.to) {
                    this.layer.addLayer(this.createGeoJson(entry, this.dataset));
                }
            });
            this.layer.addTo(this.map);
        }
    }

    protected drawGeometries() {
        this.onContentLoading.emit(true);
        if (!this.serviceUrl) { return; }
        this.servicesConnector.getDatasets(this.serviceUrl, { ...this.filter, expanded: true }).subscribe((datasets) => {
            datasets.forEach((dataset) => {
                if (dataset instanceof HelgolandProfile) {
                    this.dataset = dataset;
                    const timespan = new Timespan(dataset.firstValue.timestamp, dataset.lastValue.timestamp);
                    this.servicesConnector.getDatasetData(dataset, timespan)
                        .subscribe((data: HelgolandLocatedProfileData) => {
                            if (this.map && data.values instanceof Array) {
                                this.initLayer();
                                this.data = [];
                                const timelist: number[] = [];
                                data.values.forEach((entry) => {
                                    this.data.push(entry);
                                    const geojson = this.createGeoJson(entry, dataset);
                                    timelist.push(entry.timestamp);
                                    this.layer.addLayer(geojson);
                                });
                                this.onTimeListDetermined.emit(timelist);
                                this.layer.addTo(this.map);
                                this.zoomToMarkerBounds(this.layer.getBounds());
                            }
                            this.onContentLoading.emit(false);
                        });
                }
            });
        });
    }

    private initLayer() {
        this.layer = L.markerClusterGroup({ animate: false });
    }

    private clearMap() {
        if (this.map && this.layer) {
            this.map.removeLayer(this.layer);
        }
    }

    private createGeoJson(profileDataEntry: LocatedProfileDataEntry, dataset: HelgolandDataset): L.GeoJSON {
        const geojson = new L.GeoJSON(profileDataEntry.geometry);
        geojson.setStyle(this.defaultStyle);
        geojson.on('click', () => {
            this.onSelected.emit({
                dataset,
                data: profileDataEntry
            });
        });
        geojson.on('mouseover', () => {
            geojson.setStyle(this.highlightStyle);
            geojson.bringToFront();
        });
        geojson.on('mouseout', () => {
            geojson.setStyle(this.defaultStyle);
        });
        return geojson;
    }
}
