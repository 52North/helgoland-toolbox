import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirstLatestTimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'n52-no-data-entry',
  templateUrl: './no-data-entry.component.html',
  styleUrls: ['./no-data-entry.component.css'],
  imports: [CommonModule],
})
export class NoDataEntryComponent extends FirstLatestTimeseriesEntryComponent {}
