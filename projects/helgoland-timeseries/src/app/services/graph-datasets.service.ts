import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventEmitter, Injectable } from '@angular/core';
import { FirstLastValue, Time, Timespan, TimezoneService } from '@helgoland/core';
import { GraphDataEntry, GraphDataset } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

const TIME_CACHE_PARAM = 'timeseriesTime';

export interface DatasetDescription {
  id: string,
  uom: string,
  phenomenonLabel: string;
  platformLabel: string;
  procedureLabel: string;
  categoryLabel: string;
  firstValue: FirstLastValue;
  lastValue: FirstLastValue;
}

// TODO: refactoring
export interface DatasetEntry {
  id: string;
  graphDataset: GraphDataset;
  description: DatasetDescription;
  handler: DatasetHandler;
  overviewGraphDataset: GraphDataset;
}

export interface DatasetHandler {
  removedDataset(id: string);
}

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  public dataUpdated: EventEmitter<void> = new EventEmitter();

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

  get graphDatasets(): GraphDataset[] {
    return this.datasets.map(e => e.graphDataset);
  }

  get overviewDatasets(): GraphDataset[] {
    return this.datasets.map(e => e.overviewGraphDataset);
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

  updateData(id: string, data: GraphDataEntry[]) {
    const ds = this.getDatasetEntry(id);
    if (ds) {
      ds.graphDataset.data = data;
      ds.graphDataset.loading = false;
      this.dataUpdated.emit();
    }
  }

  updateOverviewData(id: string, data: GraphDataEntry[]) {
    const ds = this.getDatasetEntry(id);
    if (ds) {
      ds.overviewGraphDataset.data = data;
      ds.overviewGraphDataset.loading = false;
      this.dataUpdated.emit();
    }
  }

  setDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).graphDataset.loading = loading;
  }

  setOverviewDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).overviewGraphDataset.loading = loading;
  }

  datasetUpdated(Dataset: DatasetEntry) {
    this.dataUpdated.emit();
  }

  deleteDataset(id: string) {
    console.log(`delete ${id}`);
    const dataset = this.getDatasetEntry(id);
    dataset.handler.removedDataset(dataset.id);
    const idx = this.getDatasetEntryIndex(dataset.id);
    this.datasets.splice(idx, 1);
  }

  deleteAllDatasets() {
    this.datasets.map(e => e.id).forEach(id => this.deleteDataset(id));
  }

  selectDataset(dataset: DatasetEntry, selected: boolean) {
    this.getDatasetEntry(dataset.id).graphDataset.selected = selected;
    this.dataUpdated.emit();
  }

  setSelections(selection: string[]) {
    this.datasets.forEach(e => e.graphDataset.selected = selection.indexOf(e.id) >= 0);
  }

  clearSelections() {
    this.datasets.forEach(e => e.graphDataset.selected = false);
    this.dataUpdated.emit();
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

  private getDatasetEntry(id: string): DatasetEntry {
    return this.datasets.find(e => e.id === id);
  }

}
