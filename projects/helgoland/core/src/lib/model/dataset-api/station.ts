import { ParameterConstellation, Timeseries } from './dataset';
import { Parameter } from './parameter';

export class Station {
    public id: string;
    public geometry: GeoJSON.GeometryObject;
    public properties: StationProperties;
}

export interface StationProperties extends Parameter {
    timeseries: TimeseriesCollection | Timeseries;
}

export class TimeseriesCollection {
    [key: string]: ParameterConstellation;
}
