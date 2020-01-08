import { ReferenceValues } from '../../../model/dataset-api/data';

export type TimeValueArray = [number, number];

export interface HelgolandData {
}

export class HelgolandTimeseriesData implements HelgolandData {

    referenceValues: ReferenceValues<TimeValueArray>;
    valueBeforeTimespan?: TimeValueArray;
    valueAfterTimespan?: TimeValueArray;

    constructor(
        public values: TimeValueArray[]
    ) { }
}

export interface HelgolandDataFilter {
    // format?: string;
    // timespan?: string;
    generalize?: boolean;
}
