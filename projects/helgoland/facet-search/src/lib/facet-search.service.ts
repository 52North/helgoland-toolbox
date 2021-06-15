import { Injectable, Optional } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { Observable, ReplaySubject } from 'rxjs';

import {
  FacetSearchElement,
  FacetSearchElementParameter,
  FacetParameter,
  FacetSearchService,
  ParameterFacetSort,
  ParameterFacetType,
} from './facet-search-model';

@Injectable()
export class FacetSearchConfig {
  showZeroValues?: boolean;
}

@Injectable()
export class FacetSearchServiceImpl implements FacetSearchService {

  private onResultsChanged: ReplaySubject<FacetSearchElement[]> = new ReplaySubject(1);

  private facets: Map<ParameterFacetType, FacetParameter> = new Map();

  private entries: FacetSearchElement[];

  private selectedTimespan: Timespan;

  private filteredEntries: FacetSearchElement[];

  private nullable = false;

  constructor(
    @Optional() config?: FacetSearchConfig
  ) {
    if (config && config.showZeroValues) { this.nullable = config.showZeroValues; }
  }

  public setEntries(ts: FacetSearchElement[]) {
    this.entries = ts;
    this.setFilteredEntries();
  }

  public getResults(): Observable<FacetSearchElement[]> {
    return this.onResultsChanged.asObservable();
  }

  public getParameterList(type: ParameterFacetType, sort: ParameterFacetSort): FacetParameter[] {
    let params: FacetParameter[] = [];
    if (this.filteredEntries) {
      switch (type) {
        case ParameterFacetType.category:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.category); }
          this.filteredEntries.forEach(e => this.addParameter(params, ParameterFacetType.category, e.category));
          break;
        case ParameterFacetType.feature:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.feature); }
          this.filteredEntries.forEach(e => this.addParameter(params, ParameterFacetType.feature, e.feature));
          break;
        case ParameterFacetType.offering:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.offering); }
          this.filteredEntries.forEach(e => this.addParameter(params, ParameterFacetType.offering, e.offering));
          break;
        case ParameterFacetType.phenomenon:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.phenomenon); }
          this.filteredEntries.forEach(e => this.addParameter(params, ParameterFacetType.phenomenon, e.phenomenon));
          break;
        case ParameterFacetType.procedure:
          if (this.nullable) { params = this.createEmptyParamList(ParameterFacetType.procedure); }
          this.filteredEntries.forEach(e => this.addParameter(params, ParameterFacetType.procedure, e.procedure));
          break;
      }
    }
    return this.sortParameters(params, sort);
  }

  public getSelectedParameter(type: ParameterFacetType): FacetParameter {
    if (this.facets.has(type)) {
      return this.facets.get(type);
    }
  }

  public selectParameter(type: ParameterFacetType, parameter: FacetParameter) {
    if (parameter.selected) {
      this.facets.set(type, parameter);
    } else {
      this.facets.delete(type);
    }
    this.setFilteredEntries();
  }

  public areFacetsSelected(): boolean {
    return this.facets.size > 0 || !!this.selectedTimespan;
  }

  public getFilteredResults(): FacetSearchElement[] {
    return this.filteredEntries;
  }

  public getCompleteTimespan(): Timespan {
    return this.createTimespan(this.entries);
  }

  public setSelectedTimespan(timespan: Timespan) {
    this.selectedTimespan = timespan;
    this.setFilteredEntries();
  }

  public getSelectedTimespan(): Timespan {
    return this.selectedTimespan;
  }

  public getFilteredTimespan(): Timespan {
    return this.createTimespan(this.filteredEntries);
  }

  public resetAllFacets() {
    this.facets.clear();
    this.selectedTimespan = null;
    this.setFilteredEntries();
  }

  private createTimespan(entries: FacetSearchElement[]): Timespan {
    let timespan: Timespan = null;
    if (entries.length > 0) {
      timespan = { from: Infinity, to: 0 };
      entries.forEach(e => {
        if (e.firstValue && e.lastValue) {
          if (e.firstValue.timestamp < timespan.from) { timespan.from = e.firstValue.timestamp; }
          if (e.lastValue.timestamp > timespan.to) { timespan.to = e.lastValue.timestamp; }
        }
      });
    }
    if (timespan.from !== Infinity && timespan.to !== 0) {
      return timespan;
    }
  }

  private setFilteredEntries() {
    if (this.facets.size > 0 || this.selectedTimespan) {
      this.filteredEntries = this.entries.filter(e => {
        const matchCategory = e.category ? this.checkFacet(ParameterFacetType.category, e.category.id) : true;
        const matchFeature = e.feature ? this.checkFacet(ParameterFacetType.feature, e.feature.id) : true;
        const matchOffering = e.offering ? this.checkFacet(ParameterFacetType.offering, e.offering.id) : true;
        const matchPhenomenon = e.phenomenon ? this.checkFacet(ParameterFacetType.phenomenon, e.phenomenon.id) : true;
        const matchProcedure = e.procedure ? this.checkFacet(ParameterFacetType.procedure, e.procedure.id) : true;
        const matchTimespan = this.checkTimespan(e);
        return matchCategory && matchFeature && matchOffering && matchPhenomenon && matchProcedure && matchTimespan;
      });
    } else {
      this.filteredEntries = this.entries;
    }
    if (this.filteredEntries) {
      this.onResultsChanged.next(this.filteredEntries);
    }
  }

  private checkTimespan(ts: FacetSearchElement): boolean {
    if (this.selectedTimespan) {
      const checkfrom = ts.lastValue && ts.lastValue.timestamp ? this.selectedTimespan.from <= ts.lastValue.timestamp : true;
      const checkTo = ts.firstValue && ts.firstValue.timestamp ? this.selectedTimespan.to >= ts.firstValue.timestamp : true;
      return checkfrom && checkTo;
    }
    return true;
  }

  private checkFacet(type: ParameterFacetType, parameterId: string): boolean {
    if (this.facets.has(type)) {
      return parameterId === this.facets.get(type).id;
    }
    return true;
  }

  private sortParameters(list: FacetParameter[], sort: ParameterFacetSort): FacetParameter[] {
    if (sort === null || sort === ParameterFacetSort.none) { return list; }
    list.sort((a, b) => {
      switch (sort) {
        case ParameterFacetSort.ascCount:
          return a.count - b.count;
        case ParameterFacetSort.descCount:
          return b.count - a.count;
        case ParameterFacetSort.ascAlphabet:
          return b.label < a.label ? 1 : -1;
        case ParameterFacetSort.descAlphabet:
          return b.label > a.label ? 1 : -1;
      }
    });
    return list;
  }

  private addParameter(list: FacetParameter[], type: ParameterFacetType, entry: FacetSearchElementParameter) {
    if (entry) {
      const existing = list.find(e => e.label === entry.label);
      if (existing) {
        existing.count += 1;
      } else {
        list.push({
          id: entry.id,
          label: entry.label,
          count: 1,
          selected: this.checkSelection(type, entry.id)
        });
      }
    }
  }

  private createEmptyParamList(type: ParameterFacetType): FacetParameter[] {
    const params: FacetParameter[] = [];
    this.entries.forEach(ts => {
      if (ts[type] && !params.find(e => e.label === ts[type].label)) {
        params.push({
          id: ts[type].id,
          label: ts[type].label,
          count: 0,
          selected: this.checkSelection(type, ts[type].id)
        });
      }
    });
    return params;
  }

  private checkSelection(type: ParameterFacetType, id: string): boolean {
    return this.facets.has(type) && this.facets.get(type).id === id;
  }

}
