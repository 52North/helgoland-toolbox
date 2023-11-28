import { NgClass, NgStyle } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  DatasetFilter,
  DatasetType,
  HelgolandLocatedProfileData,
  HelgolandProfile,
  HelgolandServicesConnector,
  InternalDatasetId,
  InternalIdHandler,
  TimedDatasetOptions,
  Timespan,
  TzDatePipe,
} from "@helgoland/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { LabelMapperComponent } from "../../label-mapper/label-mapper.component";
import { ListEntryComponent } from "../list-entry.component";

@Component({
  selector: "n52-profile-entry",
  templateUrl: "./profile-entry.component.html",
  styleUrls: ["./profile-entry.component.scss"],
  standalone: true,
  imports: [NgClass, LabelMapperComponent, NgStyle, TranslateModule, TzDatePipe]
})
export class ProfileEntryComponent extends ListEntryComponent {

    @Input()
  public datasetOptions: TimedDatasetOptions[] | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onUpdateOptions: EventEmitter<TimedDatasetOptions[]> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onDeleteDatasetOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onEditOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onOpenInCombiView: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onShowGeometry: EventEmitter<GeoJSON.GeoJsonObject> = new EventEmitter();

    public dataset: HelgolandProfile | undefined;

    public editableOptions: TimedDatasetOptions | undefined;
    public tempColor: string | undefined;

    constructor(
        protected servicesConnector: HelgolandServicesConnector,
        protected override internalIdHandler: InternalIdHandler,
        protected override translateSrvc: TranslateService
    ) {
      super(internalIdHandler, translateSrvc);
    }

    public removeDatasetOptions(options: TimedDatasetOptions) {
      this.onDeleteDatasetOptions.emit(options);
    }

    public editDatasetOptions(options: TimedDatasetOptions) {
      this.onEditOptions.emit(options);
    }

    public toggleVisibility(options: TimedDatasetOptions) {
      options.visible = !options.visible;
      this.onUpdateOptions.emit(this.datasetOptions);
    }

    public openInCombiView(option: TimedDatasetOptions) {
      this.onOpenInCombiView.emit(option);
    }

    public showGeometry(dataset: HelgolandProfile, option: TimedDatasetOptions) {
      const internalId = this.internalIdHandler.resolveInternalId(this.datasetId);
      if (dataset.isMobile) {
        const timespan = new Timespan(option.timestamp);
        this.servicesConnector.getDatasetData(dataset, timespan).subscribe(
          result => {
            if (result.values.length === 1 && result instanceof HelgolandLocatedProfileData) {
              this.onShowGeometry.emit(result.values[0].geometry);
            }
          }
        );
      } else if (dataset.parameters.platform) {
        this.servicesConnector.getPlatform(dataset.parameters.platform.id, internalId.url)
          .subscribe((station) => this.onShowGeometry.emit(station.geometry));
      }
    }

    protected loadDataset(internalId: InternalDatasetId, locale?: string) {
      const params: DatasetFilter = {};
      if (locale) { params.locale = locale; }
      this.loading = true;
      this.servicesConnector.getDataset(internalId, { ...params, type: DatasetType.Profile }).subscribe(
        dataset => this.dataset = dataset,
        error => console.error(error),
        () => this.loading = false
      );
    }

}
