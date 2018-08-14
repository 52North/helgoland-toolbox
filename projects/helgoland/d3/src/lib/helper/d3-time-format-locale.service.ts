import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { timeFormat, timeFormatLocale, TimeLocaleDefinition } from 'd3';

/**
 * This service holds the translations for d3 charts time axis labels.
 * Add a new translation with the method 'addTimeFormatLocale' like this sample:
 *
 * addTimeFormatLocale('de',
 * {
 *   'dateTime': '%a %b %e %X %Y',
 *   'date': '%d-%m-%Y',
 *   'time': '%H:%M:%S',
 *   'periods': ['AM', 'PM'],
 *   'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
 *   'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
 *   'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
 *   'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
 * })
 *
 */
@Injectable({
  providedIn: 'root'
})
export class D3TimeFormatLocaleService {

  private timeFormatLocaleMapper: Map<string, TimeLocaleDefinition> = new Map();

  constructor(
    private translateService: TranslateService
  ) { }

  public addTimeFormatLocale(localeCode: string, definition: TimeLocaleDefinition) {
    this.timeFormatLocaleMapper.set(localeCode, definition);
  }

  public getTimeLocale(specifier: string): (date: Date) => string {
    const langCode = this.translateService.currentLang;
    if (this.timeFormatLocaleMapper.has(langCode)) {
      return timeFormatLocale(this.timeFormatLocaleMapper.get(langCode)).format(specifier);
    } else {
      return timeFormat(specifier);
    }
  }
}
