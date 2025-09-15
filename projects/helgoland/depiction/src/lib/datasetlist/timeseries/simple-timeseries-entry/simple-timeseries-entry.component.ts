import { Component, inject } from '@angular/core';
import {
  DatasetFilter,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  InternalDatasetId,
} from '@helgoland/core';

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
  styleUrls: ['./simple-timeseries-entry.component.css'],
  standalone: true,
})
export class SimpleTimeseriesEntryComponent extends ListEntryComponent {
  protected servicesConnector = inject(HelgolandServicesConnector);

  dataset: HelgolandTimeseries | undefined;

  platformLabel: string | undefined;
  phenomenonLabel: string | undefined;
  procedureLabel: string | undefined;
  categoryLabel: string | undefined;
  uom: string | undefined;
  error: any;

  protected loadDataset(internalId: InternalDatasetId, locale?: string): void {
    const params: DatasetFilter = {};
    if (locale) {
      params.locale = locale;
    }
    this.loading = true;
    this.servicesConnector
      .getDataset(internalId, { ...params, type: DatasetType.Timeseries })
      .subscribe({
        next: (dataset) => this.setDataset(dataset),
        error: (error) => this.handleError(error),
      });
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
    if (this.dataset) {
      this.platformLabel = this.dataset.platform.label;
      this.phenomenonLabel = this.dataset.parameters.phenomenon?.label;
      this.procedureLabel = this.dataset.parameters.procedure?.label;
      this.categoryLabel = this.dataset.parameters.category
        ?.map((e) => e.label)
        .join(', ');
      this.uom = this.dataset.uom;
    }
  }
}
