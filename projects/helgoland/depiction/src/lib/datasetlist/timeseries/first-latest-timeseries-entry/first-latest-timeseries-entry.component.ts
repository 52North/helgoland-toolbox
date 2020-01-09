import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FirstLastValue, HelgolandServicesHandlerService, InternalIdHandler, Time, TimeInterval } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import {
  ConfigurableTimeseriesEntryComponent,
} from '../configurable-timeseries-entry/configurable-timeseries-entry.component';

/**
 * Extends the ConfigurableTimeseriesEntryComponent, with the following functions:
 *  - first and latest validation
 *  - jump to first and latest value events
 */
@Component({
  selector: 'n52-first-latest-timeseries-entry',
  templateUrl: './first-latest-timeseries-entry.component.html',
  styleUrls: ['./first-latest-timeseries-entry.component.css']
})
export class FirstLatestTimeseriesEntryComponent extends ConfigurableTimeseriesEntryComponent implements OnChanges {

  @Input()
  public timeInterval: TimeInterval;

  @Output()
  public onSelectDate: EventEmitter<Date> = new EventEmitter();

  public firstValue: FirstLastValue;
  public lastValue: FirstLastValue;
  public hasData = true;

  constructor(
    protected servicesHandler: HelgolandServicesHandlerService,
    protected internalIdHandler: InternalIdHandler,
    protected translateSrvc: TranslateService,
    protected timeSrvc: Time
  ) {
    super(servicesHandler, internalIdHandler, translateSrvc);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.timeInterval) {
      this.checkDataInTimespan();
    }
  }

  public jumpToFirstTimeStamp() {
    this.onSelectDate.emit(new Date(this.dataset.firstValue.timestamp));
  }

  public jumpToLastTimeStamp() {
    this.onSelectDate.emit(new Date(this.dataset.lastValue.timestamp));
  }

  protected setParameters() {
    super.setParameters();
    this.firstValue = this.dataset.firstValue;
    this.lastValue = this.dataset.lastValue;
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
