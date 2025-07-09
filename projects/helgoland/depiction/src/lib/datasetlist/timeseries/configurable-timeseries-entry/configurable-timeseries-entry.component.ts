import { Component, input, output } from '@angular/core';
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
  public readonly datasetOptions = input.required<DatasetOptions>();

  public readonly highlight = input<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onUpdateOptions = output<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onEditOptions = output<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onShowGeometry = output<GeoJSON.GeoJsonObject>();

  public toggleVisibility() {
    const datasetOptions = this.datasetOptions();
    datasetOptions.visible = !datasetOptions.visible;
    this.onUpdateOptions.emit(datasetOptions);
  }

  public editDatasetOptions() {
    this.onEditOptions.emit(this.datasetOptions());
  }

  public showGeometry() {
    if (this.dataset?.platform.geometry) {
      this.onShowGeometry.emit(this.dataset.platform.geometry);
    }
  }
}
