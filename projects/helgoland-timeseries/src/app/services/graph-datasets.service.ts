import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventEmitter, Injectable } from '@angular/core';
import { Time, Timespan, TimezoneService } from '@helgoland/core';
import { SeriesGraphDataset } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subject } from 'rxjs';

import { ConfigurationService } from './configuration.service';
import { NotifierService } from './notifier.service';
import { StorageService } from './storage-service.service';

const TIME_CACHE_PARAM = 'timeseriesTime';

export class LoadingDataset {
  constructor(private _id: string) {}
  get id(): string {
    return this._id;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DatasetsService {
  public timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  private _datasets: (SeriesGraphDataset | LoadingDataset)[] = [];
  public datasetAdded: Subject<string> = new Subject();
  public datasetRemoved: Subject<string> = new Subject();

  public overviewDatasets: SeriesGraphDataset[] = [];

  private _loadingData: Set<string> = new Set();
  public loadingDataChanged: EventEmitter<Set<string>> = new EventEmitter();

  private _loadingOverviewData: Set<string> = new Set();
  public loadingOverviewDataChanged: EventEmitter<Set<string>> =
    new EventEmitter();

  private _timespan: Timespan | undefined;

  constructor(
    protected timeSrvc: Time,
    protected translate: TranslateService,
    protected la: LiveAnnouncer,
    protected timezoneSrvc: TimezoneService,
    protected notifier: NotifierService,
    protected storageSrvc: StorageService,
    protected configSrvc: ConfigurationService,
  ) {}

  get timespan(): Timespan | undefined {
    return this._timespan;
  }

  get overviewTimespan(): Timespan | undefined {
    if (this._timespan) {
      return this.timeSrvc.getBufferedTimespan(this._timespan, 2);
    }
    return undefined;
  }

  get datasets(): SeriesGraphDataset[] {
    const datasets = this._datasets.filter(
      (ds) => ds instanceof SeriesGraphDataset,
    );
    return datasets as SeriesGraphDataset[];
  }

  get allDatasets(): (SeriesGraphDataset | LoadingDataset)[] {
    return this._datasets;
  }

  set timespan(ts: Timespan) {
    const message = `${this.translate.instant(
      'events.timespan-changed-from',
    )} ${this.timezoneSrvc.formatTzDate(ts.from)} ${this.translate.instant(
      'events.timespan-changed-to',
    )} ${this.timezoneSrvc.formatTzDate(ts.to)}`;
    this.la.announce(message);
    this._timespan = ts;
    this.timespanChanged.emit(ts);
    this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, this._timespan);
  }

  getDatasetCount(): number {
    return this._datasets.length;
  }

  hasDatasets(): boolean {
    return this._datasets.length > 0;
  }

  hasDataset(id: string): boolean {
    return this.getDatasetEntryIndex(id) >= 0;
  }

  startLoadingDataset(id: string): void {
    this.storageSrvc.saveDataset(id);
    this._datasets.push(new LoadingDataset(id));
  }

  stopLoadingDatasetOnError(id: string) {
    const datasetIdx = this.getDatasetEntryIndex(id);
    this._datasets.splice(datasetIdx, 1);
    this.storageSrvc.removeDataset(id);
  }

  addOrUpdateDataset(dataset: SeriesGraphDataset) {
    const datasetIdx = this.getDatasetEntryIndex(dataset.id);
    const overviewDs = dataset.clone();
    dataset.stateChangeEvent.subscribe((state) => {
      overviewDs.setSelected(dataset.selected, false);
      overviewDs.setVisible(dataset.visible, false);
      overviewDs.setStyle(dataset.style.clone());
    });
    if (datasetIdx >= 0) {
      this._datasets[datasetIdx] = dataset;
      this.storageSrvc.saveDataset(dataset.id);
      this.overviewDatasets[datasetIdx] = overviewDs;
    } else {
      this._datasets.push(dataset);
      this.storageSrvc.saveDataset(dataset.id);
      this.datasetAdded.next(dataset.id);
      this.overviewDatasets.push(overviewDs);
    }
  }

  setDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).setDataLoading(loading);
    if (loading) {
      this._loadingData.add(id);
    } else {
      this._loadingData.delete(id);
    }
    this.loadingDataChanged.next(this._loadingData);
  }

  setOverviewDataLoading(id: string, loading: boolean) {
    this.getOverviewDatasetEntry(id).setDataLoading(loading);
    if (loading) {
      this._loadingOverviewData.add(id);
    } else {
      this._loadingOverviewData.delete(id);
    }
    this.loadingOverviewDataChanged.next(this._loadingOverviewData);
  }

  deleteDataset(id: string, notify: boolean) {
    console.log(`delete ${id}`);
    const dataset = this.getDatasetEntry(id);
    if (notify) {
      this.la.announce(this.translate.instant('events.remove-timeseries'));
      this.notifier.notify(this.translate.instant('events.remove-timeseries'));
    }
    dataset.deleted();
    const idx = this.getDatasetEntryIndex(dataset.id);
    this._datasets.splice(idx, 1);
    this.storageSrvc.removeDataset(dataset.id);
    this.datasetRemoved.next(dataset.id);
    const ovDataset = this.getOverviewDatasetEntry(id);
    ovDataset.deleted();
    this.overviewDatasets.splice(idx, 1);
  }

  deleteAllDatasets(quiet?: boolean) {
    this._datasets
      .map((e) => e.id)
      .forEach((id) => this.deleteDataset(id, false));
    if (!quiet) {
      this.la.announce(this.translate.instant('events.all-timeseries-removed'));
      this.notifier.notify(
        this.translate.instant('events.all-timeseries-removed'),
      );
    }
  }

  datasetsSelected(): boolean {
    return this._datasets.some(
      (e) => e instanceof SeriesGraphDataset && e.selected,
    );
  }

  clearSelections() {
    this._datasets.forEach(
      (e) => e instanceof SeriesGraphDataset && e.setSelected(false),
    );
  }

  initTimespan(timespan?: Timespan) {
    if (timespan) {
      this.timespan = this.validateTimespan(timespan);
    } else {
      const localStoreTimespan = this.timeSrvc.loadTimespan(TIME_CACHE_PARAM);
      if (localStoreTimespan) {
        this.timespan = this.validateTimespan(localStoreTimespan);
      } else {
        this.timespan = this.timeSrvc.createByDurationWithEnd(
          moment.duration(1, 'days'),
          new Date(),
          'day',
        );
      }
    }
  }

  private validateTimespan(timespan: Timespan): Timespan {
    const daysForOldTimespanCheck =
      this.configSrvc.configuration.daysForOldTimespanCheck;
    if (!isNaN(daysForOldTimespanCheck)) {
      const old = moment()
        .subtract(daysForOldTimespanCheck, 'days')
        .startOf('day')
        .toDate()
        .getTime();
      const current = timespan.to > old;
      if (!current) {
        const message = this.translate.instant('events.timespan-to-old');
        this.notifier.notify(message, 8000);
        return this.timeSrvc.centerTimespan(timespan, new Date());
      }
    }
    return timespan;
  }

  private getDatasetEntryIndex(id: string): number {
    return this._datasets.findIndex((e) => e.id === id);
  }

  getDatasetEntry(dsId: string): SeriesGraphDataset {
    const dataset = this._datasets.find((e) => e.id === dsId);
    if (dataset instanceof SeriesGraphDataset) return dataset;
    throw new Error(`No dataset found for ${dsId}`);
  }

  getOverviewDatasetEntry(dsId: string): SeriesGraphDataset {
    const dataset = this.overviewDatasets.find(
      (e) => e !== undefined && e.id === dsId,
    );
    if (dataset) return dataset;
    throw new Error(`No dataset found for ${dsId}`);
  }
}
