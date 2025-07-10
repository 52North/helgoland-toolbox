import {
  Directive,
  OnChanges,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from './model/language';

@Directive()
export abstract class LocalSelectorComponent implements OnChanges {
  protected translate = inject(TranslateService);

  readonly languageList = input<Language[]>();

  currentLang: Language | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['languageList']) {
      this.updateCurrentLang();
    }
  }

  setLanguage(lang: Language) {
    this.translate.use(lang.code).subscribe(() => this.updateCurrentLang());
  }

  protected updateCurrentLang() {
    this.currentLang = this.languageList()?.find(
      (e) => e.code === this.translate.currentLang,
    );
  }
}
