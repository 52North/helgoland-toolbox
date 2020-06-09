import { Data, HelgolandTimeseriesData, Timespan, TimeValueTuple } from '@helgoland/core';

export abstract class D3DataGeneralizer {

    abstract generalizeData(data: HelgolandTimeseriesData, imageWidth: number, timespan: Timespan): Data<TimeValueTuple>;

}
