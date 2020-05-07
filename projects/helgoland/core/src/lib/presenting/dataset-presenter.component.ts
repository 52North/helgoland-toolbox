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

import { HelgolandServicesConnector } from '../api-communication/helgoland-services-connector';
import { InternalIdHandler } from '../dataset-api/internal-id-handler.service';
import { DatasetOptions } from '../model/internal/options';
import { ResizableComponent } from '../model/internal/ResizableComponent';
import { TimeInterval, Timespan } from '../model/internal/timeInterval';
import { Time } from '../time/time.service';
import { TimezoneService } from './../time/timezone.service';
import { PresenterMessage } from './presenter-message';

const equal = require('deep-equal');

export interface PresenterOptions { }

/**
 * Abstract superclass for all components, which will present datasets.
 */
export abstract class DatasetPresenterComponent<T extends DatasetOptions | DatasetOptions[], U extends PresenterOptions>
    extends ResizableComponent implements OnChanges, DoCheck, OnDestroy {

    /**
     * List of presented dataset ids.
     */
    @Input()
    public datasetIds: string[] = [];

    /**
     * List of presented selected dataset ids.
     */
    @Input()
    public selectedDatasetIds: string[] = [];

    /**
     * The time interval in which the data should presented.
     */
    @Input()
    public timeInterval: TimeInterval;

    /**
     * The corresponding dataset options.
     */
    @Input()
    public datasetOptions: Map<string, T>;
    protected oldDatasetOptions: Map<string, T>;

    /**
     * Options for general presentation of the data.
     */
    @Input()
    public presenterOptions: U;
    protected oldPresenterOptions: U;

    /**
     * List of datasets for which a reload should be triggered, when the Array is set to new value.
     */
    @Input()
    public reloadForDatasets: string[];

    /**
     * Event with a list of selected datasets.
     */
    @Output()
    public onDatasetSelected: EventEmitter<string[]> = new EventEmitter();

    /**
     * Event when the timespan in the presentation is adjusted.
     */
    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    /**
     * Event, when there occured a message in the component.
     */
    @Output()
    public onMessageThrown: EventEmitter<PresenterMessage> = new EventEmitter();

    /**
     * Event flag, while there is data loaded in the component.
     */
    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    /**
     * Event, which triggers list of datasets where data is currently loaded.
     */
    @Output()
    public dataLoaded: EventEmitter<Set<string>> = new EventEmitter();

    protected timespan: Timespan;

    private datasetIdsDiffer: IterableDiffer<string>;
    private selectedDatasetIdsDiffer: IterableDiffer<string>;
    private langChangeSubscription: Subscription;
    private timezoneSubscription: Subscription;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected servicesConnector: HelgolandServicesConnector,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        protected translateService: TranslateService,
        protected timezoneSrvc: TimezoneService
    ) {
        super();
        this.datasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.selectedDatasetIdsDiffer = this.iterableDiffers.find([]).create();
        this.langChangeSubscription = this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => this.onLanguageChanged(langChangeEvent));
        this.timezoneSubscription = this.timezoneSrvc.timezoneChange.subscribe((tz: string) => this.onTimezoneChanged(tz));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeInterval && this.timeInterval) {
            this.timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
            this.timeIntervalChanges();
        }
        if (changes.reloadForDatasets && this.reloadForDatasets && this.reloadDataForDatasets.length > 0) {
            this.reloadDataForDatasets(this.reloadForDatasets);
        }
    }

    public ngOnDestroy(): void {
        this.langChangeSubscription.unsubscribe();
        this.timezoneSubscription.unsubscribe();
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

        if (!equal(this.oldPresenterOptions, this.presenterOptions)) {
            this.oldPresenterOptions = Object.assign({}, this.presenterOptions);
            const options = Object.assign({}, this.presenterOptions);
            this.presenterOptionsChanged(options);
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

    public abstract reloadDataForDatasets(datasets: string[]): void;

    protected addDatasetByInternalId(internalId: string) {
        const internalIdObj = this.datasetIdResolver.resolveInternalId(internalId);
        this.addDataset(internalIdObj.id, internalIdObj.url);
    }

    protected abstract onLanguageChanged(langChangeEvent: LangChangeEvent): void;

    protected abstract onTimezoneChanged(timezone: string): void;

    protected abstract timeIntervalChanges(): void;

    protected abstract addDataset(id: string, url: string): void;

    protected abstract removeDataset(internalId: string): void;

    protected abstract setSelectedId(internalId: string): void;

    protected abstract removeSelectedId(internalId: string): void;

    protected abstract presenterOptionsChanged(options: U): void;

    protected abstract datasetOptionsChanged(internalId: string, options: T, firstChange: boolean): void;

}
