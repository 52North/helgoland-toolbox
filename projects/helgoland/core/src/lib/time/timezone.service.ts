import 'moment-timezone';

import { EventEmitter, Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  private currentTimezone: moment.MomentZone;

  public timezoneChange: EventEmitter<string> = new EventEmitter();

  constructor() {
    this.currentTimezone = moment.tz.zone(moment.tz.guess());
  }

  public setTimezone(tzStr?: string) {
    const tz = moment.tz.zone(tzStr);
    if (tz) {
      this.currentTimezone = tz;
    } else {
      this.currentTimezone = moment.tz.zone(moment.tz.guess());
      console.warn(`Timezone '${tzStr}' is not supported, '${this.currentTimezone.name}' is used instead`);
    }
    moment.tz.setDefault(this.currentTimezone.name);
    this.timezoneChange.emit(this.currentTimezone.name);
  }

  public getTimezoneName(): string {
    return this.currentTimezone.name;
  }

  public formatDate(date: moment.Moment | Date | number, locale?: string, format?: string): string {
    if (typeof (date) === 'number') { date = moment(date); }
    if (date instanceof Date) { date = moment(date); }
    if (locale) { moment.locale(locale); }
    return date.tz(this.currentTimezone.name).format(format);
  }

}
