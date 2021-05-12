import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnDestroy, OnInit, Output, ElementRef } from '@angular/core';
import { Required } from '@helgoland/core';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { geoJSON } from 'leaflet';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';

import { FacetSearchElement, FacetSearchElementFeature, FacetSearchService } from '../../facet-search-model';

delete (L.Icon.Default as any).prototype['_getIconUrl'];
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

  @Input() @Required public facetSearchService: FacetSearchService;

  @Input() public cluster = true;

  @Input() public aggregateToStations = false;

  @Input() public selectSingleStation = false;

  @Input() public autoZoomToResults = true;

  @Input() public nextResultsZoom = true;

  @Output() public selectedFeature: EventEmitter<{ feature: FacetSearchElementFeature, url: string }> = new EventEmitter();

  @Output() public selectedEntry: EventEmitter<FacetSearchElement> = new EventEmitter();

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

  private fetchResults(entries: FacetSearchElement[]) {
    if (this.map) {
      if (this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
      if (this.cluster) {
        this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
      } else {
        this.markerFeatureGroup = L.featureGroup();
      }
      if (this.aggregateToStations) {
        const features = new Map<string, {feature: FacetSearchElementFeature, url: string}>();
        entries.forEach(e => {
          if (e.feature) {
            const id = `${e.feature.id}-${e.url}`;
            if (!features.has(id)) {
              features.set(id, {feature: e.feature, url: e.url});
            }
          }
        });
        features.forEach(v => {
          const geom = this.createFeatureGeometry(v);
          if (geom) { this.markerFeatureGroup.addLayer(geom); }
        });
        if (features.size === 1 && this.selectSingleStation) {
          const entry = features.get(features.keys().next().value);
          this.selectedFeature.emit(entry);
        }
      } else {
        entries.forEach(e => {
          const marker = this.createEntryGeometry(e.feature);
          if (marker) { this.markerFeatureGroup.addLayer(marker); }
        });
      }
      this.markerFeatureGroup.addTo(this.map);

      const bounds = this.markerFeatureGroup.getBounds();
      if (bounds.isValid() && (this.autoZoomToResults || this.nextResultsZoom)) {
        this.map.fitBounds(bounds);
        this.map.invalidateSize();
        this.nextResultsZoom = false;
      }
    }
  }

  private createFeatureGeometry(elem: {feature: FacetSearchElementFeature, url: string}): L.GeoJSON | undefined {
    if (elem.feature) {
      const geometry = geoJSON(elem.feature.geometry);
      geometry.on('mouseup', () => this.selectedFeature.emit(elem));
      return geometry;
    }
  }

  private createEntryGeometry(entry: FacetSearchElement) {
    if (entry.feature?.geometry) {
      const geometry = geoJSON(entry.feature.geometry);
      geometry.on('mouseup', () => this.selectedEntry.emit(entry));
      return geometry;
    }
  }

}
