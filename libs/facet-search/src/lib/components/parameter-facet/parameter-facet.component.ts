import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Required } from '@helgoland/core';
import { Subscription } from 'rxjs';

import { FacetParameter, FacetSearchService, ParameterFacetSort, ParameterFacetType } from '../../facet-search-model';

@Component({
  selector: 'n52-parameter-facet',
  templateUrl: './parameter-facet.component.html',
  styleUrls: ['./parameter-facet.component.scss']
})
export class ParameterFacetComponent implements OnInit, OnDestroy {

  @Input() @Required public facetSearchService: FacetSearchService;

  @Input() @Required public type: ParameterFacetType;

  @Input() public sort: ParameterFacetSort = ParameterFacetSort.descCount;

  @Input() public textualFilter: string;

  public parameterList: FacetParameter[];

  private resultSubs: Subscription;

  constructor() { }

  ngOnInit() {
    this.resultSubs = this.facetSearchService.getResults().subscribe(() => this.fetchFacetParameter());
  }

  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();
  }

  public toggleFacet(parameter: FacetParameter) {
    parameter.selected = !parameter.selected;
    this.facetSearchService.selectParameter(this.type, parameter);
  }

  private fetchFacetParameter() {
    this.parameterList = this.facetSearchService.getParameterList(this.type, this.sort);
  }

}
