import { LocatedProfileDataEntry, LocatedTimeValueEntry, ReferenceValues } from "../../../model/dataset-api/data";
import { ProfileDataEntry, TimeValueTuple } from "./../../../model/dataset-api/data";

export interface HelgolandData { }

export class HelgolandTimeseriesData implements HelgolandData {

  referenceValues: ReferenceValues<TimeValueTuple> = {};
  valueBeforeTimespan: TimeValueTuple | undefined;
  valueAfterTimespan: TimeValueTuple | undefined;

  constructor(
        public values: TimeValueTuple[],
  ) { }
}

export class HelgolandTrajectoryData implements HelgolandData {

  constructor(
        public values: LocatedTimeValueEntry[]
  ) { }
}

export class HelgolandProfileData implements HelgolandData {

  constructor(
        public values: ProfileDataEntry[]
  ) { }
}

export class HelgolandLocatedProfileData implements HelgolandData {

  constructor(
        public values: LocatedProfileDataEntry[]
  ) { }
}

export interface HelgolandDataFilter {
    expanded?: boolean;
    generalize?: boolean;
}
