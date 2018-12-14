import { DatasetTypes, PlatformTypes } from './enums';
import { Parameter } from './parameter';
import { Station } from './station';

export interface IDataset extends Parameter {
    url: string;
    uom: string;
    internalId: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    referenceValues: ReferenceValue[];
    parameters: ParameterConstellation;
    renderingHints: RenderingHints;
}

export class ParameterConstellation {
    public service: Parameter;
    public offering: Parameter;
    public feature: Parameter;
    public procedure: Parameter;
    public phenomenon: Parameter;
    public category: Parameter;
}

export class FirstLastValue {
    public timestamp: number;
    public value: number;
}

export class ReferenceValue {
    public referenceValueId: string;
    public label: string;
    public lastValue: FirstLastValue;
    public color?: string;
    public visible?: boolean;
}

export interface RenderingHints {
    chartType: string;
    properties: {
        color: string;
    };
}

export interface LineRenderingHints extends RenderingHints {
    chartType: 'line';
    properties: {
        color: string;
        width: string;
        lineType: string;
    };
}

export interface BarRenderingHints {
    chartType: 'bar';
    properties: {
        color: string;
        width: string;
        interval: string;
    };
}

export class DatasetParameterConstellation extends ParameterConstellation {
    public platform: PlatformParameter;
}

export class Dataset implements IDataset {
    public id: string;
    public label: string;
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public referenceValues: ReferenceValue[];
    public datasetType: DatasetTypes;
    public platformType: PlatformTypes;
    public parameters: DatasetParameterConstellation;
    public seriesParameters?: DatasetParameterConstellation;
    public renderingHints: RenderingHints;
}

export class Timeseries implements IDataset {
    public id: string;
    public label: string;
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public referenceValues: ReferenceValue[];
    public station: Station;
    public parameters: ParameterConstellation;
    public statusIntervals?: StatusInterval[];
    public hasData = false;
    public renderingHints: RenderingHints;
}

export interface TimeseriesExtras {
    license?: string;
    statusIntervals?: StatusInterval[];
}

export interface StatusInterval {
    lower: string;
    upper: string;
    name: string;
    color: string;
}

export interface PlatformParameter extends Parameter {
    platformType: PlatformTypes;
}

export class TimeseriesData {
    public id: string;
    public url: string;
    public data: FirstLastValue[];
}
