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
  Profile = 'profile',
}

export class HelgolandDataset {
  public internalId: string;

  constructor(
    public id: string,
    public url: string,
    public label: string,
  ) {
    this.internalId = new InternalIdHandler().createInternalId(url, id);
  }
}

export class HelgolandTimeseries extends HelgolandDataset {
  constructor(
    public override id: string,
    public override url: string,
    public override label: string,
    public uom: string,
    public platform: HelgolandPlatform,
    public firstValue: FirstLastValue | undefined,
    public lastValue: FirstLastValue | undefined,
    public referenceValues: ReferenceValue[],
    public renderingHints: RenderingHints | undefined,
    public parameters: ParameterConstellation,
  ) {
    super(id, url, label);
  }
}

export class HelgolandTrajectory extends HelgolandDataset {
  constructor(
    public override id: string,
    public override url: string,
    public override label: string,
    public uom: string,
    public firstValue: FirstLastValue | undefined,
    public lastValue: FirstLastValue | undefined,
    public parameters: DatasetParameterConstellation,
  ) {
    super(id, url, label);
  }
}

export class HelgolandProfile extends HelgolandDataset {
  constructor(
    public override id: string,
    public override url: string,
    public override label: string,
    public uom: string,
    public isMobile: boolean,
    public firstValue: FirstLastValue | undefined,
    public lastValue: FirstLastValue | undefined,
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
  service?: string;
  expanded?: boolean;
  locale?: string;
  type?: DatasetType;
}
