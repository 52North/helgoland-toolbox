import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'date',
    pure: false
})
export class DateProxyPipe implements PipeTransform {

    constructor(
        protected translate: TranslateService
    ) { }

    public transform(value: any, pattern: string = 'mediumDate'): any {
        // simply forward to built-in pipe, but take into account the current language
        const builtinDatePipe = new DatePipe(this.translate.currentLang || 'en');
        try {
            return builtinDatePipe.transform(value, pattern);
        } catch (error) {
            console.error(error);
            return new DatePipe('en').transform(value, pattern);
        }
    }

}
