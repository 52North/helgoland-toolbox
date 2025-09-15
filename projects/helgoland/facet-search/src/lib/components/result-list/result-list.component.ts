import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { TzDatePipe } from '@helgoland/core';
import { Subscription } from 'rxjs';

import {
  FacetSearchElement,
  FacetSearchService,
} from '../../facet-search-model';

@Component({
  selector: 'n52-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  imports: [TzDatePipe],
})
export class ResultListComponent implements OnInit, OnDestroy {
  readonly facetSearchService = input.required<FacetSearchService>();

  readonly selected = output<FacetSearchElement>();

  entries: FacetSearchElement[] = [];

  private resultSubs: Subscription | undefined;

  constructor() {}

  ngOnInit() {
    this.resultSubs = this.facetSearchService()
      .getResults()
      .subscribe((ts) => (this.entries = ts));
    this.entries = this.facetSearchService().getFilteredResults();
  }

  ngOnDestroy(): void {
    this.resultSubs?.unsubscribe();
  }

  timeseriesSelected(ts: FacetSearchElement) {
    this.selected.emit(ts);
  }
}
