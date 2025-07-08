import { Component, OnInit, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutModeService } from '../../services/layout-mode.service';

@Component({
  selector: 'helgoland-common-dark-mode-button',
  templateUrl: './dark-mode-button.component.html',
  styleUrls: ['./dark-mode-button.component.scss'],
  imports: [TranslateModule, MatSlideToggleModule],
})
export class DarkModeButtonComponent implements OnInit {
  private layout = inject(LayoutModeService);

  public darkModeActive: boolean | undefined;

  ngOnInit() {
    this.darkModeActive = this.layout.isDarkModeActive();
  }

  toggleMode() {
    this.darkModeActive = this.layout.toggleDarkMode();
  }
}
