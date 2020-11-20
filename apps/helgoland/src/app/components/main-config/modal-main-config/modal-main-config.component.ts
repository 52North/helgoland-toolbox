import { appConfig } from './../../../app-config';
import { Component } from '@angular/core';

@Component({
  selector: 'helgoland-modal-main-config',
  templateUrl: './modal-main-config.component.html',
  styleUrls: ['./modal-main-config.component.scss']
})
export class ModalMainConfigComponent { 

  public languages = appConfig.languages;

}
