import { OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { TimezoneService } from './timezone.service';

@Pipe({
  name: 'tzDate',
  pure: false,
  standalone: true,
})
export class TzDatePipe implements PipeTransform, OnDestroy {
  private timezoneSrvc = inject(TimezoneService);
  private translateSrvc = inject(TranslateService);

  date!: Date | number | string;
  format: string | undefined;
  formattedDate: string = '';
  onTimezoneChanged: Subscription = this.timezoneSrvc.timezoneChange.subscribe(
    () => this.updateDate(),
  );
  onTranslationChanged: Subscription =
    this.translateSrvc.onLangChange.subscribe(() => this.updateDate());

  transform(date: Date | number | string, ...args: any[]): any {
    if (!date) {
      return date;
    }

    this.date = date;

    if (args && args.length > 0) {
      this.format = args[0];
    }

    this.updateDate();

    return this.timezoneSrvc.formatTzDate(this.date, this.format);
  }

  protected updateDate() {
    this.formattedDate = this.timezoneSrvc.formatTzDate(this.date, this.format);
  }

  ngOnDestroy(): void {
    this.onTimezoneChanged.unsubscribe();
    this.onTranslationChanged.unsubscribe();
  }
}
