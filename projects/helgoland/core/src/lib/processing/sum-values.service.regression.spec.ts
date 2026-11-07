import { TestBed } from '@angular/core/testing';
import moment from 'moment';

import { TimeValueTuple } from '../model/dataset-api/data';
import { SumValuesService } from './sum-values.service';

describe('SumValuesService (regression: TimeValueTuple object values)', () => {
  let service: SumValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SumValuesService],
    });
    service = TestBed.inject(SumValuesService);
  });

  it('sums the values of each bucket', () => {
    const hour = 3600000;
    const t0 = 1558634400000; // exactly on the hour
    const data: TimeValueTuple[] = [
      [t0, { value: 1.5 }],
      [t0 + hour, { value: 2.5 }],
      [t0 + 2 * hour, { value: NaN }],
      [t0 + 3 * hour, { value: 3 }],
      [t0 + 4 * hour, { value: NaN }],
      [t0 + 5 * hour, { value: NaN }],
      // a value in the next bucket flushes the previous ones
      [t0 + 6 * hour, { value: 10 }],
    ];

    const result = service.sum('hour', moment.duration(2, 'hour'), data);

    expect(result.length).toBe(3);
    expect(result[0][0]).toBe(moment(t0).startOf('hour').unix() * 1000);
    expect(result[0][1].value).toBeCloseTo(4);
    // a NaN entry counts as 0, the bucket keeps the sum of its real values
    expect(result[1][1].value).toBeCloseTo(3);
    // a bucket without any real value stays NaN
    expect(result[2][1].value).toBeNaN();
  });

  it('returns an empty result for empty data', () => {
    expect(service.sum('hour', moment.duration(2, 'hour'), [])).toEqual([]);
  });
});
