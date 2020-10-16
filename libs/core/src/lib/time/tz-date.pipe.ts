import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { TimezoneService } from './timezone.service';

@Pipe({
  name: 'tzDate',
  pure: false
})
export class TzDatePipe implements PipeTransform, OnDestroy {

  date: Date | number;
  format: string;
  formattedDate: string = '';
  onTimezoneChanged: Subscription;
  onTranslationChanged: Subscription;

  constructor(
    private timezoneSrvc: TimezoneService,
    private translateSrvc: TranslateService
  ) { }

  transform(date: Date | number, ...args: any[]): any {
    if (!date) {
      return date;
    }

    this.date = date;

    if (args && args.length > 0) {
      this.format = args[0];
    }

    this.updateDate();

    if (!this.onTimezoneChanged) {
      this.onTimezoneChanged = this.timezoneSrvc.timezoneChange.subscribe(() => this.updateDate());
    }

    if (!this.onTranslationChanged) {
      this.onTranslationChanged = this.translateSrvc.onLangChange.subscribe(() => this.updateDate());
    }

    return this.formattedDate;
  }

  protected updateDate() {
    setTimeout(() => this.formattedDate = this.timezoneSrvc.formatTzDate(this.date, this.format));
  }

  ngOnDestroy(): void {
    this.onTimezoneChanged.unsubscribe();
    this.onTranslationChanged.unsubscribe();
  }

}
