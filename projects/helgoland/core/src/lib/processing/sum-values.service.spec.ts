import { inject, TestBed } from '@angular/core/testing';
import moment from 'moment';

import { TimeValueTuple } from '../model/dataset-api/data';
import { SumValuesService } from './sum-values.service';

describe('SumValuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SumValuesService],
    });
  });

  it('should be created', inject(
    [SumValuesService],
    (service: SumValuesService) => {
      expect(service).toBeTruthy();
    },
  ));

  it('should be created', inject(
    [SumValuesService],
    (sumValues: SumValuesService) => {
      const data: TimeValueTuple[] = [
        [1558634400000, { value: 1.075 }],
        [1558638000000, { value: 1.645 }],
        [1558641600000, { value: 1.64 }],
        [1558645200000, { value: 1.705 }],
        [1558648800000, { value: NaN }],
        [1558652400000, { value: 2.745 }],
        [1558656000000, { value: 2.345 }],
        [1558659600000, { value: 2.06 }],
        [1558663200000, { value: 1.6 }],
        [1558666800000, { value: 1.43 }],
        [1558670400000, { value: 1.945 }],
        [1558674000000, { value: NaN }],
        [1558677600000, { value: 1.53 }],
        [1558681200000, { value: 1.11 }],
        [1558684800000, { value: 1.215 }],
        [1558688400000, { value: 0.92 }],
        [1558692000000, { value: NaN }],
        [1558695600000, { value: NaN }],
        [1558699200000, { value: NaN }],
        [1558702800000, { value: NaN }],
        [1558706400000, { value: NaN }],
        [1558710000000, { value: NaN }],
        [1558713600000, { value: NaN }],
        [1558717200000, { value: NaN }],
        [1558720800000, { value: NaN }],
        [1558724400000, { value: NaN }],
        [1558728000000, { value: NaN }],
        [1558731600000, { value: NaN }],
        [1558735200000, { value: NaN }],
        [1558738800000, { value: NaN }],
        [1558742400000, { value: NaN }],
      ];
      // for (let index = 0; index <= 100; index++) {
      //   const time = moment().minutes(index).seconds(0).milliseconds(0).unix() * 1000;
      //   const val: number | string = (index % 3 === 0) ? 1 : NaN;
      //   data.push([time, val]);
      // }
      const result = sumValues.sum('hour', moment.duration(2, 'hour'), data);
      expect(sumValues).toBeTruthy();
    },
  ));
});
