import { IDataset } from './dataset';
import { PlatformTypes } from './enums';
import { Parameter } from './parameter';

export interface Platform extends Parameter {
  platformType: PlatformTypes;
  datasets: IDataset[];
  geometry: GeoJSON.Point;
}
