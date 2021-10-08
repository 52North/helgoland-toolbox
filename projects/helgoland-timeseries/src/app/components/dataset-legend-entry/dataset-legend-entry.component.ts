import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Time, TimeInterval } from '@helgoland/core';
import { GraphDataset } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

import { DatasetDescription } from '../../services/graph-datasets.service';
import {
  DatasetConfig,
  ModalEditTimeseriesOptionsComponent,
} from '../modal-edit-timeseries-options/modal-edit-timeseries-options.component';

@Component({
  selector: 'helgoland-dataset-legend-entry',
  templateUrl: './dataset-legend-entry.component.html',
  styleUrls: ['./dataset-legend-entry.component.scss']
})
export class DatasetLegendEntryComponent implements OnChanges {

  // Remove later:
  error = false;
  // loading = false;
  //

  @Input() description: DatasetDescription;

  @Input() graphDataset: GraphDataset;

  @Input() selected: boolean;

  @Input() timeInterval: TimeInterval;

  @Output() datasetDeleted: EventEmitter<void> = new EventEmitter();

  @Output() graphDatasetChanged: EventEmitter<void> = new EventEmitter();

  @Output() selectDate: EventEmitter<Date> = new EventEmitter();

  hasData = true;

  constructor(
    public translateSrvc: TranslateService,
    protected timeSrvc: Time,
    private dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timeInterval) {
      this.checkDataInTimespan();
    }
  }

  removeDataset() {
    this.datasetDeleted.emit();
  }

  toggleSelection() {
    this.graphDataset.selected = !this.graphDataset.selected;
    this.graphDatasetChanged.emit();
  }

  toggleVisibility() {
    this.graphDataset.visible = !this.graphDataset.visible;
    this.graphDatasetChanged.emit();
  }

  editDatasetOptions() {
    const config: DatasetConfig = {
      style: this.graphDataset.style,
      yaxis: this.graphDataset.yaxis,
    }
    const dialogRef = this.dialog.open(ModalEditTimeseriesOptionsComponent, {
      data: {
        config: config,
        handler: this.graphDatasetChanged
      }
    });
    dialogRef.afterClosed().subscribe(options => { })
  }

  jumpToFirstTimeStamp() {
    if (this.description.firstValue) {
      this.selectDate.emit(new Date(this.description.firstValue.timestamp));
    }
  }

  jumpToLastTimeStamp() {
    if (this.description.lastValue) {
      this.selectDate.emit(new Date(this.description.lastValue.timestamp));
    }
  }

  private checkDataInTimespan() {
    if (this.timeInterval && this.description && this.description.firstValue && this.description.lastValue) {
      this.hasData = this.timeSrvc.overlaps(
        this.timeInterval,
        this.description.firstValue.timestamp,
        this.description.lastValue.timestamp
      );
    }
  }

}
