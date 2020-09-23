import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDataset, Timespan } from '@helgoland/core';
import { DownloadType, ExportOptions } from '@helgoland/depiction';

@Component({
  selector: 'n52-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.css']
})
export class ExportPopupComponent {

  public exportOptions: ExportOptions;
  public inputId: string;
  public loading = false;
  // pre-define variable metadata to avoid errors (undefined)
  public dataset: IDataset;
  public disabled = false;

  public selectedStart: Date;
  public selectedEnd: Date;

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

  public onXSLXDownload() {
    this.onDownload(DownloadType.XLSX);
  }

  /**
   * Function that triggers the download of the data based on the specified parameters.
   * @param dwType {string} typy of the download file (csv or xlsx)
   */
  public onDownload(dwType: DownloadType): void {
    this.exportOptions = {
      downloadType: dwType,
      timeperiod: new Timespan(this.selectedStart, this.selectedEnd)
    };
  }

  /**
   * Function that retrieves data about the selected dataset via inputId.
   * @param metadata {ExportData} information about the dataset
   */
  public onMetadata(dataset: IDataset): void {
    if (!this.selectedStart) {
      this.selectedStart = new Date(dataset.firstValue.timestamp);
    }
    if (!this.selectedEnd) {
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
