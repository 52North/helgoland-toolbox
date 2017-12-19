import { Timespan } from './../internal/timeInterval';

export class Settings {
    public restApiUrls?: string[];
    public providerBlackList?: BlacklistedService[];
    public solveLabels?: boolean;
    public proxyUrl?: string;
    public timespanPresets?: TimespanPreset[];
    public colorList?: string[];
    public languages?: [{ label: string, code: string }];
}

export class BlacklistedService {
    public serviceId: string;
    public apiUrl: string;
}

export class TimespanPreset {
    public name: string;
    public label: string;
    public timespan: TimespanMomentTemplate;
    public seperatorAfterThisItem?: boolean;
}

export class ParsedTimespanPreset {
    public name: string;
    public label: string;
    public timespan: Timespan;
    public seperatorAfterThisItem?: boolean;
}

export class TimespanMomentTemplate {
    public to: string;
    public from: string;
}
