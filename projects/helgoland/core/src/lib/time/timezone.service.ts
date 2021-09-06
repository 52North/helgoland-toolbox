import 'moment-timezone';

import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  private currentTimezone: moment.MomentZone;

  private offsetToLocale: number; // TODO: check if still needed

  public timezoneChange: EventEmitter<string> = new EventEmitter();

  constructor(
    protected translateSrvc: TranslateService
  ) {
    this.currentTimezone = moment.tz.zone(moment.tz.guess());
    this.calcOffset();
  }

  public setTimezone(tzStr?: string) {
    const tz = moment.tz.zone(tzStr);
    if (tz) {
      this.currentTimezone = tz;
    } else {
      this.currentTimezone = moment.tz.zone(moment.tz.guess());
      console.warn(`Timezone '${tzStr}' is not supported, '${this.currentTimezone.name}' is used instead`);
    }
    this.calcOffset();
    moment.tz.setDefault(this.currentTimezone.name);
    this.timezoneChange.emit(this.currentTimezone.name);
  }

  private calcOffset() {
    const date = new Date().getTime();
    this.offsetToLocale = -1 * moment.tz.zone(moment.tz.guess()).utcOffset(date) + this.currentTimezone.utcOffset(date);
  }

  public getTimezoneName(): string {
    return this.currentTimezone.name;
  }

  public formatTzDate(date: moment.Moment | Date | number | string, format?: string): string {
    if (typeof (date) === 'number') { date = moment(date); }
    if (typeof (date) === 'string') { date = moment(date); }
    if (date instanceof Date) { date = moment(date); }
    if (this.translateSrvc.currentLang) { moment.locale(this.translateSrvc.currentLang); }
    if (!format) { format = 'L LT z'; }
    return date.tz(this.currentTimezone.name).format(format);
  }

  public createTzDate(m: moment.MomentInput): moment.Moment {
    return moment(m).tz(this.getTimezoneName());
  }

  public getOffsetToLocaleInMs() {
    return this.offsetToLocale * 1000 * 60;
  }

  public getOffsetToLocaleInHours() {
    return this.offsetToLocale / 60;
  }

}
