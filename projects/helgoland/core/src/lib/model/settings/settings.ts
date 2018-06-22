import { Timespan } from './../internal/timeInterval';

export interface Settings {
    datasetApis?: DatasetApi[];
    providerBlackList?: BlacklistedService[];
    solveLabels?: boolean;
    proxyUrl?: string;
    timespanPresets?: TimespanPreset[];
    colorList?: string[];
    languages?: [{ label: string, code: string }];
    refreshDataInterval?: number;
}

export interface DatasetApi {
    name: string;
    url: string;
}

export interface BlacklistedService {
    serviceId: string;
    apiUrl: string;
}

export interface TimespanPreset {
    name: string;
    label: string;
    timespan: TimespanMomentTemplate;
    seperatorAfterThisItem?: boolean;
}

export interface ParsedTimespanPreset {
    name: string;
    label: string;
    timespan: Timespan;
    seperatorAfterThisItem?: boolean;
}

export interface TimespanMomentTemplate {
    to: string;
    from: string;
}
