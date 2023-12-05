// @ts-nocheck
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import {
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  IDataset,
  Required,
  Time,
  Timespan,
} from "@helgoland/core";
import moment from "moment";

type xlsxExport = any[][];

/**
 * information that defines options for the export
 */
export interface ExportOptions {
  downloadType: DownloadType;
  timeperiod: Timespan;
}

export enum DownloadType {
  CSV = "csv"
}

@Component({
  selector: "n52-dataset-export",
  templateUrl: "./dataset-export.component.html",
  styleUrls: ["./dataset-export.component.scss"],
  standalone: true
})

export class DatasetExportComponent implements OnInit, OnChanges {

  private dataset: HelgolandTimeseries;
  private fileName = "timeseries";
  private timespan: Timespan;

  /**
   * options to define the export parameters
   */
  @Input()
  @Required
  public exportOptions!: ExportOptions;

  /**
   * id of the dataset that should be downloaded
   */
  @Input() public inputId: string;

  /**
   * returns the metadata of the selected dataset to be visualized
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onMetadataChange: EventEmitter<HelgolandTimeseries> = new EventEmitter();

  /**
   * Output to inform the loading status, while file is created
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onLoadingChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    protected timeSrvc: Time,
  ) { }

  ngOnInit() {
    if (this.inputId) {
      this.servicesConnector.getDataset(this.inputId, { type: DatasetType.Timeseries }).subscribe({
        next: ds => {
          this.dataset = ds;
          this.timespan = new Timespan(this.dataset.firstValue.timestamp, this.dataset.lastValue.timestamp);
          this.onMetadataChange.emit(ds);
        },
        error: error => this.onError(error)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["exportOptions"] && this.exportOptions) {
      this.timespan = this.exportOptions.timeperiod;
      // check if timespan is inside range
      if (this.timespan.from > this.timespan.to) {
        this.timespan = {
          from: this.timespan.to,
          to: this.timespan.from
        };
      }
      if (this.exportOptions.timeperiod.from < this.dataset.firstValue.timestamp) {
        this.timespan.from = this.dataset.firstValue.timestamp;
      } else if (this.exportOptions.timeperiod.from > this.dataset.lastValue.timestamp) {
        this.timespan.from = this.dataset.lastValue.timestamp;
      }
      if (this.exportOptions.timeperiod.to > this.dataset.lastValue.timestamp) {
        this.timespan.to = this.dataset.lastValue.timestamp;
      } else if (this.exportOptions.timeperiod.to < this.dataset.firstValue.timestamp) {
        this.timespan.to = this.dataset.firstValue.timestamp;
      }
      if (this.exportOptions.downloadType) {
        this.onDownload(this.exportOptions.downloadType);
      }
    }
  }

  public onDownload(downloadType: DownloadType): void {
    this.onLoadingChange.emit(true);
    this.fileName = this.inputId;
    if (this.dataset) {
      this.loadData(this.dataset, downloadType);
    }
  }

  private loadData(dataset: HelgolandTimeseries, dwType: DownloadType): void {
    console.log("Loading data ...");
    // get dataset data
    const buffer = new Timespan(this.timespan.from, this.timespan.to);

    this.servicesConnector.getDatasetData(dataset, buffer, { generalize: false }).subscribe({
      next: (result) => this.prepareData(dataset, result as HelgolandTimeseriesData, dwType),
      error: error => this.onError(error),
      complete: () => this.onCompleteLoadingData(dataset)
    });
  }
  private prepareData(dataset: HelgolandTimeseries, result: HelgolandTimeseriesData, dwType: DownloadType): void {
    console.log("Preparing data ...");
    let exportData: xlsxExport = [
      ["Station", dataset.parameters.feature.label],
    ];

    if (dataset.platform.geometry && dataset.platform.geometry.type === "Point") {
      exportData.push(["Latitude", dataset.platform.geometry["coordinates"][1]]);
      exportData.push(["Longitude", dataset.platform.geometry["coordinates"][0]]);
    }

    const phenomenonLabel = dataset.parameters.phenomenon.label + " (" + dataset.uom + ")";
    exportData.push(["Phenomenon", phenomenonLabel])

    // TODO: change momentJS date format based on timezone ( this.timezone )
    exportData = exportData.concat(result.values.map(el => [moment(el[0]).format(), el[1]]));
    this.downloadData(exportData, dwType);
  }

  // private downloadData(data: xlsxExport, dwType: DownloadType): void {
  //   console.log('Downloading data ...');
  //   /* generate worksheet */
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   /* save to file depending on download type */
  //   this.fileName += '.' + dwType;
  //   XLSX.writeFile(wb, this.fileName);
  // }

  private onError(error: Error): void {
    console.log("Loading data - error:");
    console.log(error);
  }

  private onCompleteLoadingData(dataset: IDataset): void {
    console.log("Downloading Finished.");
    this.onLoadingChange.emit(false);
  }

  private parseUnixToDate(date: number): Date {
    /* parse date from unix timestamp to date  */
    // TODO: include timezone to formatter (this.timezone)
    return new Date(date);
  }

  private parseDateToUnix(date: string): number {
    /* parse date from date to unix timestamp */
    // TODO: include timezone to formatter (this.timezone)
    // return parseFloat(moment(date).format('X'));
    return Date.parse(date); // Number(date);
  }

}
