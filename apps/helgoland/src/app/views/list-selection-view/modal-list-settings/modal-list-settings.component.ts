import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatasetApi, HelgolandService } from '@helgoland/core';

import { ConfigurationService } from './../../../services/configuration.service';

export interface ListConfig {
  selectedService: HelgolandService;
}

@Component({
  selector: 'helgoland-modal-list-settings',
  templateUrl: './modal-list-settings.component.html',
  styleUrls: ['./modal-list-settings.component.scss']
})
export class ModalListSettingsComponent {

  public datasetApis: DatasetApi[];

  constructor(
    public dialogRef: MatDialogRef<ModalListSettingsComponent>,
    private configSrvc: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public listConfig: ListConfig
  ) {
    this.datasetApis = this.configSrvc.configuration?.datasetApis;
  }

  public serviceSelected(service: HelgolandService) {
    this.listConfig.selectedService = service;
  }
}
