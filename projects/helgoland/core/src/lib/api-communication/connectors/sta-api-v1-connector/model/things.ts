import { HistoricalLocation } from "./historical-locations";
import { InsertDatastream, Datastream } from "./datasetreams";
import { StaExpandParams, StaObject, StaSelectParams, InsertId } from "./sta-interface";
import { InsertLocation, Location } from "./locations";

export interface Thing extends StaObject {
    name?: string;
    description?: string;
    properties?: {
        [key: string]: any;
    };
    "Locations@iot.navigationLink"?: string;
    Locations?: Location[];
    "Datastreams@iot.navigationLink"?: string;
    Datastreams?: Datastream[];
    "HistoricalLocations@iot.navigationLink"?: string;
    HistoricalLocations?: HistoricalLocation[];
}

export interface InsertThing {
    name: string;
    description: string;
    Locations?: (InsertLocation | InsertId)[];
    Datastreams?: (InsertDatastream | InsertId) [];
}

export interface ThingSelectParams extends StaSelectParams {
    name?: boolean;
    description?: boolean;
    properties?: boolean;
    Locations?: boolean;
    Datastreams?: boolean;
    HistoricalLocations?: boolean;
}

export interface ThingExpandParams extends StaExpandParams {
    Locations?: boolean;
    Datastreams?: boolean;
    HistoricalLocations?: boolean;
}
