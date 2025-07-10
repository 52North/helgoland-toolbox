import {
  AfterViewInit,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { CachedMapComponent } from '@helgoland/map';
import * as L from 'leaflet';
import { geoJSON } from 'leaflet';
import 'leaflet.markercluster';
import { Subscription } from 'rxjs';

import {
  FacetSearchElement,
  FacetSearchElementFeature,
  FacetSearchService,
} from '../../facet-search-model';

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
  standalone: true,
})
export class ResultMapComponent
  extends CachedMapComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly facetSearchService = input.required<FacetSearchService>();

  readonly cluster = input(true);

  readonly aggregateToStations = input(false);

  readonly selectSingleStation = input(false);

  readonly autoZoomToResults = input(true);

  readonly nextResultsZoom = input(true);

  private resultZoomed = this.nextResultsZoom();

  readonly selectedFeature = output<{
    feature: FacetSearchElementFeature;
    url: string;
  }>();

  readonly selectedEntry = output<FacetSearchElement>();

  private markerFeatureGroup: L.FeatureGroup | undefined;
  private resultsSubs: Subscription | undefined;

  ngOnInit() {
    this.resultsSubs = this.facetSearchService()
      .getResults()
      .subscribe((ts) => this.fetchResults(ts));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.resultsSubs?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.createMap();
    const res = this.facetSearchService().getFilteredResults();
    if (res) {
      this.fetchResults(res);
    }
  }

  private fetchResults(entries: FacetSearchElement[]) {
    if (this.map) {
      if (this.markerFeatureGroup) {
        this.map.removeLayer(this.markerFeatureGroup);
      }
      if (this.cluster()) {
        this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
      } else {
        this.markerFeatureGroup = L.featureGroup();
      }
      if (this.aggregateToStations()) {
        const features = new Map<
          string,
          { feature: FacetSearchElementFeature; url: string }
        >();
        entries.forEach((e) => {
          if (e.feature) {
            const id = `${e.feature.id}-${e.url}`;
            if (!features.has(id) && e.url) {
              features.set(id, { feature: e.feature, url: e.url });
            }
          }
        });
        features.forEach((v) => {
          const geom = this.createFeatureGeometry(v);
          if (geom) {
            this.markerFeatureGroup!.addLayer(geom);
          }
        });
        if (features.size === 1 && this.selectSingleStation()) {
          const nextKey = features.keys().next().value;
          if (nextKey) {
            const entry = features.get(nextKey);
            entry && this.selectedFeature.emit(entry);
          }
        }
      } else {
        entries.forEach((e) => {
          if (e.feature) {
            const marker = this.createEntryGeometry(e.feature);
            if (marker) {
              this.markerFeatureGroup!.addLayer(marker);
            }
          }
        });
      }
      this.markerFeatureGroup.addTo(this.map);

      const bounds = this.markerFeatureGroup.getBounds();
      if (bounds.isValid() && (this.autoZoomToResults() || this.resultZoomed)) {
        this.map.fitBounds(bounds);
        this.map.invalidateSize();
        this.resultZoomed = false;
      }
    }
  }

  private createFeatureGeometry(elem: {
    feature: FacetSearchElementFeature;
    url: string;
  }): L.GeoJSON | undefined {
    if (elem.feature) {
      const geometry = geoJSON(elem.feature.geometry);
      geometry.on('mouseup', () => this.selectedFeature.emit(elem));
      return geometry;
    }
    return undefined;
  }

  private createEntryGeometry(entry: FacetSearchElement) {
    if (entry.feature?.geometry) {
      const geometry = geoJSON(entry.feature.geometry);
      geometry.on('mouseup', () => this.selectedEntry.emit(entry));
      return geometry;
    }
    return undefined;
  }
}
