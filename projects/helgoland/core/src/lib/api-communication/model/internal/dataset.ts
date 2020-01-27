import { InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import {
    DatasetParameterConstellation,
    FirstLastValue,
    ParameterConstellation,
    ReferenceValue,
    RenderingHints,
    StatusInterval,
} from './../../../model/dataset-api/dataset';
import { HelgolandPlatform } from './platform';

export enum DatasetType {
    Timeseries = 'timeseries',
    Trajectory = 'trajectory',
    Profile = 'profile'
}

export class HelgolandDataset {
    public internalId: string;

    constructor(
        public id: string,
        public url: string,
        public label: string
    ) {
        this.internalId = new InternalIdHandler().createInternalId(url, id);
    }
}

export class HelgolandTimeseries extends HelgolandDataset {

    constructor(
        public id: string,
        public url: string,
        public label: string,
        public uom: string,
        public platform: HelgolandPlatform,
        public firstValue: FirstLastValue,
        public lastValue: FirstLastValue,
        public referenceValues: ReferenceValue[],
        public renderingHints: RenderingHints,
        public parameters: ParameterConstellation,
    ) {
        super(id, url, label);
    }
}

export class HelgolandTrajectory extends HelgolandDataset {

    constructor(
        public id: string,
        public url: string,
        public label: string,
        public uom: string,
        public firstValue: FirstLastValue,
        public lastValue: FirstLastValue,
        public parameters: DatasetParameterConstellation,
    ) {
        super(id, url, label);
    }
}

export class HelgolandProfile extends HelgolandDataset {

    constructor(
        public id: string,
        public url: string,
        public label: string,
        public uom: string,
        public isMobile: boolean,
        public parameters: DatasetParameterConstellation,
    ) {
        super(id, url, label);
    }
}

export interface DatasetExtras {
    license?: string;
    statusIntervals?: StatusInterval[];
}

export interface DatasetFilter {
    phenomenon?: string;
    category?: string;
    procedure?: string;
    feature?: string;
    offering?: string;
    expanded?: boolean;
    lang?: string;
    type?: DatasetType;
}
