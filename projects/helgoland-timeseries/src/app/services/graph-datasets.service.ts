import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventEmitter, Injectable } from '@angular/core';
import { Time, Timespan, TimezoneService } from '@helgoland/core';
import { SeriesGraphDataset } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { NotifierService } from './notifier.service';

const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable({
  providedIn: 'root',
})
export class DatasetsService {
  public timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  public datasets: SeriesGraphDataset[] = [];

  public overviewDatasets: SeriesGraphDataset[] = [];

  private _loadingDatasets: Set<string> = new Set();

  private _loadingData: Set<string> = new Set();
  public loadingDataChanged: EventEmitter<Set<string>> = new EventEmitter();

  private _loadingOverviewData: Set<string> = new Set();
  public loadingOverviewDataChanged: EventEmitter<Set<string>> =
    new EventEmitter();

  private _timespan: Timespan = this.initTimespan();

  constructor(
    protected timeSrvc: Time,
    protected translate: TranslateService,
    protected la: LiveAnnouncer,
    protected timezoneSrvc: TimezoneService,
    protected notifier: NotifierService,
  ) {
    this.initTimespan();
  }

  get timespan(): Timespan {
    return this._timespan;
  }

  get overviewTimespan(): Timespan {
    return this.timeSrvc.getBufferedTimespan(this._timespan, 2);
  }

  get loadingDatasets(): string[] {
    return Array.from(this._loadingDatasets);
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
    return this.datasets.length;
  }

  hasDatasets(): boolean {
    return this.datasets.length > 0;
  }

  hasDataset(id: string): boolean {
    return this.getDatasetEntryIndex(id) >= 0;
  }

  startLoadingDataset(id: string): void {
    this._loadingDatasets.add(id);
  }

  stopLoadingDataset(id: string) {
    this._loadingDatasets.delete(id);
  }

  addOrUpdateDataset(dataset: SeriesGraphDataset) {
    this.stopLoadingDataset(dataset.id);
    const datasetIdx = this.getDatasetEntryIndex(dataset.id);
    const overviewDs = dataset.clone();
    dataset.stateChangeEvent.subscribe((state) => {
      overviewDs.setSelected(dataset.selected, false);
      overviewDs.setVisible(dataset.visible, false);
      overviewDs.setStyle(dataset.style.clone());
    });
    if (datasetIdx >= 0) {
      this.datasets[datasetIdx] = dataset;
      this.overviewDatasets[datasetIdx] = overviewDs;
    } else {
      this.datasets.push(dataset);
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
    this.datasets.splice(idx, 1);
    const ovDataset = this.getOverviewDatasetEntry(id);
    ovDataset.deleted();
    this.overviewDatasets.splice(idx, 1);
  }

  deleteAllDatasets() {
    this.datasets
      .map((e) => e.id)
      .forEach((id) => this.deleteDataset(id, false));
    this.la.announce(this.translate.instant('events.all-timeseries-removed'));
    this.notifier.notify(
      this.translate.instant('events.all-timeseries-removed'),
    );
  }

  datasetsSelected(): boolean {
    return this.datasets.some((e) => e.selected);
  }

  clearSelections() {
    this.datasets.forEach((e) => e.setSelected(false));
  }

  private initTimespan() {
    return (
      this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) ||
      this.timeSrvc.createByDurationWithEnd(
        moment.duration(1, 'days'),
        new Date(),
        'day',
      )
    );
  }

  private getDatasetEntryIndex(id: string): number {
    return this.datasets.findIndex((e) => e.id === id);
  }

  getDatasetEntry(dsId: string): SeriesGraphDataset {
    const dataset = this.datasets.find((e) => e.id === dsId);
    if (dataset) return dataset;
    throw new Error(`No dataset found for ${dsId}`);
  }

  getOverviewDatasetEntry(dsId: string): SeriesGraphDataset {
    const dataset = this.overviewDatasets.find((e) => e.id === dsId);
    if (dataset) return dataset;
    throw new Error(`No dataset found for ${dsId}`);
  }
}
