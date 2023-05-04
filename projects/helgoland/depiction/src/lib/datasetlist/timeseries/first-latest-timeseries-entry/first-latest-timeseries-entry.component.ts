import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FirstLastValue, HelgolandServicesConnector, InternalIdHandler, Time, TimeInterval, TzDatePipe } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import {
  ConfigurableTimeseriesEntryComponent,
} from '../configurable-timeseries-entry/configurable-timeseries-entry.component';
import { NgIf } from '@angular/common';

/**
 * Extends the ConfigurableTimeseriesEntryComponent, with the following functions:
 *  - first and latest validation
 *  - jump to first and latest value events
 */
@Component({
    selector: 'n52-first-latest-timeseries-entry',
    templateUrl: './first-latest-timeseries-entry.component.html',
    styleUrls: ['./first-latest-timeseries-entry.component.css'],
    standalone: true,
    imports: [NgIf, TzDatePipe]
})
export class FirstLatestTimeseriesEntryComponent extends ConfigurableTimeseriesEntryComponent implements OnChanges {

  @Input()
  public timeInterval: TimeInterval | undefined;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onSelectDate: EventEmitter<Date> = new EventEmitter();

  public firstValue: FirstLastValue | undefined;
  public lastValue: FirstLastValue | undefined;
  public hasData = true;

  constructor(
    protected override servicesConnector: HelgolandServicesConnector,
    protected override internalIdHandler: InternalIdHandler,
    protected override translateSrvc: TranslateService,
    protected timeSrvc: Time
  ) {
    super(servicesConnector, internalIdHandler, translateSrvc);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeInterval']) {
      this.checkDataInTimespan();
    }
  }

  public jumpToFirstTimeStamp() {
    if (this.dataset?.firstValue) {
      this.onSelectDate.emit(new Date(this.dataset.firstValue.timestamp));
    }
  }

  public jumpToLastTimeStamp() {
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
    if (this.timeInterval && this.dataset && this.dataset.firstValue && this.dataset.lastValue) {
      this.hasData = this.timeSrvc.overlaps(
        this.timeInterval,
        this.dataset.firstValue.timestamp,
        this.dataset.lastValue.timestamp
      );
    }
  }

}
