import { Timespan } from "./../internal/timeInterval";

export interface Settings {
    datasetApis?: DatasetApi[];
    defaultService?: ConfigService;
    providerBlackList?: BlacklistedService[];
    proxyUrl?: string;
    proxyUrlsStartWith?: string[];
    timespanPresets?: TimespanPreset[];
    colorList?: string[];
    languages?: [{ label: string, code: string }];
    refreshDataInterval?: number;
}

export interface DatasetApi {
    name: string;
    url: string;
    connector?: string;
    basicAuth?: boolean;
}

export interface ConfigService {
    serviceId: string;
    apiUrl: string;
}

export interface BlacklistedService extends ConfigService { }

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
