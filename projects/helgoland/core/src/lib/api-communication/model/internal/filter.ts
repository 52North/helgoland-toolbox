import { PlatformTypes } from './../../../model/dataset-api/enums';
import { DatasetType } from './dataset';

export class HelgolandParameterFilter {
    phenomenon?: string;
    service?: string;
    category?: string;
    offering?: string;
    procedure?: string;
    feature?: string;
    platform?: string;
    platformType?: PlatformTypes;
    type?: DatasetType;
    expanded?: boolean;
    lang?: string;
}

