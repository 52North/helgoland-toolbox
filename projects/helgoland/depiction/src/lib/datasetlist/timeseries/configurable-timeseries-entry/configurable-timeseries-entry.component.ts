import { Component, Input, output } from '@angular/core';
import { DatasetOptions } from '@helgoland/core';

import { SimpleTimeseriesEntryComponent } from '../simple-timeseries-entry/simple-timeseries-entry.component';

/**
 * Extends the SimpleTimeseriesEntryComponent, with the following functions:
 *  - dataset options and triggers the editation of the dataset options
 *  - triggers the show geometry event
 */
@Component({
  selector: 'n52-configurable-timeseries-entry',
  templateUrl: './configurable-timeseries-entry.component.html',
  styleUrls: ['./configurable-timeseries-entry.component.css'],
  standalone: true,
})
export class ConfigurableTimeseriesEntryComponent extends SimpleTimeseriesEntryComponent {
  @Input({ required: true })
  public datasetOptions!: DatasetOptions;

  @Input()
  public highlight: boolean | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onUpdateOptions = output<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onEditOptions = output<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onShowGeometry = output<GeoJSON.GeoJsonObject>();

  public toggleVisibility() {
    this.datasetOptions.visible = !this.datasetOptions.visible;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

  public editDatasetOptions() {
    this.onEditOptions.emit(this.datasetOptions);
  }

  public showGeometry() {
    if (this.dataset?.platform.geometry) {
      this.onShowGeometry.emit(this.dataset.platform.geometry);
    }
  }
}
