import { Component, OnInit } from '@angular/core';

import { LayoutModeService } from '../../services/layout-mode.service';

@Component({
  selector: 'helgoland-common-dark-mode-button',
  templateUrl: './dark-mode-button.component.html',
  styleUrls: ['./dark-mode-button.component.scss']
})
export class DarkModeButtonComponent implements OnInit {

  public darkModeActive: boolean;

  constructor(
    private layout: LayoutModeService
  ) { }

  ngOnInit() {
    this.darkModeActive = this.layout.isDarkModeActive();
  }

  toggleMode() {
    this.darkModeActive = this.layout.toggleDarkMode();
  }

}
