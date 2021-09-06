import { Injectable } from '@angular/core';
import { Data, HelgolandTimeseriesData, Timespan, TimeValueTuple } from '@helgoland/core';

import { D3DataGeneralizer } from './d3-data-generalizer';

@Injectable()
export class D3DataNoneGeneralizer extends D3DataGeneralizer {

  public generalizeData(data: HelgolandTimeseriesData, imageWidth: number, timespan: Timespan): Data<TimeValueTuple> {
    return data;
  }

}
