import { Component } from '@angular/core';
import { Dataset, DatasetApiInterface, IDataset, InternalIdHandler, ParameterFilter, Timeseries } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../list-entry.component';

@Component({
  selector: 'n52-simple-timeseries-entry',
  templateUrl: './simple-timeseries-entry.component.html',
  styleUrls: ['./simple-timeseries-entry.component.css']
})
export class SimpleTimeseriesEntryComponent extends ListEntryComponent {

  public dataset: IDataset;

  public platformLabel: string;
  public phenomenonLabel: string;
  public procedureLabel: string;
  public categoryLabel: string;
  public uom: string;

  constructor(
    protected api: DatasetApiInterface,
    protected internalIdHandler: InternalIdHandler,
    protected translateSrvc: TranslateService
  ) {
    super(internalIdHandler, translateSrvc);
  }

  protected loadDataset(lang?: string): void {
    const params: ParameterFilter = {};
    if (lang) { params.lang = lang; }
    this.loading = true;
    this.api.getSingleTimeseries(this.internalId.id, this.internalId.url, params)
      .subscribe(
        (timeseries) => this.setDataset(timeseries),
        (error) => {
          this.api.getDataset(this.internalId.id, this.internalId.url, params).subscribe((dataset) => this.setDataset(dataset));
        });
  }

  protected setDataset(timeseries: IDataset) {
    this.dataset = timeseries;
    this.setParameters();
    this.loading = false;
  }

  protected setParameters() {
    if (this.dataset instanceof Dataset) {
      this.platformLabel = this.dataset.parameters.platform.label;
    } else if (this.dataset instanceof Timeseries) {
      this.platformLabel = this.dataset.station.properties.label;
    }
    this.phenomenonLabel = this.dataset.parameters.phenomenon.label;
    this.procedureLabel = this.dataset.parameters.procedure.label;
    this.categoryLabel = this.dataset.parameters.category.label;
    this.uom = this.dataset.uom;
  }
}
