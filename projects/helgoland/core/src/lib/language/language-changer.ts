import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export abstract class LanguageChangNotifier {
  protected translate = inject(TranslateService);

  constructor() {
    this.translate.onLangChange.subscribe(() => this.languageChanged());
  }

  protected abstract languageChanged(): void;
}
