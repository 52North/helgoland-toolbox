import { StaExpandParams, StaObject, StaSelectParams, InsertId } from './sta-interface';
import { InsertDatastream } from './datasetreams';

export interface Observation extends StaObject {
    phenomenonTime?: string;
    result?: string;
    resultTime?: Date;
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
