import { Injectable } from '@angular/core';
import { TimezoneService } from '@helgoland/core';
import moment from 'moment';

/**
 * This service formats the time labels for the time axis in d3. Internationalisation will be managed by moment.
 */
@Injectable({
  providedIn: 'root'
})
export class D3TimeFormatLocaleService {

  protected formatMillisecond = '.SSS';
  protected formatSecond = ':ss';
  protected formatMinute = 'HH:mm';
  protected formatHour = 'HH:mm';
  protected formatDay = 'D.MMM';
  protected formatWeek = 'D.MMM';
  protected formatMonth = 'MMM YY';
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

    return this.timezoneSrvc.formatTzDate(moment(time), format);
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
