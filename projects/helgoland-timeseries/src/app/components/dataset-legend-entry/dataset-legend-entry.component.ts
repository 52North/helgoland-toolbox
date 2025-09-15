import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelgolandCoreModule, Time, TimeInterval } from '@helgoland/core';
import { AreaDatasetChild, SeriesGraphDataset, TimeseriesChild } from '@helgoland/d3';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingOverlayProgressBarComponent } from 'helgoland-common';

import { FavoriteToggleButtonComponent } from '../favorites/favorite-toggle-button/favorite-toggle-button.component';
import { ModalEditTimeseriesOptionsComponent } from '../modal-edit-timeseries-options/modal-edit-timeseries-options.component';
import { TimeseriesEntrySymbolComponent } from '../timeseries-entry-symbol/timeseries-entry-symbol.component';

@Component({
  selector: 'helgoland-dataset-legend-entry',
  templateUrl: './dataset-legend-entry.component.html',
  styleUrls: ['./dataset-legend-entry.component.scss'],
  imports: [
    CommonModule,
    FavoriteToggleButtonComponent,
    HelgolandLabelMapperModule,
    HelgolandCoreModule,
    LoadingOverlayProgressBarComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TimeseriesEntrySymbolComponent,
    TranslateModule,
  ],
})
export class DatasetLegendEntryComponent {
  protected translateSrvc = inject(TranslateService);
  protected timeSrvc = inject(Time);
  private dialog = inject(MatDialog);

  // Remove later:
  error = false;
  // loading = false;
  //

  readonly dataset = input.required<SeriesGraphDataset>();

  readonly selected = input.required<boolean>();

  readonly timeInterval = input.required<TimeInterval | undefined>();

  readonly datasetDeleted = output<void>();

  readonly selectDate = output<Date>();

  hasData = true;

  constructor() {
    effect(() => this.checkDataInTimespan());
  }

  removeDataset() {
    this.datasetDeleted.emit();
  }

  toggleSelection() {
    this.dataset().setSelected(!this.dataset().selected);
  }

  toggleVisibility() {
    this.dataset().setVisible(!this.dataset().visible);
  }

  editDatasetOptions() {
    const dialogRef = this.dialog.open(ModalEditTimeseriesOptionsComponent, {
      data: {
        dataset: this.dataset(),
      },
    });
  }

  toggleSeparateYAxis() {
    const yAxis = this.dataset().yAxis;
    yAxis.separate = !yAxis.separate;
    this.dataset().setYAxis(yAxis);
  }

  jumpToFirstTimeStamp() {
    const dataset = this.dataset();
    if (dataset.description.firstValue) {
      this.selectDate.emit(new Date(dataset.description.firstValue.timestamp));
    }
  }

  jumpToLastTimeStamp() {
    const dataset = this.dataset();
    if (dataset.description.lastValue) {
      this.selectDate.emit(new Date(dataset.description.lastValue.timestamp));
    }
  }

  getTimeseriesDatasetChildren() {
    return this.dataset().children.filter((e) => e instanceof TimeseriesChild);
  }

  getAreaDatasetChildren() {
    return this.dataset().children.filter((e) => e instanceof AreaDatasetChild);
  }

  private checkDataInTimespan() {
    const dataset = this.dataset();
    const timeInterval = this.timeInterval();
    if (
      timeInterval &&
      dataset.description &&
      dataset.description.firstValue &&
      dataset.description.lastValue
    ) {
      this.hasData = this.timeSrvc.overlaps(
        timeInterval,
        dataset.description.firstValue.timestamp,
        dataset.description.lastValue.timestamp,
      );
    }
  }
}
