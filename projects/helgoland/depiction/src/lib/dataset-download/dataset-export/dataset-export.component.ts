import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Data, DatasetApiInterface, IDataset, Time, Timeseries, Timespan, TimeValueTuple } from '@helgoland/core';
import moment from 'moment';
import * as XLSX from 'xlsx';

type xlsxExport = any[][];

/**
 * information that defines options for the export
 */
export interface ExportOptions {
  downloadType: DownloadType;
  timeperiod: Timespan;
}

export enum DownloadType {
  XSLX = 'xslx',
  CSV = 'csv'
}

@Component({
  selector: 'n52-dataset-export',
  templateUrl: './dataset-export.component.html',
  styleUrls: ['./dataset-export.component.css']
})

export class DatasetExportComponent implements OnInit, OnChanges {

  private dataset: Timeseries;
  private fileName = 'timeseries';
  private timespan: Timespan;

  /**
   * options to define the export parameters
   */
  @Input() public exportOptions: ExportOptions;

  /**
   * id of the dataset that should be downloaded
   */
  @Input() public inputId: string;

  /**
   * returns the metadata of the selected dataset to be visualized
   */
  @Output() public onMetadataChange: EventEmitter<IDataset> = new EventEmitter();

  /**
   * Output to inform the loading status, while file is created
   */
  @Output() public onLoadingChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    protected api: DatasetApiInterface,
    protected timeSrvc: Time,
  ) { }

  ngOnInit() {
    // get timeseries metadata by internal id
    // e.g. http://www.fluggs.de/sos2/api/v1/__26
    this.api.getSingleTimeseriesByInternalId(this.inputId).subscribe(
      (timeseries) => {
        this.fileName = this.fileName + '_' + this.inputId;
        this.dataset = timeseries;
        this.timespan = new Timespan(this.dataset.firstValue.timestamp, this.dataset.lastValue.timestamp);

        this.onMetadataChange.emit(timeseries);
      },
      (error) => {
        this.onError(error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exportOptions && this.exportOptions) {
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
    if (this.dataset && this.dataset instanceof Timeseries) {
      this.loadData(this.dataset, downloadType);
    }
  }

  private loadData(dataset: Timeseries, dwType: DownloadType): void {
    console.log('Loading data ...');
    // get dataset data
    if (dataset instanceof Timeseries) {
      const buffer = new Timespan(this.timespan.from, this.timespan.to);

      this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
        {
          format: 'flot',
          expanded: false,
          generalize: false
        },
        { forceUpdate: false }
      ).subscribe(
        (result) => this.prepareData(dataset, result, dwType),
        (error) => this.onError(error),
        () => this.onCompleteLoadingData(dataset)
      );
    }
  }
  private prepareData(dataset: Timeseries, result: Data<TimeValueTuple>, dwType: DownloadType): void {
    console.log('Preparing data ...');
    const valueHeader = dataset.parameters.phenomenon.label + '_(' + dataset.uom + ')';
    let exportData: xlsxExport = [
      ['Station', dataset.parameters.feature.label],
      ['Lat', dataset.station.geometry['coordinates'][1]],
      ['Lon', dataset.station.geometry['coordinates'][0]],
      ['Timezone', 'input'],
      ['TIME', valueHeader],
    ];

    // TODO: change momentJS date format based on timezone ( this.timezone )
    exportData = exportData.concat(result.values.map(el => [moment(el[0]).format(), el[1]]));
    this.downloadData(exportData, dwType);
  }

  private downloadData(data: xlsxExport, dwType: DownloadType): void {
    console.log('Downloading data ...');
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file depending on download type */
    this.fileName += '.' + dwType;
    XLSX.writeFile(wb, this.fileName);
  }

  private onError(error: Error): void {
    console.log('Loading data - error:');
    console.log(error);
  }

  private onCompleteLoadingData(dataset: IDataset): void {
    console.log('Downloading Finished.');
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
