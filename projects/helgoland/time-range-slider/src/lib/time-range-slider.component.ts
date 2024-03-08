import 'bootstrap-slider';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Required, Timespan } from '@helgoland/core';
// @ts-ignore
import jquery from 'jquery';

import { TimeRangeSliderCache } from './time-range-slider.service';

@Component({
  selector: 'n52-time-range-slider',
  templateUrl: './time-range-slider.component.html',
  styleUrls: [
    './time-range-slider.component.scss',
    '../../../../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TimeRangeSliderComponent implements OnChanges {

  @Input()
  public id = '';

  @Input()
  @Required
  public timeList!: number[];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimespanSelected: EventEmitter<Timespan> = new EventEmitter();

  public start!: number;
  public selectionStart!: number;
  public end!: number;
  public selectionEnd!: number;

  constructor(
    protected cache: TimeRangeSliderCache
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeList'] && this.timeList) {
      let min; let max;
      this.start = min = this.timeList[0];
      this.end = max = this.timeList[this.timeList.length - 1];
      const cache = this.cache.get(this.id);
      if (this.id && cache) {
        this.selectionStart = cache.from;
        this.selectionEnd = cache.to;
      } else {
        this.selectionStart = this.start;
        this.selectionEnd = this.end;
      }
      jquery('#slider').slider({
        tooltip: 'hide',
        min,
        max,
        value: [this.selectionStart, this.selectionEnd]
      }).on('slideStop', (event: any) => {
        const timespan: Timespan = new Timespan(event.value[0], event.value[1]);
        this.cache.set(this.id, timespan);
        this.onTimespanSelected.emit(timespan);
      }).on('slide', (event: any) => {
        this.selectionStart = event.value[0];
        this.selectionEnd = event.value[1];
      });
    }
  }
}
