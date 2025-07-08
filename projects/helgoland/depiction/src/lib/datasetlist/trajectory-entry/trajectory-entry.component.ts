import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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

  @Input()
  public datasetOptions: DatasetOptions | undefined;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

  public dataset: HelgolandTrajectory | undefined;

  public tempColor: string | undefined;

  public toggleVisibility() {
    if (this.datasetOptions) {
      this.datasetOptions.visible = !this.datasetOptions.visible;
      this.onUpdateOptions.emit(this.datasetOptions);
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
