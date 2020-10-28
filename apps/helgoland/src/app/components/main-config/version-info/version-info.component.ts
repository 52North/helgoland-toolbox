import { Component } from '@angular/core';

import { versions } from '../../../../environments/versions';
import { LayoutModeService } from './../../../services/layout-mode.service';

@Component({
  selector: 'helgoland-version-info',
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
