import { Component } from '@angular/core';

import { versions } from '../../../../environments/versions';

@Component({
  selector: 'helgoland-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss']
})
export class VersionInfoComponent {

  public versions = versions;

}
