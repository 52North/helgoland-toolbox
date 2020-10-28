import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { HelgolandDataset, HelgolandServicesConnector } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-timeseries-list-selector',
  templateUrl: './timeseries-list-selector.component.html',
  styleUrls: ['./timeseries-list-selector.component.scss']
})
export class TimeseriesListSelectorComponent extends MultiServiceFilterSelectorComponent {

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected translate: TranslateService,
    public timeseriesSrvc: TimeseriesService
  ) {
    super(servicesConnector, translate);
  }

  public selectionChanged(selection: MatSelectionListChange) {
    const ds = selection.option.value as HelgolandDataset;
    if (selection.option.selected) {
      this.timeseriesSrvc.addDataset(ds.internalId);
    } else {
      this.timeseriesSrvc.removeDataset(ds.internalId);
    }
  }

}
