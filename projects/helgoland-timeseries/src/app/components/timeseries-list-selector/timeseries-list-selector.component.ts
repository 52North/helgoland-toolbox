import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatListModule, MatSelectionListChange } from "@angular/material/list";
import { HelgolandDataset, HelgolandServicesConnector } from "@helgoland/core";
import { MultiServiceFilterSelectorComponent } from "@helgoland/selector";
import { TranslateService } from "@ngx-translate/core";

import { TimeseriesService } from "./../../services/timeseries-service.service";

@Component({
  selector: "helgoland-timeseries-list-selector",
  templateUrl: "./timeseries-list-selector.component.html",
  styleUrls: ["./timeseries-list-selector.component.scss"],
  imports: [
    CommonModule,
    MatListModule
  ],
  standalone: true
})
export class TimeseriesListSelectorComponent extends MultiServiceFilterSelectorComponent {

  constructor(
    protected override servicesConnector: HelgolandServicesConnector,
    protected override translate: TranslateService,
    public timeseriesSrvc: TimeseriesService
  ) {
    super(servicesConnector, translate);
  }

  public selectionChanged(selection: MatSelectionListChange) {
    const ds = selection.options[0].value as HelgolandDataset;
    if (selection.options[0].selected) {
      this.timeseriesSrvc.addDataset(ds.internalId);
    } else {
      this.timeseriesSrvc.removeDataset(ds.internalId);
    }
  }

}
