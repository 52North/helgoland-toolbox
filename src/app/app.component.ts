import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Language, StatusCheckService } from '@helgoland/core';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { TimezoneSelectorComponent } from './components/timezone-selector/timezone-selector.component';

@Component({
  selector: 'n52-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    LocalSelectorImplComponent,
    TimezoneSelectorComponent,
    RouterModule,
    MatSidenavModule,
    MatListModule,
  ],
  standalone: true
})
export class AppComponent {

  public languageList: Language[];

  constructor(
    translate: TranslateService,
    status: StatusCheckService,
    d3translate: D3TimeFormatLocaleService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');

    status.checkAll().subscribe((res) => res.forEach((entry) => console.log(entry)));

    // necessary to load information on e.g. what 'medium' date format should look like in German etc.
    registerLocaleData(localeDe);

    this.languageList = [
      {
        label: 'Deutsch',
        code: 'de'
      },
      {
        label: 'English',
        code: 'en'
      }
    ];

    // d3translate.addTimeFormatLocale('de',
    //   {
    //     'dateTime': '%a %b %e %X %Y',
    //     'date': '%d-%m-%Y',
    //     'time': '%H:%M:%S',
    //     'periods': ['AM', 'PM'],
    //     'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    //     'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    //     'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    //     'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    //   }
    // );

  }
}
