import { Component } from '@angular/core';

import { versions } from './../../../../../../versions';

@Component({
  selector: 'helgoland-common-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss']
})
export class VersionInfoComponent {

  public versions = versions;

}
