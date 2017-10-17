import { Parameter } from './../parameter';
import { Station } from './../station';
import { FirstLastValue } from './firstLastValue';
import { IDataset } from './idataset';
import { ParameterConstellation } from './parameterConstellation';

export class Timeseries extends Parameter implements IDataset {
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public station: Station;
    public parameters: ParameterConstellation;
    public hasData = false;
}
