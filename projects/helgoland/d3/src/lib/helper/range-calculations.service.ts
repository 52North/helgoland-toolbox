import { Injectable } from '@angular/core';
import { MinMaxRange } from '@helgoland/core';

import { YAxis } from '../model/d3-general';

@Injectable({
  providedIn: 'root'
})
export class RangeCalculationsService {

  /**
   * Buffers the range of the axis with a given factor.
   * @param axis {YAxis}
   * @param factor {number}
   */
  public bufferUnfixedRange(axis: YAxis, factor: number = 0.1) {
    if (axis.range.max !== undefined && axis.range.min !== undefined) {
      const offset = (axis.range.max - axis.range.min) * factor;
      if (!axis.fixedMin) { axis.range.min = axis.range.min - offset; }
      if (!axis.fixedMax) { axis.range.max = axis.range.max + offset; }
    }
  }

  /**
   * Merge two ranges to one
   * @param rangeOne {MinMaxRange}
   * @param rangeTwo {MinMaxRange}
   */
  public mergeRanges(rangeOne: MinMaxRange, rangeTwo: MinMaxRange): MinMaxRange {
    const calcMin = Math.min(rangeOne.min !== undefined ? rangeOne.min : Number.POSITIVE_INFINITY, rangeTwo.min !== undefined ? rangeTwo.min : Number.POSITIVE_INFINITY);
    const calcMax = Math.max(rangeOne.max !== undefined ? rangeOne.max : Number.NEGATIVE_INFINITY, rangeTwo.max !== undefined ? rangeTwo.max : Number.NEGATIVE_INFINITY);

    return {
      min: calcMin === Number.POSITIVE_INFINITY ? undefined : calcMin,
      max: calcMax === Number.NEGATIVE_INFINITY ? undefined : calcMax
    };
  }

  /**
   * Sets range to default interval of -1 to 1, if min and max of range are not set.
   * @param range {MinMaxRange} range to be set
   */
  public setDefaultExtendIfUndefined(axis: YAxis) {
    if (axis.range && axis.range.min !== undefined && axis.range.max !== undefined) {
      if (axis.range.min === axis.range.max) {
        if (!axis.fixedMax) {
          axis.range.max = axis.range.max + 1;
        }
        if (!axis.fixedMin) {
          axis.range.min = axis.range.min - 1;
        }
      }
    }
  }

}
