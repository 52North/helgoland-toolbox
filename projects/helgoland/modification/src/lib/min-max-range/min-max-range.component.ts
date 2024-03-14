import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MinMaxRange } from '@helgoland/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'n52-min-max-range',
  templateUrl: './min-max-range.component.html',
  styleUrls: ['./min-max-range.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class MinMaxRangeComponent implements OnChanges {
  public rangeMin: number | undefined;
  public rangeMax: number | undefined;

  @Input()
  public range: MinMaxRange | undefined;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onRangeChange: EventEmitter<MinMaxRange> = new EventEmitter();

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
