import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { HelgolandParameterFilter } from "@helgoland/core";
import * as L from "leaflet";

import { CachedMapComponent } from "../base/cached-map-component";
import { MapCache } from "../base/map-cache.service";
import { MarkerSelectorGenerator } from "./model/marker-selector-generator";

@Directive()
export abstract class MapSelectorComponent<T>
  extends CachedMapComponent
  implements OnChanges, AfterViewInit {

    /**
     * @input The serviceUrl, where the selection should be loaded.
     */
    @Input()
  public serviceUrl: string | undefined;

    /**
     * @input The filter which should be used, while fetching the selection.
     */
    @Input()
    public filter: HelgolandParameterFilter | undefined;

    @Input()
    public avoidZoomToSelection: boolean | undefined;

    @Input()
    public markerSelectorGenerator: MarkerSelectorGenerator | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    /**
     * @input Additional configuration for the marker zooming (https://leafletjs.com/reference-1.3.4.html#fitbounds-options)
     */
    @Input()
    public fitBoundsMarkerOptions: L.FitBoundsOptions | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onNoResultsFound: EventEmitter<boolean> = new EventEmitter();

    constructor(
        protected override mapCache: MapCache,
        protected override kvDiffers: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
      super(mapCache, kvDiffers);
    }

    public ngAfterViewInit() {
      this.createMap();
      setTimeout(() => {
        if (this.map && this.serviceUrl) this.drawGeometries(this.map, this.serviceUrl);
        this.cd.detectChanges();
      }, 10);
    }

    public override ngOnChanges(changes: SimpleChanges) {
      super.ngOnChanges(changes);
      if (changes["serviceUrl"] || changes["filter"] || changes["cluster"]) {
        if (this.map && this.serviceUrl) this.drawGeometries(this.map, this.serviceUrl);
      }
    }

    /**
     * Draws the geometries
     *
     * @protected
     * @abstract
     */
    protected abstract drawGeometries(map: L.Map, serviceUrl: string): void;

    /**
     * Zooms to the given bounds
     *
     * @protected
     * @param bounds where to zoom
     */
    protected zoomToMarkerBounds(bounds: L.LatLngBoundsExpression, map: L.Map) {
      if (!this.avoidZoomToSelection && map) {
        map.fitBounds(bounds, this.fitBoundsMarkerOptions || {});
      }
    }

}
