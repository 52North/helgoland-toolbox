import { Component } from '@angular/core';
import { FirstLatestTimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'n52-no-data-entry',
  templateUrl: './no-data-entry.component.html',
  styleUrls: ['./no-data-entry.component.css']
})
export class NoDataEntryComponent extends FirstLatestTimeseriesEntryComponent { }
