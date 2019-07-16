import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output } from '@angular/core';
import { Required, Timeseries } from '@helgoland/core';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { geoJSON } from 'leaflet';
import * as L from 'leaflet';

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
  styleUrls: ['./result-map.component.scss']
})
export class ResultMapComponent extends CachedMapComponent implements OnInit, AfterViewInit {

  @Input() @Required public facetSearchService: FacetSearch;

  @Input() public cluster = true;

  @Output() public selected: EventEmitter<Timeseries> = new EventEmitter();

  private markerFeatureGroup: L.FeatureGroup;

  constructor(
    protected mapCache: MapCache,
    protected differs: KeyValueDiffers
  ) {
    super(mapCache, differs);
  }

  ngOnInit() {
    super.ngOnInit();
    this.facetSearchService.onResultsChanged.subscribe(ts => this.fetchResults(ts));
  }

  ngAfterViewInit(): void {
    this.createMap();
    const res = this.facetSearchService.getFilteredResults();
    if (res) {
      this.fetchResults(res);
    }
  }

  private fetchResults(ts: Timeseries[]) {
    if (this.map && this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
    if (this.cluster) {
      this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
    } else {
      this.markerFeatureGroup = L.featureGroup();
    }
    ts.forEach(e => {
      const marker = this.createDefaultGeometry(e);
      if (marker) { this.markerFeatureGroup.addLayer(marker); }
    });
    this.markerFeatureGroup.addTo(this.map);
    this.map.fitBounds(this.markerFeatureGroup.getBounds());
    this.map.invalidateSize();
  }

  private createDefaultGeometry(ts: Timeseries) {
    if (ts.station) {
      const geometry = geoJSON(ts.station.geometry);
      geometry.on('click', () => this.selected.emit(ts));
      return geometry;
    }
  }

}
