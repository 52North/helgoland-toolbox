import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MinMaxRange } from '@helgoland/core';

@Component({
  selector: 'n52-min-max-range',
  templateUrl: './min-max-range.component.html',
  styleUrls: ['./min-max-range.component.css']
})
export class MinMaxRangeComponent implements OnChanges {

  public rangeMin: number;
  public rangeMax: number;

  @Input()
  public range: MinMaxRange;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onRangeChange: EventEmitter<MinMaxRange> = new EventEmitter();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.range && this.range) {
      this.rangeMin = this.range.min;
      this.rangeMax = this.range.max;
    }
  }

  public setYaxisRange() {
    const min = (this.rangeMin === null || this.rangeMin === undefined) ? 0 : this.rangeMin;
    const max = (this.rangeMax === null || this.rangeMax === undefined) ? 0 : this.rangeMax;
    this.onRangeChange.emit({ min, max });
  }

  public resetYaxisRange() {
    this.rangeMin = null;
    this.rangeMax = null;
    this.onRangeChange.emit();
  }

}
