import { AfterViewInit, ChangeDetectorRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import { HasLoadableContent } from '../../../model/mixins/has-loadable-content';
import { ParameterFilter } from './../../../model/api/parameterFilter';
import { MapCache } from './../../../services/map/map.service';

export abstract class MapSelectorComponent<T> implements OnChanges, AfterViewInit, HasLoadableContent {

    @Input()
    public mapId: string;

    @Input()
    public serviceUrl: string;

    @Input()
    public filter: ParameterFilter;

    @Input()
    public mapLayers: any; // TODO implement input mapLayers

    @Input()
    public cluster: boolean; // TODO implement clustering

    @Output()
    public onSelected: EventEmitter<T> = new EventEmitter<T>();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    public noResultsFound: boolean;
    protected map: L.Map;

    constructor(
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit() {
        this.map = L.map(this.mapId, {});
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.mapCache.setMap(this.mapId, this.map);
        setTimeout(() => {
            this.drawGeometries();
            this.cd.detectChanges();
        }, 10);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ((changes.serviceUrl || changes.filter) && this.map) {
            this.drawGeometries();
        }
    }

    protected abstract drawGeometries(): void;
}
