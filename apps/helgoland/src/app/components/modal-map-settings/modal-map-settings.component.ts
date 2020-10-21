import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatasetApi, HelgolandService } from '@helgoland/core';

import { appConfig } from './../../app-config';

export interface MapConfig {
  cluster: boolean;
  selectedService: HelgolandService;
}

@Component({
  selector: 'helgoland-toolbox-modal-map-settings',
  templateUrl: './modal-map-settings.component.html',
  styleUrls: ['./modal-map-settings.component.scss']
})
export class ModalMapSettingsComponent {

  public datasetApis: DatasetApi[];

  constructor(
    public dialogRef: MatDialogRef<ModalMapSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public mapConfig: MapConfig
  ) {
    this.datasetApis = appConfig.datasetApis;
  }

  public serviceSelected(service: HelgolandService) {
    this.mapConfig.selectedService = service;
  }

}
