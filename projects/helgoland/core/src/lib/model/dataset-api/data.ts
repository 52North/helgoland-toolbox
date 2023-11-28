export interface IDataEntry { }

export interface Data<T extends IDataEntry> {
    values: T[];
    referenceValues: ReferenceValues<T>;
    valueBeforeTimespan?: T;
    valueAfterTimespan?: T;
}

export class ReferenceValues<T extends IDataEntry> {
    [key: string]: {
        values: T[];
        valueBeforeTimespan?: T;
        valueAfterTimespan?: T;
    };
}

export interface TimeValueEntry extends IDataEntry {
    timestamp: number;
    value: number | null;
}

export type TimeValueTuple = [number, number];

export interface LocatedTimeValueEntry extends TimeValueEntry {
    geometry: GeoJSON.Point;
}

export interface ProfileDataEntry extends IDataEntry {
    timestamp: number;
    value: Array<{ value: number, vertical: number }>;
    verticalUnit: string;
}

export interface LocatedProfileDataEntry extends ProfileDataEntry {
    timestamp: number;
    value: Array<{ value: number, vertical: number }>;
    verticalUnit: string;
    geometry: GeoJSON.GeoJsonObject;
}
