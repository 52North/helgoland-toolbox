import { LocatedProfileDataEntry } from './../../../../model/api/data';
import { IDataset } from './../../../../model/api/dataset';

export interface TrajectoryResult {
    dataset: IDataset;
    data: LocatedProfileDataEntry;
}
