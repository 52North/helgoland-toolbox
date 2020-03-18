import { InsertDatastream } from './datasetreams';
import { InsertId, StaExpandParams, StaObject, StaSelectParams } from './sta-interface';

export interface Observation extends StaObject {
    phenomenonTime?: string;
    result?: string;
    resultTime?: Date;
    parameters?: {
        name: string;
        value: string;
    }[];
    'Datastream@iot.navigationLink'?: string;
    'FeatureOfInterest@iot.navigationLink'?: string;
}

export interface InsertObservation extends Observation {
    phenomenonTime: string;
    result: string;
    Datastream: (InsertDatastream | InsertId);
}

export interface ObservationSelectParams extends StaSelectParams {
    phenomenonTime?: boolean;
    result?: boolean;
    resultTime?: boolean;
    Datastream?: boolean;
    FeatureOfInterest?: boolean;
}

export interface ObservationExpandParams extends StaExpandParams {
    Datastream?: boolean;
    FeatureOfInterest?: boolean;
}
