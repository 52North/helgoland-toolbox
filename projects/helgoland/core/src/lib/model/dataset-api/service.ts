import { Parameter } from "./parameter";

export interface Service extends Parameter {
    id: string;
    href: string;
    label: string;
    version: string;
    extras: string[];
    type: string;
    quantities?: ServiceQuantities;
    supportsfirstlatest?: boolean;
    supportedmimetypes?: SupportedMimeTypes;
    // for internal use:
    apiUrl: string;
}

export interface SupportedMimeTypes {}

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
