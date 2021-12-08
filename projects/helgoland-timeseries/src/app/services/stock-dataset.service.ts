import { Injectable } from '@angular/core';
import { AxisSettings, LineStyle, SeriesGraphDataset } from '@helgoland/d3';

import { DatasetsService } from './graph-datasets.service';

@Injectable({
  providedIn: 'root'
})
export class StockDatasetService {

  constructor(
    protected graphDatasetsSrvc: DatasetsService
  ) {

    const socket = new WebSocket('wss://ws.finnhub.io?token=bqd2lt7rh5rdevg57qp0');

    const id = 'usdeuro';
    const dataset = new SeriesGraphDataset(
      id,
      new LineStyle('blue', 3, 3),
      new AxisSettings(),
      true,
      false,
      {
        // id: id,
        uom: '€/$',
        phenomenonLabel: 'EUR/USD',
        platformLabel: null,
        procedureLabel: null,
        categoryLabel: null,
        firstValue: null,
        lastValue: null,
        featureLabel: null
      }
    )

    this.graphDatasetsSrvc.addOrUpdateDataset(dataset);

    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
      socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'OANDA:EUR_USD' }))
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade' && data.data.length) {
        data.data.forEach(element => {
          dataset.addNewData(element.t, element.p);
        });
      }
    });

    // Unsubscribe
    var unsubscribe = function (symbol) {
      socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }))
    }
  }

}
