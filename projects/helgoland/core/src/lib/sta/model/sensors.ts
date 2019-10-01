import { StaExpandParams, StaObject, StaSelectParams } from './sta-interface';

export interface Sensor extends StaObject {
    name?: string;
    description?: string;
    encodingType?: string;
    metadata?: string;
    'Datastreams@iot.navigationLink'?: string;
}

export interface InsertSensor extends StaObject {
    name: string;
    description: string;
    encodingType: string;
    metadata: string;
}

export interface SensorSelectParams extends StaSelectParams {
    name?: boolean;
    description?: boolean;
    encodingType?: boolean;
    metadata?: boolean;
    Datastreams?: boolean;
}

export interface SensorExpandParams extends StaExpandParams {
    Datastreams?: boolean;
}
