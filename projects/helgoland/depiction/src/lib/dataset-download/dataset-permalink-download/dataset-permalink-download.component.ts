import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import {
  DatasetApiMapping,
  HelgolandCsvExportLinkParams,
  HelgolandServicesConnector,
  InternalDatasetId,
  InternalIdHandler,
  Timespan,
} from "@helgoland/core";
import { TranslateModule } from "@ngx-translate/core";


@Component({
  selector: 'n52-dataset-permalink-download',
  templateUrl: './dataset-permalink-download.component.html',
  styleUrls: ['./dataset-permalink-download.component.css'],
  standalone: true,
  imports: [TranslateModule]
})
export class DatasetPermalinkDownloadComponent implements OnChanges, OnInit {

  @Input()
  public internalId: InternalDatasetId | string | undefined;

  @Input()
  public timeInterval: Timespan | undefined;

  @Input()
  public language: string | undefined;

  public downloadLink: string | undefined;

  constructor(
    protected apiMapping: DatasetApiMapping,
    protected internalIdHandler: InternalIdHandler,
    protected servicesConnector: HelgolandServicesConnector
  ) { }

  ngOnInit(): void {
    if (this.internalId && this.timeInterval) {
      this.createLink(this.internalId, this.timeInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeInterval']) {
      if (this.internalId && this.timeInterval) {
        this.createLink(this.internalId, this.timeInterval);
      }
    }
  }

  private createLink(internalId: string | InternalDatasetId, timespan: Timespan) {
    const params: HelgolandCsvExportLinkParams = {
      zip: true,
      generalize: true,
      timespan
    };
    params.lang = this.language && this.language !== '' ? this.language : 'en';
    this.servicesConnector.createCsvDataExportLink(internalId, params).subscribe(link => this.downloadLink = link);
  }

}
