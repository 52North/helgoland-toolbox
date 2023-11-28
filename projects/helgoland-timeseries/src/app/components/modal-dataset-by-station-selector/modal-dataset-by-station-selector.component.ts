import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { HelgolandCoreModule, HelgolandServicesConnector } from "@helgoland/core";
import { HelgolandLabelMapperModule } from "@helgoland/depiction";
import { DatasetByStationSelectorComponent, SelectableDataset } from "@helgoland/selector";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { AppRouterService } from "../../services/app-router.service";
import { TimeseriesService } from "./../../services/timeseries-service.service";

@Component({
  selector: 'helgoland-modal-dataset-by-station-selector',
  templateUrl: './modal-dataset-by-station-selector.component.html',
  styleUrls: ['./modal-dataset-by-station-selector.component.scss'],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    HelgolandLabelMapperModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule,
    TranslateModule
  ],
  standalone: true
})
export class ModalDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent {

  constructor(
    protected override servicesConnector: HelgolandServicesConnector,
    public override translateSrvc: TranslateService,
    public appRouter: AppRouterService,
    public timeseries: TimeseriesService
  ) {
    super(servicesConnector, translateSrvc);
  }

  protected override prepareResult(result: SelectableDataset, selection: boolean) {
    if (this.timeseries.hasDataset(result.internalId)) {
      selection = true;
    }
    super.prepareResult(result, selection);
  }

  public adjustSelection(change: MatSelectionListChange) {
    const id = (change.options[0].value as SelectableDataset).internalId;
    if (change.options[0].selected) {
      this.timeseries.addDataset(id);
    } else {
      this.timeseries.removeDataset(id);
    }
  }

}
