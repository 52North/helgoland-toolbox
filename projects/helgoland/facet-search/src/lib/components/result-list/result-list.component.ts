import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Required } from '@helgoland/core';
import { Subscription } from 'rxjs';

import { FacetSearchElement, FacetSearchService } from '../../facet-search-model';

@Component({
  selector: 'n52-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit, OnDestroy {

  @Input() @Required public facetSearchService: FacetSearchService;

  @Output() public selected: EventEmitter<FacetSearchElement> = new EventEmitter();

  public entries: FacetSearchElement[];

  private resultSubs: Subscription;

  constructor() { }

  ngOnInit() {
    this.resultSubs = this.facetSearchService.getResults().subscribe(ts => this.entries = ts);
    this.entries = this.facetSearchService.getFilteredResults();
  }

  ngOnDestroy(): void {
    this.resultSubs.unsubscribe();
  }

  public timeseriesSelected(ts: FacetSearchElement) {
    this.selected.emit(ts);
  }

}
