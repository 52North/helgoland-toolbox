import { Duration, unitOfTime } from 'moment';
import { GraphDataEntry } from '../d3-series-graph/models/series-graph-dataset';
import moment from 'moment';

export function sumDataEntry(
  startOf: unitOfTime.StartOf,
  period: Duration,
  data: GraphDataEntry[],
): GraphDataEntry[] {
  const result: GraphDataEntry[] = [];

  if (data.length === 0) {
    return result;
  }

  let currentBucketStart = moment(data[0].timestamp).startOf(startOf);
  // substract one millisecond for not overlapping buckets
  let currentBucketEnd = moment(currentBucketStart)
    .add(period)
    .subtract(1, 'millisecond');
  let bucketVals = [];
  for (let i = 0; i < data.length; i++) {
    const time = moment(data[i].timestamp);
    const value = data[i].value;
    while (
      !(
        currentBucketStart.isSameOrBefore(time) &&
        currentBucketEnd.isSameOrAfter(time)
      )
    ) {
      if (bucketVals.length > 0) {
        // currently NaN values will be calculated as 0;
        let sum = 0;
        let hasValues = false;
        bucketVals.forEach((e) => {
          if (typeof e === 'number') {
            sum += e;
            hasValues = true;
          }
        });
        result.push({
          timestamp: currentBucketStart.unix() * 1000,
          value: hasValues ? sum : NaN,
        });
      } else {
        result.push({
          timestamp: currentBucketStart.unix() * 1000,
          value: NaN,
        });
      }
      bucketVals = [];
      currentBucketStart = currentBucketStart.add(period);
      currentBucketEnd = currentBucketEnd.add(period);
    }
    bucketVals.push(value);
  }

  return result;
}
