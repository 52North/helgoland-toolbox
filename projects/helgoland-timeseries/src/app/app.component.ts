import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DummyDatasetsService } from './services/dummy-datasets.service';
import { StockDatasetService } from './services/stock-dataset.service';

@Component({
  selector: 'helgoland-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
  ],
  standalone: true
})
export class AppComponent {
  title = 'helgoland';
  fullscreen = true;

  constructor(
    private temp: DummyDatasetsService,
    // private stock: StockDatasetService
  ) { }
}
