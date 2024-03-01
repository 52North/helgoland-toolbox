import { Component } from '@angular/core';
import {
  DatasetFilter,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  InternalIdHandler,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../../list-entry.component';

/**
 * Implements the abstract ListEntryComponent, which has the following functions:
 *  - can be selected and is selectable internally, with a corresponding output event
 *  - can be deleted, which also triggers an output event
 *  - translatable, so it triggers the methode onLanguageChanged when the language is switched
 */
@Component({
  selector: 'n52-simple-timeseries-entry',
  templateUrl: './simple-timeseries-entry.component.html',
  styleUrls: ['./simple-timeseries-entry.component.css']
})
export class SimpleTimeseriesEntryComponent extends ListEntryComponent {

  public dataset: HelgolandTimeseries;

  public platformLabel: string;
  public phenomenonLabel: string;
  public procedureLabel: string;
  public categoryLabel: string;
  public uom: string;
  public error: any;

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected override internalIdHandler: InternalIdHandler,
    protected override translateSrvc: TranslateService
  ) {
    super(internalIdHandler, translateSrvc);
  }

  protected loadDataset(locale?: string): void {
    const params: DatasetFilter = {};
    if (locale) { params.locale = locale; }
    this.loading = true;
    this.servicesConnector.getDataset(this.internalId, { ...params, type: DatasetType.Timeseries })
      .subscribe(
        dataset => this.setDataset(dataset),
        error => this.handleError(error)
      );
  }

  protected handleError(error: any) {
    this.loading = false;
    this.error = error;
  }

  protected setDataset(timeseries: HelgolandTimeseries) {
    this.dataset = timeseries;
    this.setParameters();
    this.loading = false;
  }

  protected setParameters() {
    this.platformLabel = this.dataset.platform.label;
    this.phenomenonLabel = this.dataset.parameters.phenomenon.label;
    this.procedureLabel = this.dataset.parameters.procedure.label;
    this.categoryLabel = this.dataset.parameters.category.label;
    this.uom = this.dataset.uom;
  }
}
