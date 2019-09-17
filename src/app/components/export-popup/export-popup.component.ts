import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExportData, ExportOptions } from '@helgoland/depiction';
import { FormControl } from '@angular/forms';

interface TimePeriod {
  from: Date;
  to: Date;
}

@Component({
  selector: 'n52-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.css']
})
export class ExportPopupComponent implements OnInit {

  public exportOptions: ExportOptions;
  public inputId: string;
  public loading = false;
  // pre-define variable metadata to avoid errors (undefined)
  public metadata: ExportData = {
    phenomenon: null,
    uom: null,
    firstvalue: null,
    lastvalue: null,
    timeperiod: {
      from: new Date(),
      to: new Date()
    },
    timezone: null,
    station: null
  };
  public timeperiod: TimePeriod;
  public timezone: string;
  public disabled = false;

  public dateFrom = new FormControl(new Date());
  public dateTo = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<ExportPopupComponent>,

    @Inject(MAT_DIALOG_DATA)
    public id: string
  ) {
    this.inputId = id;
  }

  ngOnInit() { }

  /**
   * Function that triggers the download of the data based on the specified parameters.
   * @param dwType {string} typy of the download file (csv or xlsx)
   */
  public onDownload(dwType: string): void {
    this.exportOptions = {
      downloadType: dwType,
      timeperiod: {
        from: this.metadata.timeperiod.from,
        to: this.metadata.timeperiod.to
      },
      timezone: this.metadata.timezone
    };
  }

  /**
   * Function that retrieves data about the selected dataset via inputId.
   * @param metadata {ExportData} information about the dataset
   */
  public onMetadata(metadata: ExportData): void {
    this.metadata = metadata;
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
