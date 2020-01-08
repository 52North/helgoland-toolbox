import { Injectable } from '@angular/core';
import moment, { unitOfTime, Duration } from 'moment';

import { TimeValueTuple } from '../model/dataset-api/data';

@Injectable()
export class SumValuesService {

  constructor() { }

  public sum(startOf: unitOfTime.StartOf, period: Duration, data: TimeValueTuple[]): TimeValueTuple[] {
    const result: TimeValueTuple[] = [];

    if (data.length === 0) { return result; }

    let currentBucketStart = moment(data[0][0]).startOf(startOf);
    // substract one millisecond for not overlapping buckets
    let currentBucketEnd = moment(currentBucketStart).add(period).subtract(1, 'millisecond');
    let bucketVals = [];
    for (let i = 0; i < data.length; i++) {
      const time = moment(data[i][0]);
      const value = data[i][1];

      while (!(currentBucketStart.isSameOrBefore(time) && currentBucketEnd.isSameOrAfter(time))) {
        if (bucketVals.length > 0) {
          // currently NaN values will be calculated as 0;
          let sum = 0;
          let hasValues = false;
          bucketVals.forEach(e => {
            if (typeof e === 'number') {
              sum += e;
              hasValues = true;
            }
          });
          result.push([currentBucketStart.unix() * 1000, hasValues ? sum : NaN]);
        } else {
          result.push([currentBucketStart.unix() * 1000, NaN]);
        }
        bucketVals = [];
        currentBucketStart = currentBucketStart.add(period);
        currentBucketEnd = currentBucketEnd.add(period);
      }
      bucketVals.push(value);
    }

    return result;
  }

}
