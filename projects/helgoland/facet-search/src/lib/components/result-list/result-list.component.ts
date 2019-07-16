import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Required, Timeseries } from '@helgoland/core';

import { FacetSearch } from '../../facet-search-model';

@Component({
  selector: 'n52-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {

  @Input() @Required public facetSearchService: FacetSearch;

  @Output() public selected: EventEmitter<Timeseries> = new EventEmitter();

  public timeseries: Timeseries[];

  constructor() { }

  ngOnInit() {
    this.facetSearchService.onResultsChanged.subscribe(ts => this.timeseries = ts);
    this.timeseries = this.facetSearchService.getFilteredResults();
  }

  public timeseriesSelected(ts: Timeseries) {
    this.selected.emit(ts);
  }

}
