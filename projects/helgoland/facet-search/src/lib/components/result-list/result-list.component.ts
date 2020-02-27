import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HelgolandTimeseries, Required } from '@helgoland/core';
import { Subscription } from 'rxjs';

import { FacetSearchService } from '../../facet-search.service';

@Component({
  selector: 'n52-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit, OnDestroy {

  @Input() @Required public facetSearchService: FacetSearchService;

  @Output() public selected: EventEmitter<HelgolandTimeseries> = new EventEmitter();

  public timeseries: HelgolandTimeseries[];

  private resultSubs: Subscription;

  constructor() { }

  ngOnInit() {
    this.resultSubs = this.facetSearchService.getResults().subscribe(ts => this.timeseries = ts);
    this.timeseries = this.facetSearchService.getFilteredResults();
  }

  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();
  }

  public timeseriesSelected(ts: HelgolandTimeseries) {
    this.selected.emit(ts);
  }

}
