import { ParameterConstellation, Timeseries } from './dataset';
import { Parameter } from './parameter';

export class Station implements Parameter {
  id!: string;
  label!: string;
  geometry!: GeoJSON.GeometryObject;
  properties!: StationProperties;
}

export interface StationProperties extends Parameter {
  timeseries: TimeseriesCollection | Timeseries;
}

export class TimeseriesCollection {
  [key: string]: ParameterConstellation;
}
