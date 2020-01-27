import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatasetOptions, HelgolandServicesHandlerService, InternalIdHandler } from '@helgoland/core';
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
  styleUrls: ['./configurable-timeseries-entry.component.css']
})
export class ConfigurableTimeseriesEntryComponent extends SimpleTimeseriesEntryComponent {

  @Input()
  public datasetOptions: DatasetOptions;

  @Input()
  public highlight: boolean;

  @Output()
  public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  @Output()
  public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  @Output()
  public onShowGeometry: EventEmitter<GeoJSON.GeoJsonObject> = new EventEmitter();

  constructor(
    protected servicesHandler: HelgolandServicesHandlerService,
    protected internalIdHandler: InternalIdHandler,
    protected translateSrvc: TranslateService
  ) {
    super(servicesHandler, internalIdHandler, translateSrvc);
  }

  public toggleVisibility() {
    this.datasetOptions.visible = !this.datasetOptions.visible;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

  public editDatasetOptions() {
    this.onEditOptions.emit(this.datasetOptions);
  }

  public showGeometry() {
    this.onShowGeometry.emit(this.dataset.platform.geometry);
  }

}
