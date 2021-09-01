import { Component, Input, OnInit } from '@angular/core';
import { DatasetOptions, PointSymbolType } from '@helgoland/core';

interface Symbol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'helgoland-timeseries-symbol-select',
  templateUrl: './timeseries-symbol-select.component.html',
  styleUrls: ['./timeseries-symbol-select.component.scss']
})
export class TimeseriesSymbolSelectComponent implements OnInit {

  @Input() options: DatasetOptions;

  symbols: Symbol[] = [
    { value: 'point', viewValue: 'Point' },
    { value: PointSymbolType.cross, viewValue: 'Cross' },
    { value: PointSymbolType.diamond, viewValue: 'Diamond' },
    { value: PointSymbolType.square, viewValue: 'Square' },
    { value: PointSymbolType.star, viewValue: 'Star' },
    { value: PointSymbolType.triangle, viewValue: 'Triangle' },
    { value: PointSymbolType.wye, viewValue: 'Wye' }
  ];

  selectedSymbol: string;

  symbolSize: number;

  ngOnInit() {
    if (!this.options.pointSymbol) {
      this.selectedSymbol = 'point';
      this.symbolSize = this.options.pointRadius;
    } else {
      this.selectedSymbol = this.options.pointSymbol.type;
      this.symbolSize = this.options.pointSymbol.size;
    }
  }

  adjustSymbol() {
    if (this.selectedSymbol === 'point') {
      this.options.pointSymbol = null;
      this.options.pointRadius = this.symbolSize;
    } else {
      this.options.pointSymbol = {
        type: PointSymbolType[this.selectedSymbol],
        size: this.symbolSize
      }
    }
  }

}
