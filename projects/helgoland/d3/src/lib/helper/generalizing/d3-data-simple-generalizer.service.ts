import { Injectable } from "@angular/core";
import { Data, HelgolandTimeseriesData, Timespan, TimeValueTuple } from "@helgoland/core";

import { D3DataGeneralizer } from "./d3-data-generalizer";

@Injectable()
export class D3DataSimpleGeneralizer extends D3DataGeneralizer {

  public generalizeData(data: HelgolandTimeseriesData, imageWidth: number, timespan: Timespan): Data<TimeValueTuple> {
    if (imageWidth > 0 && data.values.length > imageWidth && data.values.length > 0) {
      const duration = timespan.to - timespan.from;
      const dataduration = data.values[data.values.length - 1][0] - data.values[0][0];
      const factor = duration / dataduration;
      const realWidth = imageWidth / factor;
      const modulo = data.values.length / realWidth;
      const generalizedData = {
        values: data.values.filter((v, i) => i % Math.round(modulo) === 0),
        referenceValues: data.referenceValues
      };
      console.log(`reduce from ${data.values.length} to ${generalizedData.values.length}`);
      return generalizedData;
    }
    return data;
  }
}
