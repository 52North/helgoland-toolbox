import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Required, TzDatePipe } from '@helgoland/core';
import { Subscription } from 'rxjs';

import { FacetSearchElement, FacetSearchService } from '../../facet-search-model';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'n52-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, TzDatePipe]
})
export class ResultListComponent implements OnInit, OnDestroy {

  @Input() @Required public facetSearchService!: FacetSearchService;

  @Output() public selected: EventEmitter<FacetSearchElement> = new EventEmitter();

  public entries: FacetSearchElement[] = [];

  private resultSubs: Subscription | undefined;

  constructor() { }

  ngOnInit() {
    this.resultSubs = this.facetSearchService.getResults().subscribe(ts => this.entries = ts);
    this.entries = this.facetSearchService.getFilteredResults();
  }

  ngOnDestroy(): void {
    this.resultSubs?.unsubscribe();
  }

  public timeseriesSelected(ts: FacetSearchElement) {
    this.selected.emit(ts);
  }

}
