import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { appConfig } from './../../../app-config';

@Component({
  selector: 'helgoland-toolbox-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent extends LocalSelectorComponent {

  constructor(
    protected translate: TranslateService,
  ) { 
    super(translate);
    if (appConfig.languages) {
      this.languageList = appConfig.languages;
      this.updateCurrentLang();
    }
  }
  
}
