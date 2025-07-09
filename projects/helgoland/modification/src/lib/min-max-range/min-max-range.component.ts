import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
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
  public rangeMin: number | undefined;
  public rangeMax: number | undefined;

  @Input()
  public range: MinMaxRange | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onRangeChange = output<MinMaxRange | void>();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['range'] && this.range) {
      this.rangeMin = this.range.min;
      this.rangeMax = this.range.max;
    }
  }

  public setYaxisRange() {
    const min =
      this.rangeMin === null || this.rangeMin === undefined ? 0 : this.rangeMin;
    const max =
      this.rangeMax === null || this.rangeMax === undefined ? 0 : this.rangeMax;
    this.onRangeChange.emit({ min, max });
  }

  public resetYaxisRange() {
    this.rangeMin = undefined;
    this.rangeMax = undefined;
    this.onRangeChange.emit();
  }
}
