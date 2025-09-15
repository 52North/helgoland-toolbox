import {
  Directive,
  DoCheck,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  input,
  output,
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

export interface PresenterOptions {}

/**
 * Abstract superclass for all components, which will present datasets.
 */
@Directive()
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export abstract class DatasetPresenterComponent<
    T extends DatasetOptions | DatasetOptions[],
    U extends PresenterOptions,
  >
  extends ResizableComponent
  implements OnChanges, DoCheck, OnDestroy
{
  protected iterableDiffers = inject(IterableDiffers);
  protected servicesConnector = inject(HelgolandServicesConnector);
  protected datasetIdResolver = inject(InternalIdHandler);
  protected timeSrvc = inject(Time);
  protected translateService = inject(TranslateService);
  protected timezoneSrvc = inject(TimezoneService);

  /**
   * List of presented dataset ids.
   */
  readonly datasetIds = input<string[]>([]);

  /**
   * List of presented selected dataset ids.
   */
  readonly selectedDatasetIds = input<string[]>([]);

  /**
   * The time interval in which the data should presented.
   */
  readonly timeInterval = input<TimeInterval>();

  /**
   * The corresponding dataset options.
   */
  readonly datasetOptions = input<Map<string, T>>();
  protected oldDatasetOptions: Map<string, T> = new Map();

  /**
   * Options for general presentation of the data.
   */
  readonly presenterOptions = input<U>();
  protected oldPresenterOptions: U | undefined;

  /**
   * List of datasets for which a reload should be triggered, when the Array is set to new value.
   */
  readonly reloadForDatasets = input<string[]>([]);

  /**
   * Event with a list of selected datasets.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onDatasetSelected = output<string[]>();

  /**
   * Event when the timespan in the presentation is adjusted.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimespanChanged = output<Timespan>();

  /**
   * Event, when there occured a message in the component.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onMessageThrown = output<PresenterMessage>();

  /**
   * Event flag, while there is data loaded in the component.
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onContentLoading = output<boolean>();

  /**
   * Event, which triggers list of datasets where data is currently loaded.
   */
  readonly dataLoaded = output<Set<string>>();

  protected timespan: Timespan | undefined;

  private datasetIdsDiffer: IterableDiffer<string>;
  private selectedDatasetIdsDiffer: IterableDiffer<string>;
  private langChangeSubscription: Subscription;
  private timezoneSubscription: Subscription;

  constructor() {
    super();
    this.datasetIdsDiffer = this.iterableDiffers.find([]).create();
    this.selectedDatasetIdsDiffer = this.iterableDiffers.find([]).create();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (langChangeEvent: LangChangeEvent) =>
        this.onLanguageChanged(langChangeEvent),
    );
    this.timezoneSubscription = this.timezoneSrvc.timezoneChange.subscribe(
      (tz: string) => this.onTimezoneChanged(tz),
    );
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    const timeInterval = this.timeInterval();
    if (changes['timeInterval'] && timeInterval) {
      this.timespan = this.timeSrvc.createTimespanOfInterval(timeInterval);
      this.timeIntervalChanges();
    }
    const reloadForDatasets = this.reloadForDatasets();
    if (
      changes['reloadForDatasets'] &&
      reloadForDatasets &&
      this.reloadDataForDatasets.length > 0
    ) {
      this.reloadDataForDatasets(reloadForDatasets);
    }
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngDoCheck(): void {
    const presenterOptions = this.presenterOptions();
    if (!this.deepEqual(this.oldPresenterOptions, presenterOptions)) {
      this.oldPresenterOptions = Object.assign({}, presenterOptions);
      const options = Object.assign({}, presenterOptions);
      this.presenterOptionsChanged(options);
    }

    const datasetIdsChanges = this.datasetIdsDiffer.diff(this.datasetIds());
    if (datasetIdsChanges) {
      datasetIdsChanges.forEachAddedItem((addedItem) => {
        this.addDatasetByInternalId(addedItem.item);
      });
      datasetIdsChanges.forEachRemovedItem((removedItem) => {
        this.removeDataset(removedItem.item);
      });
    }

    const selectedDatasetIdsChanges = this.selectedDatasetIdsDiffer.diff(
      this.selectedDatasetIds(),
    );
    if (selectedDatasetIdsChanges) {
      selectedDatasetIdsChanges.forEachAddedItem((addedItem) => {
        this.setSelectedId(addedItem.item);
      });
      selectedDatasetIdsChanges.forEachRemovedItem((removedItem) => {
        this.removeSelectedId(removedItem.item);
      });
    }

    const datasetOptions = this.datasetOptions();
    if (datasetOptions) {
      const firstChange = this.oldDatasetOptions === undefined;
      if (firstChange) {
        this.oldDatasetOptions = new Map();
      }
      datasetOptions.forEach((value, key) => {
        if (!this.deepEqual(value, this.oldDatasetOptions.get(key))) {
          this.oldDatasetOptions.set(
            key,
            Object.assign({}, this.datasetOptions()!.get(key)),
          );
          this.datasetOptionsChanged(key, value, firstChange);
        }
      });
    }
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.timezoneSubscription.unsubscribe();
  }

  protected deepEqual(obj1: any, obj2: any) {
    if (obj1 === obj2)
      // it's just the same object. No need to compare.
      return true;

    if (!obj1 || !obj2) return false;

    if (this.isPrimitive(obj1) && this.isPrimitive(obj2))
      // compare primitives
      return obj1 === obj2;

    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    // compare objects with same number of keys
    for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj1, key)) {
        if (!(key in obj2)) return false; //other object doesn't have this prop
        if (!this.deepEqual(obj1[key], obj2[key])) return false;
      }
    }
    return true;
  }

  protected isPrimitive(obj: any) {
    return obj !== Object(obj);
  }

  abstract reloadDataForDatasets(datasets: string[]): void;

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

  protected abstract datasetOptionsChanged(
    internalId: string,
    options: T,
    firstChange: boolean,
  ): void;
}
