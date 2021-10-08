import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventEmitter, Injectable } from '@angular/core';
import { FirstLastValue, Time, Timespan, TimezoneService } from '@helgoland/core';
import { AxisSettings, GraphDataEntry, GraphDataset, LineStyle } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { Dataset } from './../../../../helgoland/core/src/lib/model/dataset-api/dataset';

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

export interface DatasetEntry {
  id: string;
  graphDataset: GraphDataset;
  description: DatasetDescription;
  // overviewGraphDataset: GraphDataset;
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

    this.datasets.push(this.createNewDataset());
    this.addNewValue();

    // setInterval(() => {
    //   this.addNewValue();
    // }, 60000);
  }

  get graphDatasets(): GraphDataset[] {
    return this.datasets.map(e => e.graphDataset);
  }

  get timespan(): Timespan {
    return this._timespan;
  }

  set timespan(ts: Timespan) {
    const message = `${this.translate.instant('events.timespan-changed-from')} ${this.timezoneSrvc.formatTzDate(ts.from)} ${this.translate.instant('events.timespan-changed-to')} ${this.timezoneSrvc.formatTzDate(ts.to)}`;
    this.la.announce(message);
    this._timespan = ts;
    this.timespanChanged.emit(ts);
    this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, this._timespan);
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
    ds.graphDataset.data = data;
    ds.graphDataset.loading = false;
    this.dataUpdated.emit();
  }

  setDataLoading(id: string, loading: boolean) {
    this.getDatasetEntry(id).graphDataset.loading = loading;
  }

  datasetUpdated(Dataset: DatasetEntry) {
    this.dataUpdated.emit();
  }

  deleteDataset(dataset: DatasetEntry) {
    const idx = this.getDatasetEntryIndex(dataset.id);
    this.datasets.splice(idx, 1);
  }

  deleteAllDatasets() {
    this.datasets = [];
  }

  selectDataset(dataset: DatasetEntry, selected: boolean) {
    this.getDatasetEntry(dataset.id).graphDataset.selected = selected;
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

  // remove later
  addNewValue() {
    const dataPoint = {
      timestamp: new Date().getTime() + 1,
      value: this.createValue()
    };
    const dataset = this.getDatasetEntry('123');
    if (dataset) {
      dataset.graphDataset.data.push(dataPoint);
      dataset.description.lastValue = dataPoint;
      this.dataUpdated.emit();
    }
  }

  private createValue(): number {
    return Math.floor(Math.random() * 10);
  }

  private createNewDataset(): DatasetEntry {
    const dataPoint = {
      timestamp: new Date().getTime(),
      value: this.createValue()
    };
    return {
      id: '123',
      graphDataset: {
        id: '123',
        yaxis: new AxisSettings('rnd'),
        selected: false,
        visible: true,
        style: new LineStyle('red', 3, 3),
        data: [
          dataPoint
        ],
        loading: false
      },
      description: {
        id: '123',
        uom: 'rnd',
        phenomenonLabel: 'Zahlen zwischne 0 und 10',
        platformLabel: null,
        procedureLabel: null,
        categoryLabel: null,
        firstValue: dataPoint,
        lastValue: dataPoint
      }
    };
  }

}
