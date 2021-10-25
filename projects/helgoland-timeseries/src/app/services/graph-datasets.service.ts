import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventEmitter, Injectable } from '@angular/core';
import { Time, Timespan, TimezoneService } from '@helgoland/core';
import { DatasetEntry, GraphDataEntry } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  public timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  public datasets: DatasetEntry[] = [];

  private _timespan: Timespan;

  constructor(
    protected timeSrvc: Time,
    protected translate: TranslateService,
    protected la: LiveAnnouncer,
    protected timezoneSrvc: TimezoneService,
  ) {
    this.initTimespan();
  }

  get timespan(): Timespan {
    return this._timespan;
  }

  get overviewTimespan(): Timespan {
    return this.timeSrvc.getBufferedTimespan(this._timespan, 2);
  }

  set timespan(ts: Timespan) {
    const message = `${this.translate.instant('events.timespan-changed-from')} ${this.timezoneSrvc.formatTzDate(ts.from)} ${this.translate.instant('events.timespan-changed-to')} ${this.timezoneSrvc.formatTzDate(ts.to)}`;
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

  addOrUpdateDataset(dataset: DatasetEntry) {
    const datasetIdx = this.getDatasetEntryIndex(dataset.id);
    if (datasetIdx >= 0) {
      this.datasets[datasetIdx] = dataset;
    } else {
      this.datasets.push(dataset);
    }
  }

  setDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).dataLoading = loading;
  }

  setOverviewDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).overviewDataLoading = loading;
  }

  deleteDataset(id: string) {
    console.log(`delete ${id}`);
    const dataset = this.getDatasetEntry(id);
    dataset.deleted();
    const idx = this.getDatasetEntryIndex(dataset.id);
    this.datasets.splice(idx, 1);
  }

  deleteAllDatasets() {
    this.datasets.map(e => e.id).forEach(id => this.deleteDataset(id));
  }

  datasetsSelected(): boolean {
    return this.datasets.some(e => e.selected);
  }

  clearSelections() {
    this.datasets.forEach(e => e.selected = false);
  }

  private initTimespan() {
    if (!this._timespan) {
      this._timespan =
        this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) ||
        this.timeSrvc.createByDurationWithEnd(moment.duration(1, 'days'), new Date(), 'day');
    }
  }

  private getDatasetEntryIndex(id: string): number {
    return this.datasets.findIndex(e => e.id === id);
  }

  getDatasetEntry(id: string): DatasetEntry {
    return this.datasets.find(e => e.id === id);
  }

}
