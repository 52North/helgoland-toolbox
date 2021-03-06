import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { HelgolandServicesConnector } from '@helgoland/core';
import { DatasetByStationSelectorComponent, SelectableDataset } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

import { AppRouterService } from '../../services/app-router.service';
import { TimeseriesService } from './../../services/timeseries-service.service';

@Component({
  selector: 'helgoland-modal-dataset-by-station-selector',
  templateUrl: './modal-dataset-by-station-selector.component.html',
  styleUrls: ['./modal-dataset-by-station-selector.component.scss']
})
export class ModalDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent {

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    public translateSrvc: TranslateService,
    public appRouter: AppRouterService,
    public timeseries: TimeseriesService
  ) {
    super(servicesConnector, translateSrvc);
  }

  protected prepareResult(result: SelectableDataset, selection: boolean) {
    if (this.timeseries.hasDataset(result.internalId)) {
      selection = true;
    }
    super.prepareResult(result, selection);
  }

  public adjustSelection(change: MatSelectionListChange) {
    const id = (change.option.value as SelectableDataset).internalId;
    if (change.option.selected) {
      this.timeseries.addDataset(id);
    } else {
      this.timeseries.removeDataset(id);
    }
  }

}
