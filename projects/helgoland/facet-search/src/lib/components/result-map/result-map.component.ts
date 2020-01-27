import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnDestroy, OnInit, Output } from '@angular/core';
import { Required, HelgolandPlatform, HelgolandTimeseries } from '@helgoland/core';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { geoJSON } from 'leaflet';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';

import { FacetSearch } from '../../facet-search-model';

delete L.Icon.Default.prototype['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: './assets/images/leaflet/marker-icon-2x.png',
  iconUrl: './assets/images/leaflet/marker-icon.png',
  shadowUrl: './assets/images/leaflet/marker-shadow.png',
});

@Component({
  selector: 'n52-result-map',
  templateUrl: './result-map.component.html',
  styleUrls: ['./result-map.component.scss'],
})
export class ResultMapComponent extends CachedMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() @Required public facetSearchService: FacetSearch;

  @Input() public cluster = true;

  @Input() public aggregateToStations = false;

  @Input() public selectSingleStation = false;

  @Output() public selected: EventEmitter<HelgolandTimeseries | { station: HelgolandPlatform, url: string }> = new EventEmitter();

  private markerFeatureGroup: L.FeatureGroup;
  private resultsSubs: Subscription;

  constructor(
    protected mapCache: MapCache,
    protected differs: KeyValueDiffers
  ) {
    super(mapCache, differs);
  }

  ngOnInit() {
    super.ngOnInit();
    this.resultsSubs = this.facetSearchService.getResults().subscribe(ts => this.fetchResults(ts));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.resultsSubs.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.createMap();
    const res = this.facetSearchService.getFilteredResults();
    if (res) {
      this.fetchResults(res);
    }
  }

  private fetchResults(ts: HelgolandTimeseries[]) {
    if (this.map) {
      if (this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
      if (this.cluster) {
        this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
      } else {
        this.markerFeatureGroup = L.featureGroup();
      }
      if (this.aggregateToStations) {
        const stations = new Map<string, { station: HelgolandPlatform, url: string }>();
        ts.forEach(e => {
          const id = `${e.platform.id}-${e.url}`;
          if (!stations.has(id)) {
            stations.set(id, { station: e.platform, url: e.url });
          }
        });
        stations.forEach(v => {
          const station = this.createStationGeometry(v.station, v.url);
          if (station) { this.markerFeatureGroup.addLayer(station); }
        });
        if (stations.size === 1 && this.selectSingleStation) {
          const entry = stations.get(stations.keys().next().value);
          this.selected.emit({ station: entry.station, url: entry.url });
        }
      } else {
        ts.forEach(e => {
          const marker = this.createTsGeometry(e);
          if (marker) { this.markerFeatureGroup.addLayer(marker); }
        });
      }
      this.markerFeatureGroup.addTo(this.map);

      const bounds = this.markerFeatureGroup.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds);
        this.map.invalidateSize();
      }
    }
  }

  private createStationGeometry(station: HelgolandPlatform, url: string): L.GeoJSON {
    if (station) {
      const geometry = geoJSON(station.geometry);
      geometry.on('click', () => this.selected.emit({ station, url }));
      return geometry;
    }
  }

  private createTsGeometry(ts: HelgolandTimeseries) {
    if (ts.platform) {
      const geometry = geoJSON(ts.platform.geometry);
      geometry.on('click', () => this.selected.emit(ts));
      return geometry;
    }
  }

}
