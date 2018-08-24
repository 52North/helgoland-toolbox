import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dataset, DatasetApiInterface, DatasetOptions, InternalIdHandler, Timeseries } from '@helgoland/core';
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
    protected api: DatasetApiInterface,
    protected internalIdHandler: InternalIdHandler,
    protected translateSrvc: TranslateService
  ) {
    super(api, internalIdHandler, translateSrvc);
  }

  public toggleVisibility() {
    this.datasetOptions.visible = !this.datasetOptions.visible;
    this.onUpdateOptions.emit(this.datasetOptions);
  }

  public editDatasetOptions() {
    this.onEditOptions.emit(this.datasetOptions);
  }

  public showGeometry() {
    if (this.dataset instanceof Timeseries) {
      this.onShowGeometry.emit(this.dataset.station.geometry);
    }
    if (this.dataset instanceof Dataset) {
      this.api.getPlatform(this.dataset.parameters.platform.id, this.dataset.url).subscribe((platform) => {
        this.onShowGeometry.emit(platform.geometry);
      });
    }
  }

}
