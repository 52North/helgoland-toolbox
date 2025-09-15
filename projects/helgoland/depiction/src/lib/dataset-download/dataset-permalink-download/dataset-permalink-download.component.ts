import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';
import {
  DatasetApiMapping,
  HelgolandCsvExportLinkParams,
  HelgolandServicesConnector,
  InternalDatasetId,
  InternalIdHandler,
  Timespan,
} from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'n52-dataset-permalink-download',
  templateUrl: './dataset-permalink-download.component.html',
  styleUrls: ['./dataset-permalink-download.component.css'],
  imports: [TranslateModule],
})
export class DatasetPermalinkDownloadComponent implements OnChanges, OnInit {
  protected apiMapping = inject(DatasetApiMapping);
  protected internalIdHandler = inject(InternalIdHandler);
  protected servicesConnector = inject(HelgolandServicesConnector);

  readonly internalId = input<InternalDatasetId | string>();

  readonly timeInterval = input<Timespan>();

  readonly language = input<string>();

  downloadLink: string | undefined;

  ngOnInit(): void {
    const internalId = this.internalId();
    const timeInterval = this.timeInterval();
    if (internalId && timeInterval) {
      this.createLink(internalId, timeInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeInterval']) {
      const internalId = this.internalId();
      const timeInterval = this.timeInterval();
      if (internalId && timeInterval) {
        this.createLink(internalId, timeInterval);
      }
    }
  }

  private createLink(
    internalId: string | InternalDatasetId,
    timespan: Timespan,
  ) {
    const params: HelgolandCsvExportLinkParams = {
      zip: true,
      generalize: true,
      timespan,
    };
    const language = this.language();
    params.lang = language && language !== '' ? language : 'en';
    this.servicesConnector
      .createCsvDataExportLink(internalId, params)
      .subscribe((link) => (this.downloadLink = link));
  }
}
