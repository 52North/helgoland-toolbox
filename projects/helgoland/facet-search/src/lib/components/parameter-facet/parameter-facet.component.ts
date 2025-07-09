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
  public readonly facetSearchService = input.required<FacetSearchService>();

  public readonly type = input.required<ParameterFacetType>();

  public readonly sort = input<ParameterFacetSort>(
    ParameterFacetSort.descCount,
  );

  public readonly textualFilter = input<string>();

  public parameterList: FacetParameter[] = [];

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

  public toggleFacet(parameter: FacetParameter) {
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
