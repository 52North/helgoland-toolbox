import { Component } from '@angular/core';

import { DummyDatasetsService } from './services/dummy-datasets.service';
import { StockDatasetService } from './services/stock-dataset.service';

@Component({
  selector: 'helgoland-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'helgoland';
  fullscreen = true;

  constructor(
    private temp: DummyDatasetsService,
    // private stock: StockDatasetService
  ) { }
}
