import { Component } from '@angular/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'helgoland-toolbox-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TimeseriesEntryComponent { }
