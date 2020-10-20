import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'helgoland';

  constructor(
    private translate: TranslateService
  ) {
    translate.use('de');
    registerLocaleData(localeDe);
  }
}
