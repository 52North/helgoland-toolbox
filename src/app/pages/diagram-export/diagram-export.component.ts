import { Component, OnInit } from '@angular/core';
import { ColorService, DatasetOptions, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-diagram-export',
  templateUrl: './diagram-export.component.html',
  styleUrls: ['./diagram-export.component.css']
})
export class DiagramExportComponent implements OnInit {

  public title = 'Exported Diagram';
  public height = 300;
  public width = 500;
  public start = new Date(2019, 10, 13);
  public end = new Date(2019, 10, 14);

  public format: 'png' | 'svg' = 'png';

  public datasetOptions: Map<string, DatasetOptions> = new Map();

  public datasetIds = [
    'http://fluggs.wupperverband.de/sos2/api/v1/__26',
    'http://fluggs.wupperverband.de/sos2/api/v1/__49',
    'http://fluggs.wupperverband.de/sos2/api/v1/__51',
    'http://fluggs.wupperverband.de/sos2/api/v1/__72',
  ];

  public timespan: Timespan;

  constructor(
    private color: ColorService
  ) { }

  ngOnInit() {
    this.datasetIds.forEach((entry) => {
      const option = new DatasetOptions(entry, this.color.getColor());
      option.generalize = true;
      option.lineWidth = 1;
      option.pointRadius = 2;
      this.datasetOptions.set(entry, option);
    });

    this.setTimespan();
  }

  setStart(start: Date) {
    this.start = new Date(start);
    this.setTimespan();
  }

  setEnd(end: Date) {
    this.end = new Date(end);
    this.setTimespan();
  }

  private setTimespan() {
    this.timespan = new Timespan(this.start, this.end);
  }

}
