import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from './model/language';

@Directive()
export abstract class LocalSelectorComponent implements OnChanges {
  protected translate = inject(TranslateService);

  @Input()
  public languageList: Language[] | undefined;

  public currentLang: Language | undefined;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['languageList']) {
      this.updateCurrentLang();
    }
  }

  public setLanguage(lang: Language) {
    this.translate.use(lang.code).subscribe(() => this.updateCurrentLang());
  }

  protected updateCurrentLang() {
    this.currentLang = this.languageList?.find(
      (e) => e.code === this.translate.currentLang,
    );
  }
}
