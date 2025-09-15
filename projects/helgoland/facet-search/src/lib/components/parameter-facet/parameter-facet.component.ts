import { NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { MatchLabelPipe } from '@helgoland/core';
import { Subscription } from 'rxjs';

import {
  FacetParameter,
  FacetSearchService,
  ParameterFacetSort,
  ParameterFacetType,
} from '../../facet-search-model';

@Component({
  selector: 'n52-parameter-facet',
  templateUrl: './parameter-facet.component.html',
  styleUrls: ['./parameter-facet.component.scss'],
  imports: [NgStyle, MatchLabelPipe],
})
export class ParameterFacetComponent implements OnInit, OnDestroy {
  readonly facetSearchService = input.required<FacetSearchService>();

  readonly type = input.required<ParameterFacetType>();

  readonly sort = input<ParameterFacetSort>(ParameterFacetSort.descCount);

  readonly textualFilter = input<string>();

  parameterList: FacetParameter[] = [];

  private resultSubs: Subscription | undefined;

  constructor() {}

  ngOnInit() {
    this.resultSubs = this.facetSearchService()
      .getResults()
      .subscribe(() => this.fetchFacetParameter());
  }

  ngOnDestroy(): void {
    this.resultSubs?.unsubscribe();
  }

  toggleFacet(parameter: FacetParameter) {
    parameter.selected = !parameter.selected;
    this.facetSearchService().selectParameter(this.type(), parameter);
  }

  private fetchFacetParameter() {
    this.parameterList = this.facetSearchService().getParameterList(
      this.type(),
      this.sort(),
    );
  }
}
