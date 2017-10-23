import { IDataset } from './dataset';
import { PlatformTypes } from './enums';
import { Parameter } from './parameter';

export class Platform extends Parameter {
    public platformType: PlatformTypes;
    public datasets: IDataset[];
    public geometry: GeoJSON.Point;
}
