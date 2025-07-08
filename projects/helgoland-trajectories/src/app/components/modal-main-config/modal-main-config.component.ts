import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  ClearStorageButtonComponent,
  DarkModeButtonComponent,
  LanguageSelectorComponent,
  VersionInfoComponent,
} from 'helgoland-common';

import { ConfigurationService } from './../../services/configuration.service';

@Component({
  selector: 'helgoland-trajectories-modal-main-config',
  templateUrl: './modal-main-config.component.html',
  styleUrls: ['./modal-main-config.component.scss'],
  imports: [
    ClearStorageButtonComponent,
    DarkModeButtonComponent,
    LanguageSelectorComponent,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    VersionInfoComponent,
  ],
})
export class ModalMainConfigComponent {
  private configSrvc = inject(ConfigurationService);

  public languages = this.configSrvc.configuration?.languages;
}
