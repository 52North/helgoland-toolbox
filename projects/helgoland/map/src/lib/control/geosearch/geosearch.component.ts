import { Component, inject, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

import {
  GeoSearch,
  GeoSearchOptions,
  GeoSearchResult,
} from '../../base/geosearch/geosearch';
import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-geosearch-control',
  templateUrl: './geosearch.component.html',
  imports: [FormsModule],
})
export class GeosearchControlComponent extends MapControlComponent {
  protected geosearch = inject(GeoSearch);

  /**
   * Additional search options.
   */
  public readonly options = input<GeoSearchOptions>();

  /**
   * Returns the search result.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onResultChanged = output<GeoSearchResult | undefined>();

  /**
   * Informs, when the search is triggered.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onSearchTriggered = output<void>();

  public result: GeoSearchResult | undefined;

  public resultGeometry: L.GeoJSON | undefined;

  public searchTerm: string | undefined;

  public loading: boolean | undefined;

  public triggerSearch() {
    this.onSearchTriggered.emit();
    if (this.resultGeometry) {
      this.resultGeometry.remove();
    }
    if (this.searchTerm) {
      this.loading = true;
      this.geosearch.searchTerm(this.searchTerm, this.options()).subscribe({
        next: (result) => {
          if (!result) {
            this.searchTerm = '';
            this.onResultChanged.emit(undefined);
            return;
          }
          this.result = result;
          const mapId = this.mapId();
          if (mapId && this.mapCache.getMap(mapId)) {
            this.resultGeometry = L.geoJSON(result.geometry).addTo(
              this.mapCache.getMap(mapId),
            );
            if (result.bounds) {
              this.mapCache.getMap(mapId).fitBounds(result.bounds);
            } else {
              this.mapCache
                .getMap(mapId)
                .fitBounds(this.resultGeometry.getBounds());
            }
          }
          this.onResultChanged.emit(result);
        },
        error: (error) => {
          this.searchTerm = 'error occurred';
          this.onResultChanged.emit(undefined);
        },
        complete: () => (this.loading = false),
      });
    }
  }

  public clearSearch() {
    this.searchTerm = '';
    this.onResultChanged.emit(undefined);
    this.removeOldGeometry();
  }

  private removeOldGeometry() {
    if (this.resultGeometry) {
      this.resultGeometry.remove();
    }
  }
}
