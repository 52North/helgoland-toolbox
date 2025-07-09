import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, output, input } from '@angular/core';
import {
  DatasetFilter,
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTrajectory,
  InternalDatasetId,
} from '@helgoland/core';

import { ListEntryComponent } from '../list-entry.component';

@Component({
  selector: 'n52-trajectory-entry',
  templateUrl: './trajectory-entry.component.html',
  imports: [NgClass, NgStyle],
})
export class TrajectoryEntryComponent extends ListEntryComponent {
  protected servicesConnector = inject(HelgolandServicesConnector);

  public readonly datasetOptions = input<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onUpdateOptions = output<DatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onEditOptions = output<DatasetOptions>();

  public dataset: HelgolandTrajectory | undefined;

  public tempColor: string | undefined;

  public toggleVisibility() {
    const datasetOptions = this.datasetOptions();
    if (datasetOptions) {
      datasetOptions.visible = !datasetOptions.visible;
      this.onUpdateOptions.emit(datasetOptions);
    }
  }

  public editDatasetOptions(options: DatasetOptions) {
    this.onEditOptions.emit(options);
  }

  protected loadDataset(internalId: InternalDatasetId, locale?: string): void {
    const params: DatasetFilter = {};
    if (locale) {
      params.locale = locale;
    }
    this.loading = true;
    this.servicesConnector
      .getDataset(internalId, { ...params, type: DatasetType.Trajectory })
      .subscribe({
        next: (trajectory) => this.setTrajectory(trajectory),
        error: (error) => this.handleTrajectoryLoadError(error),
      });
  }

  protected handleTrajectoryLoadError(error: any): void {
    console.error(error);
    this.loading = false;
  }

  protected setTrajectory(trajectory: HelgolandTrajectory) {
    this.dataset = trajectory;
    this.loading = false;
  }
}
