import { DatasetType } from './dataset';

export class HelgolandParameterFilter {
    phenomenon?: string;
    service?: string;
    category?: string;
    offering?: string;
    procedure?: string;
    feature?: string;
    platform?: string;
    type?: DatasetType;
    expanded?: boolean;
    lang?: string;
}

