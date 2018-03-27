import 'bootstrap-slider';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Timespan } from '@helgoland/core';
import jquery from 'jquery';

import { TimeRangeSliderSelectorCache } from './time-range-slider-selector.service';

@Component({
  selector: 'n52-time-range-slider-selector',
  templateUrl: './time-range-slider-selector.component.html',
  styleUrls: [
    './time-range-slider-selector.component.scss',
    '../../../../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class TimeRangeSliderSelectorComponent implements OnChanges {

  @Input()
  public id: string = '';

  @Input()
  public timeList: number[];

  @Output()
  public onTimespanSelected: EventEmitter<Timespan> = new EventEmitter();

  public start: number;
  public selectionStart: number;
  public end: number;
  public selectionEnd: number;

  constructor(
    private cache: TimeRangeSliderSelectorCache
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.timeList && this.timeList) {
      let min; let max;
      this.start = min = this.timeList[0];
      this.end = max = this.timeList[this.timeList.length - 1];
      if (this.id && this.cache.has(this.id)) {
        this.selectionStart = this.cache.get(this.id).from;
        this.selectionEnd = this.cache.get(this.id).to;
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
