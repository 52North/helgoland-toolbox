import { StaExpandParams, StaObject, StaSelectParams } from './sta-interface';

export interface FeatureOfInterest extends StaObject {
  name?: string;
  description?: string;
  encodingType?: string;
  feature?: GeoJSON.GeometryObject;
  'Observations@iot.navigationLink'?: string;
}

export interface InsertFeatureOfInterest extends StaObject {
  name: string;
  description: string;
  encodingType: string;
  feature: GeoJSON.GeometryObject;
}

export interface FeatureOfInterestSelectParams extends StaSelectParams {
  name?: boolean;
  description?: boolean;
  encodingType?: boolean;
  feature?: boolean;
  Observations?: boolean;
}

export interface FeatureOfInterestExpandParams extends StaExpandParams {
  Observations?: boolean;
}
