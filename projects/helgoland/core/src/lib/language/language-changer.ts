import { TranslateService } from '@ngx-translate/core';

export abstract class LanguageChangNotifier {
  constructor(protected translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => this.languageChanged());
  }

  protected abstract languageChanged(): void;
}
