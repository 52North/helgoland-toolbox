import {
    DoCheck,
    EventEmitter,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { PresenterMessage } from '@helgoland/core';

import { ApiInterface } from '../api-interface/api-interface';
import { InternalIdHandler } from '../api-interface/internal-id-handler.service';
import { DatasetOptions } from '../model/internal/options';
import { ResizableComponent } from '../model/internal/ResizableComponent';
import { TimeInterval, Timespan } from '../model/internal/timeInterval';
import { HasLoadableContent } from '../model/mixins/has-loadable-content';
import { Time } from '../time/index';

const equal = require('deep-equal');

export abstract class DatasetPresenterComponent<T extends DatasetOptions | DatasetOptions[], U>
    extends ResizableComponent implements OnChanges, DoCheck, HasLoadableContent {

    @Input()
    public datasetIds: string[] = [];

    @Input()
    public selectedDatasetIds: string[] = [];

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public datasetOptions: Map<string, T>;
    public oldDatasetOptions: Map<string, T>;

    @Input()
    public graphOptions: U;

    @Output()
    public onDatasetSelected: EventEmitter<string[]> = new EventEmitter();

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @Output()
    public onMessageThrown: EventEmitter<PresenterMessage> = new EventEmitter();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    protected timespan: Timespan;

    private datasetIdsDiffer: IterableDiffer<string>;
    private selectedDatasetIdsDiffer: IterableDiffer<string>;
    private oldGraphOptions: U;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super();
        this.datasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.selectedDatasetIdsDiffer = this.iterableDiffers.find([]).create();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeInterval && this.timeInterval) {
            this.timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
            this.timeIntervalChanges();
        }
    }

    public ngDoCheck(): void {
        const datasetIdsChanges = this.datasetIdsDiffer.diff(this.datasetIds);
        if (datasetIdsChanges) {
            datasetIdsChanges.forEachAddedItem((addedItem) => {
                this.addDatasetByInternalId(addedItem.item);
            });
            datasetIdsChanges.forEachRemovedItem((removedItem) => {
                this.removeDataset(removedItem.item);
            });
        }

        const selectedDatasetIdsChanges = this.selectedDatasetIdsDiffer.diff(this.selectedDatasetIds);
        if (selectedDatasetIdsChanges) {
            selectedDatasetIdsChanges.forEachAddedItem((addedItem) => {
                this.setSelectedId(addedItem.item);
            });
            selectedDatasetIdsChanges.forEachRemovedItem((removedItem) => {
                this.removeSelectedId(removedItem.item);
            });
        }

        if (!equal(this.oldGraphOptions, this.graphOptions)) {
            this.oldGraphOptions = JSON.parse(JSON.stringify(this.graphOptions));
            const options = JSON.parse(JSON.stringify(this.graphOptions));
            this.graphOptionsChanged(options);
        }

        if (this.datasetOptions) {
            const firstChange = this.oldDatasetOptions === undefined;
            if (firstChange) { this.oldDatasetOptions = new Map(); }
            this.datasetOptions.forEach((value, key) => {
                if (!equal(value, this.oldDatasetOptions.get(key))) {
                    this.oldDatasetOptions.set(key, JSON.parse(JSON.stringify(this.datasetOptions.get(key))));
                    this.datasetOptionsChanged(key, value, firstChange);
                }
            });
        }
    }

    public abstract reloadData(): void;

    protected addDatasetByInternalId(internalId: string) {
        const internalIdObj = this.datasetIdResolver.resolveInternalId(internalId);
        this.addDataset(internalIdObj.id, internalIdObj.url);
    }

    protected abstract timeIntervalChanges(): void;

    protected abstract addDataset(id: string, url: string): void;

    protected abstract removeDataset(internalId: string): void;

    protected abstract setSelectedId(internalId: string): void;

    protected abstract removeSelectedId(internalId: string): void;

    protected abstract graphOptionsChanged(options: U): void;

    protected abstract datasetOptionsChanged(internalId: string, options: T, firstChange: boolean): void;

}
