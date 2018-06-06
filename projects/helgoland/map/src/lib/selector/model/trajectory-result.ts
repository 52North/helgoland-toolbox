import { IDataset, LocatedProfileDataEntry } from '@helgoland/core';

export interface TrajectoryResult {
    dataset: IDataset;
    data: LocatedProfileDataEntry;
}
