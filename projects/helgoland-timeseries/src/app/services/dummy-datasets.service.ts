import { Injectable } from '@angular/core';
import { AxisSettings, DatasetChild, LineStyle, SeriesGraphDataset } from '@helgoland/d3';

import { DatasetsService } from './graph-datasets.service';

@Injectable({
  providedIn: 'root'
})
export class DummyDatasetsService {
  datasetId: string = '123';

  constructor(
    protected graphDatasetsSrvc: DatasetsService,
  ) {
    const dummyDataset = this.createNewDataset('blue');
    const child = new DatasetChild(
      this.datasetId,
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
    dummyDataset.addChild(child);
    this.graphDatasetsSrvc.addOrUpdateDataset(dummyDataset);
    this.addNewValue();
    setInterval(() => this.addNewValue(), 5000);
  }

  private addNewValue() {
    const timestamp = new Date().getTime() + 1;
    const value = this.createValue();
    this.graphDatasetsSrvc.getDatasetEntry(this.datasetId).addNewData(timestamp, value, true);
    this.graphDatasetsSrvc.getOverviewDatasetEntry(this.datasetId).addNewData(timestamp, value, false);
  }

  private createValue(): number {
    return Math.floor(Math.random() * 10);
  }

  private createNewDataset(color: string): SeriesGraphDataset {
    return new SeriesGraphDataset(
      this.datasetId,
      new LineStyle(color, 3, 2),
      new AxisSettings(),
      true,
      false,
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
