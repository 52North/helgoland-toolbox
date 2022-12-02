import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  DatasetApiMapping,
  HelgolandCsvExportLinkParams,
  HelgolandServicesConnector,
  InternalDatasetId,
  InternalIdHandler,
  Timespan,
} from '@helgoland/core';

@Component({
  selector: 'n52-dataset-permalink-download',
  templateUrl: './dataset-permalink-download.component.html',
  styleUrls: ['./dataset-permalink-download.component.css']
})
export class DatasetPermalinkDownloadComponent implements OnChanges, OnInit {

  @Input()
  public internalId: InternalDatasetId | string;

  @Input()
  public timeInterval: Timespan;

  @Input()
  public language: string;

  public downloadLink: string;

  constructor(
    protected apiMapping: DatasetApiMapping,
    protected internalIdHandler: InternalIdHandler,
    protected servicesConnector: HelgolandServicesConnector
  ) { }

  ngOnInit(): void {
    if (this.internalId && this.timeInterval) {
      this.createLink();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeInterval']) {
      if (this.internalId && this.timeInterval) {
        this.createLink();
      }
    }
  }

  private createLink() {
    const params: HelgolandCsvExportLinkParams = {
      zip: true,
      generalize: true
    };
    if (this.timeInterval) { params.timespan = this.timeInterval; }
    params.lang = this.language && this.language !== '' ? this.language : 'en';
    this.servicesConnector.createCsvDataExportLink(this.internalId, params).subscribe(link => this.downloadLink = link);
  }

}
