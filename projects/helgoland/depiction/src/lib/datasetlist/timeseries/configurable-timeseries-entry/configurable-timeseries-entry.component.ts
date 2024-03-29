import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DatasetOptions,
  HelgolandServicesConnector,
  InternalIdHandler,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

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

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onShowGeometry: EventEmitter<GeoJSON.GeoJsonObject> =
    new EventEmitter();

  constructor(
    protected override servicesConnector: HelgolandServicesConnector,
    protected override internalIdHandler: InternalIdHandler,
    protected override translateSrvc: TranslateService,
  ) {
    super(servicesConnector, internalIdHandler, translateSrvc);
  }

  public toggleVisibility() {
    this.datasetOptions.visible = !this.datasetOptions.visible;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

  public editDatasetOptions() {
    this.onEditOptions.emit(this.datasetOptions);
  }

  public showGeometry() {
    if (this.dataset) {
      this.onShowGeometry.emit(this.dataset.platform.geometry);
    }
  }
}
