import { Component } from '@angular/core';

import { appConfig } from '../../app-config';

@Component({
  selector: 'helgoland-trajectories-modal-main-config',
  templateUrl: './modal-main-config.component.html',
  styleUrls: ['./modal-main-config.component.scss']
})
export class ModalMainConfigComponent {

  public languages = appConfig?.languages;

}
