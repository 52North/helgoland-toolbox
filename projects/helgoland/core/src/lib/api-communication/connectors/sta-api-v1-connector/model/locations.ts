import { HistoricalLocation } from "./historical-locations";
import { StaExpandParams, StaObject, StaSelectParams, InsertId } from "./sta-interface";
import { InsertThing, Thing } from "./things";

export interface Location extends StaObject {
    name?: string;
    description?: string;
    encodingType?: string;
    location?: GeoJSON.GeometryObject;
    "Things@iot.navigationLink"?: string;
    Things?: Thing[];
    "HistoricalLocations@iot.navigationLink"?: string;
    HistoricalLocations?: HistoricalLocation[];
}

export interface InsertLocation {
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
