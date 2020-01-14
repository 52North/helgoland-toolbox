import { LocatedTimeValueEntry, ReferenceValues } from '../../../model/dataset-api/data';
import { TimeValueTuple } from './../../../model/dataset-api/data';

export interface HelgolandData { }

export class HelgolandTimeseriesData implements HelgolandData {

    referenceValues: ReferenceValues<TimeValueTuple>;
    valueBeforeTimespan: TimeValueTuple;
    valueAfterTimespan: TimeValueTuple;

    constructor(
        public values: TimeValueTuple[],
    ) { }
}

export class HelgolandTrajectoryData implements HelgolandData {

    constructor(
        public values: LocatedTimeValueEntry[]
    ) { }
}

export interface HelgolandDataFilter {
    // format?: string;
    // timespan?: string;
    generalize?: boolean;
}
