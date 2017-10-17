import { IDataset } from './dataset/idataset';
import { PlatformTypes } from './dataset/platformTypes';
import { Parameter } from './parameter';

export class Platform extends Parameter {
    public platformType: PlatformTypes;
    public datasets: IDataset[];
    public geometry: GeoJSON.Point;
}
