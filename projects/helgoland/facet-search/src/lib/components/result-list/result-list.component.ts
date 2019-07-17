import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Required, Timeseries } from '@helgoland/core';
import { Subscription } from 'rxjs';

import { FacetSearch } from '../../facet-search-model';

@Component({
  selector: 'n52-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit, OnDestroy {

  @Input() @Required public facetSearchService: FacetSearch;

  @Output() public selected: EventEmitter<Timeseries> = new EventEmitter();

  public timeseries: Timeseries[];

  private resultSubs: Subscription;

  constructor() { }

  ngOnInit() {
    this.resultSubs = this.facetSearchService.getResults().subscribe(ts => this.timeseries = ts);
    this.timeseries = this.facetSearchService.getFilteredResults();
  }

  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();
  }

  public timeseriesSelected(ts: Timeseries) {
    this.selected.emit(ts);
  }

}
