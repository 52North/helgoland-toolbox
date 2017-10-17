import { ParameterConstellation } from './dataset/parameterConstellation';
import { Timeseries } from './dataset/timeseries';
import { Parameter } from './parameter';

export class Station {
    public geometry: GeoJSON.Point;
    public properties: StationProperties;
}

export class StationProperties extends Parameter {
    public timeseries: TimeseriesCollection | Timeseries;
}

export class TimeseriesCollection {
    [key: string]: ParameterConstellation;
}
