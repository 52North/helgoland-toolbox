import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { DatasetApiInterface, IDataset, Timeseries, Data, TimeValueTuple, Time, Timespan, FirstLastValue } from '@helgoland/core';
import moment from 'moment';

type xlsxExport = any[][];

export interface ExportData {
  station: string;
  timezone: string;
  phenomenon: string;
  uom: string;
  firstvalue: string;
  lastvalue: string;
  timeperiod: {
    from: Date;
    to: Date;
  };
}

export interface ExportOptions {
  downloadType: string;
  timeperiod: {
    from: Date;
    to: Date;
  };
  timezone: string;
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
  private timezone: string;

  @Input()
  public exportOptions: ExportOptions;

  @Input()
  public inputId: string;

  @Output()
  public onMetadataChange: EventEmitter<ExportData> = new EventEmitter();

  @Output()
  public onLoadingChange: EventEmitter<boolean> = new EventEmitter();

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

        const exportData: ExportData = {
          station: timeseries.parameters.feature.label,
          timezone: null,
          phenomenon: timeseries.parameters.phenomenon.label,
          uom: timeseries.uom,
          firstvalue: moment(timeseries.firstValue.timestamp).format(),
          lastvalue: moment(timeseries.lastValue.timestamp).format(),
          timeperiod: {
            from: this.parseUnixToDate(this.timespan.from),
            to: this.parseUnixToDate(this.timespan.to)
          }
        };
        this.onMetadataChange.emit(exportData);
      },
      (error) => {
        this.onError(error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exportOptions && changes.exportOptions.currentValue) {
      this.timezone = changes.exportOptions.currentValue.timezone;
      this.timespan = new Timespan(this.parseDateToUnix(changes.exportOptions.currentValue.timeperiod.from), this.parseDateToUnix(changes.exportOptions.currentValue.timeperiod.to));
      // check if timespan is inside range
      if (this.timespan.from > this.timespan.to) {
        this.timespan = {
          from: this.timespan.to,
          to: this.timespan.from
        };
      }
      if (changes.exportOptions.currentValue.timeperiod.from < this.dataset.firstValue.timestamp) {
        this.timespan.from = this.dataset.firstValue.timestamp;
      }
      if (changes.exportOptions.currentValue.timeperiod.to > this.dataset.lastValue.timestamp) {
        this.timespan.to = this.dataset.lastValue.timestamp;
      }
      if (changes.exportOptions.currentValue.downloadType === 'csv' || changes.exportOptions.currentValue.downloadType === 'xlsx') {
        this.onDownload(changes.exportOptions.currentValue.downloadType);
      }
    }
  }

  public onDownload(downloadType: string): void {
    this.onLoadingChange.emit(true);
    if (this.dataset && this.dataset instanceof Timeseries) {
      this.loadData(this.dataset, downloadType);
    }
  }

  private loadData(dataset: Timeseries, dwType: string): void {
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
  private prepareData(dataset: Timeseries, result: Data<TimeValueTuple>, dwType: string): void {
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

  private downloadData(data: xlsxExport, dwType: string): void {
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
