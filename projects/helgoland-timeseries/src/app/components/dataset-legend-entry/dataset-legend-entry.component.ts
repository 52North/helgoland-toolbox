import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Time, TimeInterval } from '@helgoland/core';
import { DatasetEntry } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

import {
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

  @Input() dataset: DatasetEntry;

  @Input() selected: boolean;

  @Input() timeInterval: TimeInterval;

  @Output() datasetDeleted: EventEmitter<void> = new EventEmitter();

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
    this.dataset.selected = !this.dataset.selected;
  }

  toggleVisibility() {
    this.dataset.visible = !this.dataset.visible;
  }

  editDatasetOptions() {
    const dialogRef = this.dialog.open(ModalEditTimeseriesOptionsComponent, {
      data: {
        dataset: this.dataset
      }
    });
  }

  jumpToFirstTimeStamp() {
    if (this.dataset.description.firstValue) {
      this.selectDate.emit(new Date(this.dataset.description.firstValue.timestamp));
    }
  }

  jumpToLastTimeStamp() {
    if (this.dataset.description.lastValue) {
      this.selectDate.emit(new Date(this.dataset.description.lastValue.timestamp));
    }
  }

  private checkDataInTimespan() {
    if (this.timeInterval && this.dataset.description && this.dataset.description.firstValue && this.dataset.description.lastValue) {
      this.hasData = this.timeSrvc.overlaps(
        this.timeInterval,
        this.dataset.description.firstValue.timestamp,
        this.dataset.description.lastValue.timestamp
      );
    }
  }

}
