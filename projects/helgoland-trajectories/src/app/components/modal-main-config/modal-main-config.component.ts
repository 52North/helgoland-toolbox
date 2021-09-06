import { Component } from '@angular/core';

import { ConfigurationService } from './../../services/configuration.service';

@Component({
  selector: 'helgoland-trajectories-modal-main-config',
  templateUrl: './modal-main-config.component.html',
  styleUrls: ['./modal-main-config.component.scss']
})
export class ModalMainConfigComponent {

  public languages = this.configSrvc.configuration?.languages;

  constructor(
    private configSrvc: ConfigurationService
  ) { }

}
