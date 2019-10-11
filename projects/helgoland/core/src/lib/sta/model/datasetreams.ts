import { InsertObservation, Observation } from './observations';
import { InsertObservedProperty, ObservedProperty } from './observed-properties';
import { InsertSensor, Sensor } from './sensors';
import { InsertId, StaExpandParams, StaObject, StaSelectParams } from './sta-interface';
import { Thing } from './things';

export interface UnitOfMeasurement {
    name: string;
    symbol: string;
    definition: string;
}

export interface Datastream extends StaObject {
    name?: string;
    description?: string;
    unitOfMeasurement?: UnitOfMeasurement;
    observationType?: string;
    observedArea?: GeoJSON.GeometryObject;
    phenomenonTime?: string;
    // resultTime: TimeInterval;
    'Thing@iot.navigationLink'?: string;
    Thing?: Thing;
    'Sensor@iot.navigationLink'?: string;
    Sensor?: Sensor;
    'ObservedProperty@iot.navigationLink'?: string;
    ObservedProperty?: ObservedProperty;
    'Observations@iot.navigationLink'?: string;
    Observations?: Observation[];
}

export interface InsertDatastream extends Datastream {
    name: string;
    description: string;
    unitOfMeasurement: UnitOfMeasurement;
    observationType: string;
    Observations?: (InsertObservation | InsertId)[];
    ObservedProperty?: (InsertObservedProperty | InsertId);
    Sensor?: (InsertSensor | InsertId);
}

export interface DatastreamSelectParams extends StaSelectParams {
    name?: boolean;
    description?: boolean;
    unitOfMeasurement?: boolean;
    observationType?: boolean;
    observedArea?: boolean;
    Thing?: boolean;
    Sensor?: boolean;
    ObservedProperty?: boolean;
    Observations?: boolean;
}

export interface DatastreamExpandParams extends StaExpandParams {
    Thing?: boolean;
    Sensor?: boolean;
    ObservedProperty?: boolean;
    Observations?: boolean;
}
