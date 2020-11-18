import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TrajectoriesService } from './services/trajectories.service';

@Component({
  selector: 'helgoland-trajectory-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'helgoland-trajectories';

  constructor(
    private translate: TranslateService
  ) {
    const browserLang = this.translate.getBrowserLang() || 'en';
    this.translate.use(browserLang);
    registerLocaleData(localeDe);
  }

}
