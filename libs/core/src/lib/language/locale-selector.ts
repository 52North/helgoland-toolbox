import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from './model/language';

@Directive()
export abstract class LocalSelectorComponent implements OnChanges {

    @Input()
    public languageList: Language[];

    public currentLang: Language;

    constructor(
        protected translate: TranslateService
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.languageList) {
            this.setCurrentLang();
        }
    }

    public setLanguage(lang: Language) {
        this.translate.use(lang.code);
        this.setCurrentLang();
    }

    private setCurrentLang() {
        this.currentLang = this.languageList.find((e) => e.code === this.translate.currentLang);
    }

}
