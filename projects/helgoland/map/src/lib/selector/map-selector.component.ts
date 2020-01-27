import {
    AfterViewInit,
    ChangeDetectorRef,
    EventEmitter,
    Input,
    KeyValueDiffers,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { HasLoadableContent, HelgolandParameterFilter } from '@helgoland/core';
import * as L from 'leaflet';

import { CachedMapComponent } from '../base/cached-map-component';
import { MapCache } from '../base/map-cache.service';
import { MarkerSelectorGenerator } from './model/marker-selector-generator';

export abstract class MapSelectorComponent<T>
    extends CachedMapComponent
    implements OnChanges, AfterViewInit, HasLoadableContent {

    /**
     * @input The serviceUrl, where the selection should be loaded.
     */
    @Input()
    public serviceUrl: string;

    /**
     * @input The filter which should be used, while fetching the selection.
     */
    @Input()
    public filter: HelgolandParameterFilter;

    @Input()
    public avoidZoomToSelection: boolean;

    @Input()
    public markerSelectorGenerator: MarkerSelectorGenerator;

    @Output()
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    /**
     * @input Additional configuration for the marker zooming (https://leafletjs.com/reference-1.3.4.html#fitbounds-options)
     */
    @Input()
    public fitBoundsMarkerOptions: L.FitBoundsOptions;

    public isContentLoading: (loading: boolean) => void;

    @Output()
    public onNoResultsFound: EventEmitter<boolean> = new EventEmitter();

    constructor(
        protected mapCache: MapCache,
        protected kvDiffers: KeyValueDiffers,
        protected cd: ChangeDetectorRef
    ) {
        super(mapCache, kvDiffers);
    }

    public ngAfterViewInit() {
        this.createMap();
        setTimeout(() => {
            this.drawGeometries();
            this.cd.detectChanges();
        }, 10);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (this.map) {
            if (changes.serviceUrl || changes.filter || changes.cluster) {
                this.drawGeometries();
            }
        }
    }

    /**
     * Draws the geometries
     *
     * @protected
     * @abstract
     */
    protected abstract drawGeometries(): void;

    /**
     * Zooms to the given bounds
     *
     * @protected
     * @param bounds where to zoom
     */
    protected zoomToMarkerBounds(bounds: L.LatLngBoundsExpression) {
        if (!this.avoidZoomToSelection) {
            this.map.fitBounds(bounds, this.fitBoundsMarkerOptions || {});
        }
    }

}
