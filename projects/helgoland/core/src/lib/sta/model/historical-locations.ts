import { StaExpandParams, StaObject, StaSelectParams } from './sta-interface';

export interface HistoricalLocation extends StaObject {
    time?: Date;
    'Locations@iot.navigationLink'?: string;
    'Thing@iot.navigationLink'?: string;
}

export interface InsertHistoricalLocation extends HistoricalLocation {
    time: Date;
}

export interface HistoricalLocationSelectParams extends StaSelectParams {
    time?: boolean;
    Locations?: boolean;
    Thing?: boolean;
}

export interface HistoricalLocationExpandParams extends StaExpandParams {
    Locations?: boolean;
    Thing?: boolean;
}

