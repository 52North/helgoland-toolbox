import { Injectable } from '@angular/core';
import { AxisSettings, DatasetEntry, LineStyle } from '@helgoland/d3';

import { DatasetsService } from './graph-datasets.service';

@Injectable({
  providedIn: 'root'
})
export class DummyDatasetsService {
  dummyDataset: DatasetEntry;

  constructor(
    protected graphDatasetsSrvc: DatasetsService,
  ) {
    this.dummyDataset = this.createNewDataset('123', 'red');
    this.graphDatasetsSrvc.addOrUpdateDataset(this.dummyDataset);
    this.addNewValue();
    // setInterval(() => {
    //   this.addNewValue();
    // }, 10000);
  }

  private addNewValue() {
    const dataPoint = {
      timestamp: new Date().getTime() + 1,
      value: this.createValue()
    };
    this.dummyDataset.addNewData(dataPoint);
  }

  private createValue(): number {
    return Math.floor(Math.random() * 10);
  }

  private createNewDataset(id: string, color: string): DatasetEntry {
    return new DatasetEntry(
      id, new LineStyle(color, 3, 3), new AxisSettings(), true, false,
      {
        uom: 'rnd',
        phenomenonLabel: 'Zahlen zwischne 0 und 10',
        platformLabel: null,
        procedureLabel: null,
        categoryLabel: null,
        firstValue: null,
        lastValue: null
      }
    )
  }

}
