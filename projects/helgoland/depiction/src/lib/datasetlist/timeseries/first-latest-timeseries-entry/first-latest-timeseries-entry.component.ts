import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FirstLastValue,
  Time,
  TimeInterval,
  TzDatePipe,
} from '@helgoland/core';

import { ConfigurableTimeseriesEntryComponent } from '../configurable-timeseries-entry/configurable-timeseries-entry.component';

/**
 * Extends the ConfigurableTimeseriesEntryComponent, with the following functions:
 *  - first and latest validation
 *  - jump to first and latest value events
 */
@Component({
  selector: 'n52-first-latest-timeseries-entry',
  templateUrl: './first-latest-timeseries-entry.component.html',
  styleUrls: ['./first-latest-timeseries-entry.component.css'],
  imports: [TzDatePipe],
})
export class FirstLatestTimeseriesEntryComponent
  extends ConfigurableTimeseriesEntryComponent
  implements OnChanges
{
  protected timeSrvc = inject(Time);

  readonly timeInterval = input<TimeInterval>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelectDate = output<Date>();

  firstValue: FirstLastValue | undefined;
  lastValue: FirstLastValue | undefined;
  hasData = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeInterval']) {
      this.checkDataInTimespan();
    }
  }

  jumpToFirstTimeStamp() {
    if (this.dataset?.firstValue) {
      this.onSelectDate.emit(new Date(this.dataset.firstValue.timestamp));
    }
  }

  jumpToLastTimeStamp() {
    if (this.dataset?.lastValue) {
      this.onSelectDate.emit(new Date(this.dataset.lastValue.timestamp));
    }
  }

  protected override setParameters() {
    super.setParameters();
    if (this.dataset) {
      if (this.dataset.firstValue) this.firstValue = this.dataset.firstValue;
      if (this.dataset.lastValue) this.lastValue = this.dataset.lastValue;
    }
    this.checkDataInTimespan();
  }

  private checkDataInTimespan() {
    const timeInterval = this.timeInterval();
    if (
      timeInterval &&
      this.dataset &&
      this.dataset.firstValue &&
      this.dataset.lastValue
    ) {
      this.hasData = this.timeSrvc.overlaps(
        timeInterval,
        this.dataset.firstValue.timestamp,
        this.dataset.lastValue.timestamp,
      );
    }
  }
}
