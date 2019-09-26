import { Injectable } from '@angular/core';
import { MinMaxRange } from '@helgoland/core';

@Injectable({
  providedIn: 'root'
})
export class RangeCalculationsService {

  /**
   * Buffers the range with a given factor.
   * @param range {MinMaxRange} range to be buffered
   * @param factor {number}
   */
  public bufferRange(range: MinMaxRange, factor: number = 0.1): MinMaxRange {
    const offset = (range.max - range.min) * factor;
    range.max = range.max + offset;
    range.min = range.min - offset;
    return range;
  }

  /**
   * Merge two ranges to one
   * @param rangeOne {MinMaxRange}
   * @param rangeTwo {MinMaxRange}
   */
  public mergeRanges(rangeOne: MinMaxRange, rangeTwo: MinMaxRange): MinMaxRange {
    return {
      min: Math.min(rangeOne.min, rangeTwo.min),
      max: Math.max(rangeOne.max, rangeTwo.max)
    };
  }

  /**
   * Sets range to default interval of -1 to 1, if min and max of range are not set.
   * @param range {MinMaxRange} range to be set
   */
  public setDefaultExtendIfUndefined(range: MinMaxRange): MinMaxRange {
    let min = -1;
    let max = 1;
    if (range !== undefined && range !== null) {
      if (range.min !== range.max) {
        min = range.min;
        max = range.max;
      } else {
        min += range.min;
        max += range.max;
      }
    }
    return { min, max };
  }

}
