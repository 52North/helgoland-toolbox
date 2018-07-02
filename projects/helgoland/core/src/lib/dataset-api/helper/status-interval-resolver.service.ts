import { Injectable } from '@angular/core';

import { StatusInterval } from '../../model/dataset-api/dataset';

@Injectable()
export class StatusIntervalResolverService {

  constructor() { }

  public getMatchingInterval(value: number, statusIntervals: StatusInterval[]): StatusInterval {
    if (value && statusIntervals) {
      return statusIntervals.find((interval) => {
        const upper = interval.upper ? parseFloat(interval.upper) : Number.MAX_VALUE;
        const lower = interval.lower ? parseFloat(interval.lower) : Number.MIN_VALUE;
        if (lower <= value && value < upper) { return true; }
      });
    }
  }

}
