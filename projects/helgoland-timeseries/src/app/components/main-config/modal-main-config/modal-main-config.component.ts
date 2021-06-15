import { Component } from '@angular/core';

import { ConfigurationService } from './../../../services/configuration.service';

@Component({
  selector: 'helgoland-modal-main-config',
  templateUrl: './modal-main-config.component.html',
  styleUrls: ['./modal-main-config.component.scss']
})
export class ModalMainConfigComponent {

  public languages = this.config.configuration?.languages;

  constructor(
    private config: ConfigurationService
  ) { }

}
