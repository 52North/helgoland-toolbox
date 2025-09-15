import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MinMaxRange } from '@helgoland/core';

@Component({
  selector: 'n52-min-max-range',
  templateUrl: './min-max-range.component.html',
  styleUrls: ['./min-max-range.component.css'],
  imports: [FormsModule],
})
export class MinMaxRangeComponent implements OnChanges {
  rangeMin: number | undefined;
  rangeMax: number | undefined;

  readonly range = input<MinMaxRange>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onRangeChange = output<MinMaxRange | void>();

  ngOnChanges(changes: SimpleChanges) {
    const range = this.range();
    if (changes['range'] && range) {
      this.rangeMin = range.min;
      this.rangeMax = range.max;
    }
  }

  setYaxisRange() {
    const min =
      this.rangeMin === null || this.rangeMin === undefined ? 0 : this.rangeMin;
    const max =
      this.rangeMax === null || this.rangeMax === undefined ? 0 : this.rangeMax;
    this.onRangeChange.emit({ min, max });
  }

  resetYaxisRange() {
    this.rangeMin = undefined;
    this.rangeMax = undefined;
    this.onRangeChange.emit();
  }
}
