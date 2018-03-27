import { Parameter } from './parameter';

export interface Service extends Parameter {
    type: string;
    version: string;
    apiUrl: string;
    serviceUrl: string;
    quantities: ServiceQuantities;
}

export interface ServiceQuantities {
    categories?: number;
    features?: number;
    offerings?: number;
    phenomena?: number;
    procedures?: number;
    stations?: number;
    timeseries?: number;
    platforms?: number;
    datasets?: number;
}
