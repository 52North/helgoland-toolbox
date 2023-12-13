import { Observable } from "rxjs";

import { HttpRequestOptions } from "../../../../model/internal/http-requests";
import { Datastream, DatastreamExpandParams, DatastreamSelectParams } from "./datasetreams";
import { FeatureOfInterest, FeatureOfInterestExpandParams, FeatureOfInterestSelectParams } from "./features-of-interest";
import { HistoricalLocation, HistoricalLocationExpandParams, HistoricalLocationSelectParams } from "./historical-locations";
import { Location, LocationExpandParams, LocationSelectParams } from "./locations";
import { Observation, ObservationExpandParams, ObservationSelectParams } from "./observations";
import { ObservedProperty, ObservedPropertyExpandParams, ObservedPropertySelectParams } from "./observed-properties";
import { Sensor, SensorExpandParams, SensorSelectParams } from "./sensors";
import { InsertThing, Thing, ThingExpandParams, ThingSelectParams } from "./things";

export enum StaEndpoint {
  Things = "Things",
  Observations = "Observations",
  HistoricalLocations = "HistoricalLocations",
  Locations = "Locations",
  Sensors = "Sensors",
  FeaturesOfInterest = "FeaturesOfInterest",
  ObservedProperties = "ObservedProperties",
  Datastreams = "Datastreams",
}

export interface StaObject {
  "@iot.selfLink"?: string;
  "@iot.id": string;
  properties?: {
    [key: string]: any;
  }
}

export interface InsertId {
  "@iot.id": string;
}

export interface StaSelectParams {
  [key: string]: any;
}

export interface StaValueListResponse<T extends StaObject> {
  "@iot.count": number;
  "@iot.nextLink"?: string;
  value: T[];
}

export interface StaExpandParams {
  [key: string]: any;
}

export interface StaFilter<S extends StaSelectParams, E extends StaExpandParams> {
  $select?: S | string;
  $expand?: E | string;
  $orderby?: string;
  $filter?: string;
  $count?: boolean;
  $top?: number;
}
