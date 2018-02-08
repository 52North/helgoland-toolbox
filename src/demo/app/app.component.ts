import { Component } from '@angular/core';
import { Language } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public languageList: Language[];

    constructor(
        translate: TranslateService
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

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
    }
}
