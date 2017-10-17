import { Parameter } from './../parameter';
import { DatasetTypes } from './datasetTypes';
import { FirstLastValue } from './firstLastValue';
import { IDataset } from './idataset';
import { ParameterConstellation } from './parameterConstellation';
import { PlatformTypes } from './platformTypes';

export class DatasetParameterConstellation extends ParameterConstellation {
    public platform: PlatformParameter;
}

export class Dataset extends Parameter implements IDataset {
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public datasetType: DatasetTypes;
    public parameters: DatasetParameterConstellation;
    public seriesParameters?: DatasetParameterConstellation;
}

export class PlatformParameter extends Parameter {
    public platformType: PlatformTypes;
}
