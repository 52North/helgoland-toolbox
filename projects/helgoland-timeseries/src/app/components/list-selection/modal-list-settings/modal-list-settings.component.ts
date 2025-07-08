import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatasetApi, HelgolandService } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceListSelectorComponent } from 'helgoland-common';

import { ConfigurationService } from './../../../services/configuration.service';

export interface ListConfig {
  selectedService: HelgolandService;
}

@Component({
  selector: 'helgoland-modal-list-settings',
  templateUrl: './modal-list-settings.component.html',
  styleUrls: ['./modal-list-settings.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    ServiceListSelectorComponent,
    TranslateModule,
  ],
})
export class ModalListSettingsComponent {
  protected dialogRef =
    inject<MatDialogRef<ModalListSettingsComponent>>(MatDialogRef);
  private configSrvc = inject(ConfigurationService);
  protected listConfig = inject<ListConfig>(MAT_DIALOG_DATA);

  public datasetApis: DatasetApi[] = [];

  constructor() {
    if (this.configSrvc.configuration?.datasetApis) {
      this.datasetApis = this.configSrvc.configuration?.datasetApis;
    }
  }

  public serviceSelected(service: HelgolandService) {
    this.listConfig.selectedService = service;
  }
}
