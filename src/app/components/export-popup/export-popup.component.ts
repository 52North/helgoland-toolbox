import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelgolandCoreModule, HelgolandTimeseries, Timespan } from '@helgoland/core';
import { DownloadType, ExportOptions, HelgolandDatasetDownloadModule } from '@helgoland/depiction';

@Component({
  selector: 'n52-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.css'],
  imports: [
    HelgolandDatasetDownloadModule,
    MatDatepickerModule,
    FormsModule,
    HelgolandCoreModule,
    CommonModule
  ],
  standalone: true
})
export class ExportPopupComponent {

  public exportOptions!: ExportOptions;
  public inputId: string;
  public loading = false;
  // pre-define variable metadata to avoid errors (undefined)
  public dataset: HelgolandTimeseries | undefined;
  public disabled = false;

  public selectedStart: Date | undefined;
  public selectedEnd: Date | undefined;

  constructor(
    public dialogRef: MatDialogRef<ExportPopupComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: { id: string, timespan: Timespan }
  ) {
    this.inputId = data.id;

    if (data.timespan) {
      this.selectedStart = new Date(data.timespan.from);
      this.selectedEnd = new Date(data.timespan.to);
    }
  }

  public onCSVDownload() {
    this.onDownload(DownloadType.CSV);
  }

  /**
   * Function that triggers the download of the data based on the specified parameters.
   * @param dwType {string} typy of the download file (csv or xlsx)
   */
  public onDownload(dwType: DownloadType): void {
    if (this.selectedStart && this.selectedEnd) {
      this.exportOptions = {
        downloadType: dwType,
        timeperiod: new Timespan(this.selectedStart, this.selectedEnd)
      };
    }
  }

  /**
   * Function that retrieves data about the selected dataset via inputId.
   * @param metadata {ExportData} information about the dataset
   */
  public onMetadata(dataset: HelgolandTimeseries): void {
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
  public onLoading(loading: boolean): void {
    this.loading = loading;
  }

  public onClose(): void {
    this.dialogRef.close('closes');
  }

}
