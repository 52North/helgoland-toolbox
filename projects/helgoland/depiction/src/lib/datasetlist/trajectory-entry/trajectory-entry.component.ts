import { NgClass, NgStyle } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  DatasetFilter,
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTrajectory,
  InternalDatasetId,
  InternalIdHandler,
} from "@helgoland/core";
import { TranslateService } from "@ngx-translate/core";

import { ListEntryComponent } from "../list-entry.component";

@Component({
  selector: "n52-trajectory-entry",
  templateUrl: "./trajectory-entry.component.html",
  standalone: true,
  imports: [NgClass, NgStyle]
})
export class TrajectoryEntryComponent extends ListEntryComponent {

    @Input()
  public datasetOptions: DatasetOptions | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    public dataset: HelgolandTrajectory | undefined;

    public tempColor: string | undefined;

    constructor(
        protected servicesConnector: HelgolandServicesConnector,
        protected override internalIdHandler: InternalIdHandler,
        protected override translateSrvc: TranslateService
    ) {
      super(internalIdHandler, translateSrvc);
    }

    public toggleVisibility() {
      if (this.datasetOptions) {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
      }
    }

    public editDatasetOptions(options: DatasetOptions) {
      this.onEditOptions.emit(options);
    }

    protected loadDataset(internalId: InternalDatasetId, locale?: string): void {
      const params: DatasetFilter = {};
      if (locale) { params.locale = locale; }
      this.loading = true;
      this.servicesConnector.getDataset(internalId, { ...params, type: DatasetType.Trajectory })
        .subscribe(
          trajectory => this.setTrajectory(trajectory),
          error => this.handleTrajectoryLoadError(error),
        );
    }

    protected handleTrajectoryLoadError(error: any): void {
      console.error(error);
      this.loading = false;
    }

    protected setTrajectory(trajectory: HelgolandTrajectory) {
      this.dataset = trajectory;
      this.loading = false;
    }
}
