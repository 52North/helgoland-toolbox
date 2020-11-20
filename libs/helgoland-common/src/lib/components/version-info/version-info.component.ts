import { Component } from '@angular/core';

import { LayoutModeService } from '../../services/layout-mode.service';
import { versions } from './../../../../../../versions';

@Component({
  selector: 'helgoland-common-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss']
})
export class VersionInfoComponent {

  public versions = versions;

  private clickCounter = 0;

  constructor(
    private layout: LayoutModeService
  ) { }

  count() {
    this.clickCounter++;
    if (this.clickCounter >= 7) {
      this.layout.toggleDarkMode();
    }
  }

}
