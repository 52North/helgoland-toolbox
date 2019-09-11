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

  public onMetadata(metadata: ExportData): void {
    this.metadata = metadata;
    this.disabled = true;
  }

  public onLoading(loading: boolean): void {
    this.loading = loading;
  }

  public onClose(): void {
    this.dialogRef.close('closes');
  }

}
