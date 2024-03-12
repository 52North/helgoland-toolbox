import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import * as L from "leaflet";

import { GeoSearch, GeoSearchOptions, GeoSearchResult } from "../../base/geosearch/geosearch";
import { MapCache } from "../../base/map-cache.service";
import { MapControlComponent } from "../map-control-component";

@Component({
  selector: "n52-geosearch-control",
  templateUrl: "./geosearch.component.html",
  standalone: true,
  imports: [FormsModule]
})
export class GeosearchControlComponent extends MapControlComponent {

    /**
     * Additional search options.
     */
    @Input() public options: GeoSearchOptions | undefined;

    /**
     * Returns the search result.
     */
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() public onResultChanged: EventEmitter<GeoSearchResult> = new EventEmitter();

    /**
     * Informs, when the search is triggered.
     */
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() public onSearchTriggered: EventEmitter<void> = new EventEmitter();

    public result: GeoSearchResult | undefined;

    public resultGeometry: L.GeoJSON | undefined;

    public searchTerm: string | undefined;

    public loading: boolean | undefined;

    constructor(
        protected override mapCache: MapCache,
        protected geosearch: GeoSearch
    ) {
      super(mapCache);
    }

    public triggerSearch() {
      this.onSearchTriggered.emit();
      if (this.resultGeometry) {
        this.resultGeometry.remove();
      }
      if (this.searchTerm) {
        this.loading = true;
        this.geosearch.searchTerm(this.searchTerm, this.options).subscribe(
          (result) => {
            if (!result) {
              this.searchTerm = "";
              this.onResultChanged.emit(undefined);
              return;
            }
            this.result = result;
            if (this.mapId && this.mapCache.getMap(this.mapId)) {
              this.resultGeometry = L.geoJSON(result.geometry).addTo(this.mapCache.getMap(this.mapId));
              if (result.bounds) {
                this.mapCache.getMap(this.mapId).fitBounds(result.bounds);
              } else {
                this.mapCache.getMap(this.mapId).fitBounds(this.resultGeometry.getBounds());
              }
            }
            this.onResultChanged.emit(result);
          },
          (error) => {
            this.searchTerm = "error occurred";
            this.onResultChanged.emit(undefined);
          },
          () => this.loading = false
        );
      }
    }

    public clearSearch() {
      this.searchTerm = "";
      this.onResultChanged.emit(undefined);
      this.removeOldGeometry();
    }

    private removeOldGeometry() {
      if (this.resultGeometry) {
        this.resultGeometry.remove();
      }
    }

}
