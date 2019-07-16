import { EventEmitter, Injectable } from '@angular/core';
import { Timeseries, Timespan } from '@helgoland/core';

import { FacetParameter, FacetSearch, ParameterFacetSort, ParameterFacetType } from './facet-search-model';

@Injectable({
  providedIn: 'root'
})
export class FacetSearchService implements FacetSearch {

  public onResultsChanged: EventEmitter<Timeseries[]>;

  private facets: Map<ParameterFacetType, FacetParameter> = new Map();

  private timeseries: Timeseries[];

  private selectedTimspan: Timespan;

  private filteredTimeseries: Timeseries[];

  constructor() {
    this.onResultsChanged = new EventEmitter();
  }

  public setTimeseries(ts: Timeseries[]) {
    this.timeseries = ts;
    this.setFilteredTimeseries();
  }

  public getParameterList(type: ParameterFacetType, sort: ParameterFacetSort): FacetParameter[] {
    const params = [];
    switch (type) {
      case ParameterFacetType.category:
        this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.category, e.parameters.category.label));
        break;
      case ParameterFacetType.feature:
        this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.feature, e.parameters.feature.label));
        break;
      case ParameterFacetType.offering:
        this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.offering, e.parameters.offering.label));
        break;
      case ParameterFacetType.phenomenon:
        this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.phenomenon, e.parameters.phenomenon.label));
        break;
      case ParameterFacetType.procedure:
        this.filteredTimeseries.forEach(e => this.addParameter(params, ParameterFacetType.procedure, e.parameters.procedure.label));
        break;
    }
    return this.sortParameters(params, sort);
  }

  public selectParameter(type: ParameterFacetType, parameter: FacetParameter) {
    if (parameter.selected) {
      this.facets.set(type, parameter);
    } else {
      this.facets.delete(type);
    }
    this.setFilteredTimeseries();
  }

  public setTimespan(timespan: Timespan) {
    this.selectedTimspan = timespan;
    this.setFilteredTimeseries();
  }

  public getFilteredResults(): Timeseries[] {
    return this.filteredTimeseries;
  }

  public getTimespan(): Timespan {
    let timespan: Timespan = null;
    if (this.filteredTimeseries.length > 0) {
      timespan = { from: Infinity, to: 0 };
      this.filteredTimeseries.forEach(e => {
        if (e.firstValue.timestamp < timespan.from) { timespan.from = e.firstValue.timestamp; }
        if (e.lastValue.timestamp > timespan.to) { timespan.to = e.lastValue.timestamp; }
      });
    }
    return timespan;
  }

  private setFilteredTimeseries() {
    if (this.facets.size > 0 || this.selectedTimspan) {
      this.filteredTimeseries = this.timeseries.filter(e => {
        const matchCategory = this.checkFacet(ParameterFacetType.category, e.parameters.category.label);
        const matchFeature = this.checkFacet(ParameterFacetType.feature, e.parameters.feature.label);
        const matchOffering = this.checkFacet(ParameterFacetType.offering, e.parameters.offering.label);
        const matchPhenomenon = this.checkFacet(ParameterFacetType.phenomenon, e.parameters.phenomenon.label);
        const matchProcedure = this.checkFacet(ParameterFacetType.procedure, e.parameters.procedure.label);
        const matchTimespan = this.checkTimespan(e);
        return matchCategory && matchFeature && matchOffering && matchPhenomenon && matchProcedure && matchTimespan;
      });
    } else {
      this.filteredTimeseries = this.timeseries;
    }
    this.onResultsChanged.emit(this.filteredTimeseries);
  }

  private checkTimespan(ts: Timeseries): boolean {
    if (this.selectedTimspan) {
      const checkfrom = this.selectedTimspan.from <= ts.lastValue.timestamp && this.selectedTimspan.to >= ts.firstValue.timestamp;
      return checkfrom;
    }
    return true;
  }

  private checkFacet(type: ParameterFacetType, parameter: string): boolean {
    if (this.facets.has(type)) {
      return parameter === this.facets.get(type).label;
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

  private addParameter(list: FacetParameter[], type: ParameterFacetType, entry: string) {
    const existing = list.find(e => e.label === entry);
    if (existing) {
      existing.count += 1;
    } else {
      list.push({
        label: entry,
        count: 1,
        selected: this.checkSelection(type, entry)
      });
    }
  }

  private checkSelection(type: ParameterFacetType, entry: string): boolean {
    return this.facets.has(type) && this.facets.get(type).label === entry;
  }

}
