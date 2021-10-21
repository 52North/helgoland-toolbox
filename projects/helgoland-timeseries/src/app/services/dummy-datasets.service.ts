import { Injectable } from '@angular/core';
import { AxisSettings, LineStyle } from '@helgoland/d3';

import { DatasetEntry, DatasetHandler, DatasetsService } from './graph-datasets.service';

@Injectable({
  providedIn: 'root'
})
export class DummyDatasetsService implements DatasetHandler {
  dummyDataset: DatasetEntry;

  constructor(
    protected graphDatasetsSrvc: DatasetsService,
  ) {
    this.dummyDataset = this.createNewDataset('123', 'red');
    this.graphDatasetsSrvc.addOrUpdateDataset(this.dummyDataset);
    // setInterval(() => {
    //   this.addNewValue();
    // }, 10000);
  }

  public removedDataset(id: string) {
  }

  private addNewValue() {
    const dataPoint = {
      timestamp: new Date().getTime() + 1,
      value: this.createValue()
    };
    this.dummyDataset.graphDataset.data.push(dataPoint);
    this.dummyDataset.description.lastValue = dataPoint;
    this.graphDatasetsSrvc.updateData(this.dummyDataset.id, this.dummyDataset.graphDataset.data);
  }

  private createValue(): number {
    return Math.floor(Math.random() * 10);
  }

  private createNewDataset(id: string, color: string): DatasetEntry {
    const dataPoint = {
      timestamp: new Date().getTime(),
      value: this.createValue()
    };
    return {
      id: id,
      graphDataset: {
        id: id,
        yaxis: new AxisSettings('rnd'),
        selected: false,
        visible: true,
        style: new LineStyle(color, 3, 3),
        data: [
          dataPoint
        ],
        loading: false
      },
      overviewGraphDataset: {
        id: id,
        yaxis: new AxisSettings('rnd'),
        selected: false,
        visible: true,
        style: new LineStyle(color, 3, 3),
        data: [
          dataPoint
        ],
        loading: false
      },
      handler: this,
      description: {
        id: id,
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
