import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  HelgolandCoreModule,
  HelgolandTimeseries,
  Timespan,
} from '@helgoland/core';
import {
  DownloadType,
  ExportOptions,
  HelgolandDatasetDownloadModule,
} from '@helgoland/depiction';

@Component({
  selector: 'n52-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.css'],
  imports: [
    HelgolandDatasetDownloadModule,
    MatDatepickerModule,
    FormsModule,
    HelgolandCoreModule,
  ],
})
export class ExportPopupComponent {
  dialogRef = inject<MatDialogRef<ExportPopupComponent>>(MatDialogRef);
  data = inject<{
    id: string;
    timespan: Timespan;
  }>(MAT_DIALOG_DATA);

  exportOptions!: ExportOptions;
  inputId: string;
  loading = false;
  // pre-define variable metadata to avoid errors (undefined)
  dataset: HelgolandTimeseries | undefined;
  disabled = false;

  selectedStart: Date | undefined;
  selectedEnd: Date | undefined;

  constructor() {
    this.inputId = this.data.id;

    if (this.data.timespan) {
      this.selectedStart = new Date(this.data.timespan.from);
      this.selectedEnd = new Date(this.data.timespan.to);
    }
  }

  onCSVDownload() {
    this.onDownload(DownloadType.CSV);
  }

  onXSLXDownload() {
    this.onDownload(DownloadType.XLSX);
  }

  /**
   * Function that triggers the download of the data based on the specified parameters.
   * @param dwType {string} typy of the download file (csv or xlsx)
   */
  onDownload(dwType: DownloadType): void {
    if (this.selectedStart && this.selectedEnd) {
      this.exportOptions = {
        downloadType: dwType,
        timeperiod: new Timespan(this.selectedStart, this.selectedEnd),
      };
    }
  }

  /**
   * Function that retrieves data about the selected dataset via inputId.
   * @param metadata {ExportData} information about the dataset
   */
  onMetadata(dataset: HelgolandTimeseries): void {
    if (!this.selectedStart && dataset.firstValue) {
      this.selectedStart = new Date(dataset.firstValue.timestamp);
    }
    if (!this.selectedEnd && dataset.lastValue) {
      this.selectedEnd = new Date(dataset.lastValue.timestamp);
    }
    this.dataset = dataset;
    this.disabled = true;
  }

  /**
   * Function indicating the download status.
   * @param loading {boolean} indicates loading of the download progress
   */
  onLoading(loading: boolean): void {
    this.loading = loading;
  }

  onClose(): void {
    this.dialogRef.close('closes');
  }
}
