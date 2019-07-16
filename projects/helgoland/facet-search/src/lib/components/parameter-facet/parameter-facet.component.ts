import { Component, Input, OnInit } from '@angular/core';
import { Required } from '@helgoland/core';

import { FacetParameter, FacetSearch, ParameterFacetSort, ParameterFacetType } from '../../facet-search-model';

@Component({
  selector: 'n52-parameter-facet',
  templateUrl: './parameter-facet.component.html',
  styleUrls: ['./parameter-facet.component.scss']
})
export class ParameterFacetComponent implements OnInit {

  @Input() @Required public facetSearchService: FacetSearch;

  @Input() @Required public type: ParameterFacetType;

  @Input() public sort: ParameterFacetSort = ParameterFacetSort.descCount;

  @Input() public textualFilter: string;

  public parameterList: FacetParameter[];

  constructor() { }

  ngOnInit() {
    this.facetSearchService.onResultsChanged.subscribe(() => this.fetchFacetParameter());
  }

  public toggleFacet(parameter: FacetParameter) {
    parameter.selected = !parameter.selected;
    this.facetSearchService.selectParameter(this.type, parameter);
  }

  private fetchFacetParameter() {
    this.parameterList = this.facetSearchService.getParameterList(this.type, this.sort);
  }

}
