import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlacklistedService, DatasetApi, DatasetType, HelgolandParameterFilter, HelgolandService } from '@helgoland/core';

import { appConfig } from './../../app-config';

export interface MapConfig {
  cluster: boolean;
  selectedService: HelgolandService;
}

@Component({
  selector: 'helgoland-modal-map-settings',
  templateUrl: './modal-map-settings.component.html',
  styleUrls: ['./modal-map-settings.component.scss']
})
export class ModalMapSettingsComponent {

  public datasetApis: DatasetApi[];
  public blacklist: BlacklistedService[];

  public filter: HelgolandParameterFilter = { type: DatasetType.Timeseries, expanded: true };

  constructor(
    public dialogRef: MatDialogRef<ModalMapSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public mapConfig: MapConfig
  ) {
    this.datasetApis = appConfig.datasetApis;
    this.blacklist = appConfig.providerBlackList;
  }

  public serviceSelected(service: HelgolandService) {
    this.mapConfig.selectedService = service;
  }

}
