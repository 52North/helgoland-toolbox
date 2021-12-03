import { Injectable } from '@angular/core';
import { AxisSettings, DatasetChild, SeriesGraphDataset, LineStyle } from '@helgoland/d3';

import { DatasetsService } from './graph-datasets.service';

@Injectable({
  providedIn: 'root'
})
export class DummyDatasetsService {
  dummyDataset: SeriesGraphDataset;

  constructor(
    protected graphDatasetsSrvc: DatasetsService,
  ) {
    this.dummyDataset = this.createNewDataset('123', 'red');
    const child = new DatasetChild(
      '123',
      'ChildData',
      false,
      [{
        value: 1.2,
        timestamp: new Date().getTime() - (360 * 1000)
      },
      {
        value: 1.8,
        timestamp: new Date().getTime() + (360 * 1000)
      }],
      'green'
    );
    this.dummyDataset.addChild(child);
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

  private createNewDataset(id: string, color: string): SeriesGraphDataset {
    return new SeriesGraphDataset(
      id, new LineStyle(color, 3, 3), new AxisSettings(), true, false,
      {
        uom: 'rnd',
        phenomenonLabel: 'Zahlen zwischne 0 und 10',
        platformLabel: null,
        procedureLabel: null,
        categoryLabel: null,
        firstValue: null,
        lastValue: null,
        featureLabel: null
      }
    )
  }

}
