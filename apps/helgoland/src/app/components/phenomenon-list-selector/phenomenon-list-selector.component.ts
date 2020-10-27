import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { HelgolandServicesConnector } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-toolbox-phenomenon-list-selector',
  templateUrl: './phenomenon-list-selector.component.html',
  styleUrls: ['./phenomenon-list-selector.component.scss']
})
export class PhenomenonListSelectorComponent extends MultiServiceFilterSelectorComponent implements OnInit {

  @ViewChild(MatSelectionList) list: MatSelectionList;

  constructor(
    protected translate: TranslateService,
    protected servicesConnector: HelgolandServicesConnector,
    protected timeseriesSrvc: TimeseriesService
  ) {
    super(servicesConnector, translate);
  }

  ngOnInit(): void { }

  public selectionChanged(selection: MatSelectionListChange) {
    const match = this.items.find(e => e.id === selection.option.value);
    this.onItemSelected.emit(match);
  }

}
