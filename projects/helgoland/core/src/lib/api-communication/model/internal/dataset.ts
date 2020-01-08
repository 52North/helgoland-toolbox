import { InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { FirstLastValue, ParameterConstellation } from './../../../model/dataset-api/dataset';

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
        public firstValue: FirstLastValue,
        public lastValue: FirstLastValue,
        public parameter: ParameterConstellation,
    ) {
        super(id, url, label);
    }
}

export interface DatasetFilter {
    phenomenon?: string;
    category?: string;
    procedure?: string;
    feature?: string;
    expanded?: boolean;
}
