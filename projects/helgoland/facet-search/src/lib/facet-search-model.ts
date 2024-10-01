import { FirstLastValue, Timespan } from '@helgoland/core';
import { Observable } from 'rxjs';

export enum ParameterFacetType {
  category = 'category',
  phenomenon = 'phenomenon',
  procedure = 'procedure',
  feature = 'feature',
  offering = 'offering',
}

export enum ParameterFacetSort {
  none = 'none',
  ascAlphabet = 'ascAlphabet',
  descAlphabet = 'descAlphabet',
  ascCount = 'ascCount',
  descCount = 'descCount',
}

export interface FacetParameter {
  id: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface FacetSearchElementParameter {
  id: string;
  label: string;
}

export interface FacetSearchElementFeature extends FacetSearchElementParameter {
  geometry: GeoJSON.GeometryObject;
}

export interface FacetSearchElement {
  id?: string;
  label?: string;
  url?: string;
  firstValue?: FirstLastValue;
  lastValue?: FirstLastValue;
  category?: FacetSearchElementParameter;
  feature?: FacetSearchElementFeature;
  offering?: FacetSearchElementParameter;
  phenomenon?: FacetSearchElementParameter;
  procedure?: FacetSearchElementParameter;
}

export abstract class FacetSearchService {
  abstract getResults(): Observable<FacetSearchElement[]>;
  abstract getParameterList(
    type: ParameterFacetType,
    sort: ParameterFacetSort,
  ): FacetParameter[];
  abstract selectParameter(
    type: ParameterFacetType,
    parameter: FacetParameter,
  ): any;
  abstract getSelectedParameter(
    type: ParameterFacetType,
  ): FacetParameter | undefined;
  abstract setEntries(entries: FacetSearchElement[]): void;
  abstract getFilteredResults(): FacetSearchElement[];
  abstract setSelectedTimespan(timespan: Timespan): void;
  abstract getSelectedTimespan(): Timespan | undefined;
  abstract getFilteredTimespan(): Timespan | undefined;
  abstract getCompleteTimespan(): Timespan | undefined;
  abstract resetAllFacets(): void;
  abstract areFacetsSelected(): boolean;
}
