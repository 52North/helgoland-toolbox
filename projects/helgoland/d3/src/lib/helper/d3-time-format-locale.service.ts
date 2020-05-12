import { Injectable } from '@angular/core';
import { TimezoneService } from '@helgoland/core';
import moment from 'moment';

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

  protected formatMillisecond = '.SSS';
  protected formatSecond = ':ss';
  protected formatMinute = 'HH:mm';
  protected formatHour = 'HH:mm';
  protected formatDay = 'MMM D';
  protected formatWeek = 'MMM D';
  protected formatMonth = 'MMMM';
  protected formatYear = 'YYYY';

  constructor(
    protected timezoneSrvc: TimezoneService
  ) { }

  public formatTime(time: number): string {
    const curr = this.timezoneSrvc.createTzDate(time);

    const format = this.roundSecond(time) < curr ? this.formatMillisecond
      : this.roundMinute(time) < curr ? this.formatSecond
        : this.roundHour(time) < curr ? this.formatMinute
          : this.roundDay(time) < curr ? this.formatHour
            : this.roundMonth(time) < curr ? (this.roundWeek(time) < curr ? this.formatDay : this.formatWeek)
              : this.roundYear(time) < curr ? this.formatMonth
                : this.formatYear;

    return moment(time).tz(this.timezoneSrvc.getTimezoneName()).format(format);
  }

  private roundMinute(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('minute');
  }

  private roundSecond(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('second');
  }

  private roundYear(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('year');
  }

  private roundMonth(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('month');
  }

  private roundWeek(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('week');
  }

  private roundHour(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('hour');
  }

  private roundDay(time: number) {
    return this.timezoneSrvc.createTzDate(time).startOf('day');
  }

}
