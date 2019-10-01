import { StaExpandParams, StaObject, StaSelectParams, InsertId } from './sta-interface';
import { InsertThing } from './things';

export interface Location extends StaObject {
    name?: string;
    description?: string;
    encodingType?: string;
    location?: GeoJSON.GeometryObject;
    'Things@iot.navigationLink'?: string;
    'HistoricalLocations@iot.navigationLink'?: string;
}

export interface InsertLocation extends Location {
    name: string;
    description: string;
    encodingType: string;
    location: GeoJSON.GeometryObject;
    Things?: (InsertThing | InsertId)[];
}

export interface LocationSelectParams extends StaSelectParams {
    name?: boolean;
    description?: boolean;
    encodingType?: boolean;
    location?: boolean;
    Things?: boolean;
    HistoricalLocations?: boolean;
}

export interface LocationExpandParams extends StaExpandParams {
    Things?: boolean;
    HistoricalLocations?: boolean;
}
