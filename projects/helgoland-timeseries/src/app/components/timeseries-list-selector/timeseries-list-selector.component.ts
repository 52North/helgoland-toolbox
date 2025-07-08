import { Component, inject } from '@angular/core';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { HelgolandDataset } from '@helgoland/core';
import { MultiServiceFilterSelectorComponent } from '@helgoland/selector';

import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-timeseries-list-selector',
  templateUrl: './timeseries-list-selector.component.html',
  styleUrls: ['./timeseries-list-selector.component.scss'],
  imports: [MatListModule],
})
export class TimeseriesListSelectorComponent extends MultiServiceFilterSelectorComponent {
  protected timeseriesSrvc = inject(TimeseriesService);

  public selectionChanged(selection: MatSelectionListChange) {
    const ds = selection.options[0].value as HelgolandDataset;
    if (selection.options[0].selected) {
      this.timeseriesSrvc.addDataset(ds.internalId);
    } else {
      this.timeseriesSrvc.removeDataset(ds.internalId);
    }
  }
}
