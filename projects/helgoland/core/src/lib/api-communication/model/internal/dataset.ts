import { InternalIdHandler } from '../../../dataset-api/internal-id-handler.service';
import { FirstLastValue } from './../../../model/dataset-api/dataset';
import { Parameter } from './../../../model/dataset-api/parameter';

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
        public feature: Parameter,
        public phenomenon: Parameter,
        public offering: Parameter
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
