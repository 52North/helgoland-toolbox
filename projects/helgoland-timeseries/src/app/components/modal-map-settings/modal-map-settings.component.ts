import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BlacklistedService, DatasetApi, DatasetType, HelgolandParameterFilter, HelgolandService } from '@helgoland/core';
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
  standalone: true
})
export class ModalMapSettingsComponent {

  public datasetApis: DatasetApi[];
  public blacklist: BlacklistedService[];

  public filter: HelgolandParameterFilter = { type: DatasetType.Timeseries, expanded: true };

  constructor(
    public dialogRef: MatDialogRef<ModalMapSettingsComponent>,
    private configSrvc: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public mapConfig: MapConfig
  ) {
    this.datasetApis = this.configSrvc.configuration?.datasetApis || [];
    this.blacklist = this.configSrvc.configuration?.providerBlackList || [];
  }

  public serviceSelected(service: HelgolandService) {
    this.mapConfig.selectedService = service;
  }

}
