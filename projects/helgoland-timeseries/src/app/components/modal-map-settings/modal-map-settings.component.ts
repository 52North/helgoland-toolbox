import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  BlacklistedService,
  DatasetApi,
  DatasetType,
  HelgolandParameterFilter,
  HelgolandService,
} from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceListSelectorComponent } from 'helgoland-common';

import { ConfigurationService } from '../../services/configuration.service';

export interface MapConfig {
  cluster: boolean;
  selectedService: HelgolandService;
}

@Component({
  selector: 'helgoland-modal-map-settings',
  templateUrl: './modal-map-settings.component.html',
  styleUrls: ['./modal-map-settings.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ServiceListSelectorComponent,
    TranslateModule,
  ],
})
export class ModalMapSettingsComponent {
  protected dialogRef =
    inject<MatDialogRef<ModalMapSettingsComponent>>(MatDialogRef);
  private configSrvc = inject(ConfigurationService);
  protected mapConfig = inject<MapConfig>(MAT_DIALOG_DATA);

  datasetApis: DatasetApi[];
  blacklist: BlacklistedService[];

  filter: HelgolandParameterFilter = {
    type: DatasetType.Timeseries,
    expanded: true,
  };

  constructor() {
    this.datasetApis = this.configSrvc.configuration?.datasetApis || [];
    this.blacklist = this.configSrvc.configuration?.providerBlackList || [];
  }

  serviceSelected(service: HelgolandService) {
    this.mapConfig.selectedService = service;
  }
}
