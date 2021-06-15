import { ParameterConstellation, Timeseries } from './dataset';
import { Parameter } from './parameter';

export class Station implements Parameter {
    public id: string;
    public label: string;
    public geometry: GeoJSON.GeometryObject;
    public properties: StationProperties;
}

export interface StationProperties extends Parameter {
    timeseries: TimeseriesCollection | Timeseries;
}

export class TimeseriesCollection {
    [key: string]: ParameterConstellation;
}
