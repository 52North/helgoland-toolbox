import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  DatasetFilter,
  DatasetType,
  HelgolandLocatedProfileData,
  HelgolandProfile,
  HelgolandServicesConnector,
  InternalDatasetId,
  TimedDatasetOptions,
  Timespan,
  TzDatePipe,
} from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { LabelMapperComponent } from '../../label-mapper/label-mapper.component';
import { ListEntryComponent } from '../list-entry.component';

@Component({
  selector: 'n52-profile-entry',
  templateUrl: './profile-entry.component.html',
  styleUrls: ['./profile-entry.component.scss'],
  imports: [
    NgClass,
    LabelMapperComponent,
    NgStyle,
    TranslateModule,
    TzDatePipe,
  ],
})
export class ProfileEntryComponent extends ListEntryComponent {
  protected servicesConnector = inject(HelgolandServicesConnector);

  readonly datasetOptions = input<TimedDatasetOptions[]>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onUpdateOptions = output<TimedDatasetOptions[]>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onDeleteDatasetOptions = output<TimedDatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onEditOptions = output<TimedDatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onOpenInCombiView = output<TimedDatasetOptions>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onShowGeometry = output<GeoJSON.GeoJsonObject>();

  dataset: HelgolandProfile | undefined;

  editableOptions: TimedDatasetOptions | undefined;
  tempColor: string | undefined;

  removeDatasetOptions(options: TimedDatasetOptions) {
    this.onDeleteDatasetOptions.emit(options);
  }

  editDatasetOptions(options: TimedDatasetOptions) {
    this.onEditOptions.emit(options);
  }

  toggleVisibility(options: TimedDatasetOptions) {
    options.visible = !options.visible;
    const datasetOptions = this.datasetOptions();
    if (datasetOptions) {
      this.onUpdateOptions.emit(datasetOptions);
    }
  }

  openInCombiView(option: TimedDatasetOptions) {
    this.onOpenInCombiView.emit(option);
  }

  showGeometry(dataset: HelgolandProfile, option: TimedDatasetOptions) {
    const internalId = this.internalIdHandler.resolveInternalId(
      this.datasetId(),
    );
    if (dataset.isMobile) {
      const timespan = new Timespan(option.timestamp);
      this.servicesConnector
        .getDatasetData(dataset, timespan)
        .subscribe((result) => {
          if (
            result.values.length === 1 &&
            result instanceof HelgolandLocatedProfileData
          ) {
            this.onShowGeometry.emit(result.values[0].geometry);
          }
        });
    } else if (dataset.parameters.platform) {
      this.servicesConnector
        .getPlatform(dataset.parameters.platform.id, internalId.url)
        .subscribe((station) => {
          if (station.geometry) {
            this.onShowGeometry.emit(station.geometry);
          }
        });
    }
  }

  protected loadDataset(internalId: InternalDatasetId, locale?: string) {
    const params: DatasetFilter = {};
    if (locale) {
      params.locale = locale;
    }
    this.loading = true;
    this.servicesConnector
      .getDataset(internalId, { ...params, type: DatasetType.Profile })
      .subscribe({
        next: (dataset) => (this.dataset = dataset),
        error: (error) => console.error(error),
        complete: () => (this.loading = false),
      });
  }
}
