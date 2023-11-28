import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { ColorService, DatasetOptions, Timespan } from "@helgoland/core";
import { HelgolandD3Module } from "@helgoland/d3";

import { NoDataEntryComponent } from "./no-data-entry/no-data-entry.component";

@Component({
  selector: 'n52-diagram-export',
  templateUrl: './diagram-export.component.html',
  styleUrls: ['./diagram-export.component.css'],
  imports: [
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    HelgolandD3Module,
    NoDataEntryComponent
  ],
  standalone: true
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
    'https://fluggs.wupperverband.de/sws5/api/__26',
    // 'https://fluggs.wupperverband.de/sws5/api/__49',
    // 'https://fluggs.wupperverband.de/sws5/api/__51',
    // 'https://fluggs.wupperverband.de/sws5/api/__72',
  ];

  public timespan: Timespan | undefined;

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
