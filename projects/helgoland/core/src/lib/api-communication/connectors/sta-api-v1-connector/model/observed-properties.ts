import { StaExpandParams, StaObject, StaSelectParams } from './sta-interface';

export interface ObservedProperty extends StaObject {
  name?: string;
  description?: string;
  definition?: string;
  'Datastreams@iot.navigationLink'?: string;
}

export interface InsertObservedProperty {
  name: string;
  description: string;
  definition: string;
}

export interface ObservedPropertySelectParams extends StaSelectParams {
  name?: boolean;
  description?: boolean;
  definition?: boolean;
  Datastreams?: boolean;
}

export interface ObservedPropertyExpandParams extends StaExpandParams {
  Datastreams?: boolean;
}
