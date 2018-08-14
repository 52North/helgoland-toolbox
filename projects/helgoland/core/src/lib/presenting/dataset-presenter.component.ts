import {
    DoCheck,
    EventEmitter,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { DatasetApiInterface } from '../dataset-api/api-interface';
import { InternalIdHandler } from '../dataset-api/internal-id-handler.service';
import { DatasetOptions } from '../model/internal/options';
import { ResizableComponent } from '../model/internal/ResizableComponent';
import { TimeInterval, Timespan } from '../model/internal/timeInterval';
import { HasLoadableContent } from '../model/mixins/has-loadable-content';
import { Time } from '../time/time.service';
import { PresenterMessage } from './presenter-message';

const equal = require('deep-equal');

export abstract class DatasetPresenterComponent<T extends DatasetOptions | DatasetOptions[], U>
    extends ResizableComponent implements OnChanges, DoCheck, OnDestroy, HasLoadableContent {

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
    private langChangeSubscription: Subscription;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: DatasetApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected translateService: TranslateService
    ) {
        super();
        this.datasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.selectedDatasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.langChangeSubscription = this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => this.onLanguageChanged(langChangeEvent));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeInterval && this.timeInterval) {
            this.timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
            this.timeIntervalChanges();
        }
    }

    public ngOnDestroy(): void {
        this.langChangeSubscription.unsubscribe();
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
            this.oldGraphOptions = Object.assign({}, this.graphOptions);
            const options = Object.assign({}, this.graphOptions);
            this.graphOptionsChanged(options);
        }

        if (this.datasetOptions) {
            const firstChange = this.oldDatasetOptions === undefined;
            if (firstChange) { this.oldDatasetOptions = new Map(); }
            this.datasetOptions.forEach((value, key) => {
                if (!equal(value, this.oldDatasetOptions.get(key))) {
                    this.oldDatasetOptions.set(key, Object.assign({}, this.datasetOptions.get(key)));
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

    protected abstract onLanguageChanged(langChangeEvent: LangChangeEvent): void;

    protected abstract timeIntervalChanges(): void;

    protected abstract addDataset(id: string, url: string): void;

    protected abstract removeDataset(internalId: string): void;

    protected abstract setSelectedId(internalId: string): void;

    protected abstract removeSelectedId(internalId: string): void;

    protected abstract graphOptionsChanged(options: U): void;

    protected abstract datasetOptionsChanged(internalId: string, options: T, firstChange: boolean): void;

}
