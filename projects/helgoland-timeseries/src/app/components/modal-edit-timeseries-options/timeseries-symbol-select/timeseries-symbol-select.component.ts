import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatasetOptions, PointSymbol, PointSymbolType } from '@helgoland/core';

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

  @Output() selectedSymbol = new EventEmitter<PointSymbol>();

  foods: Symbol[] = [
    { value: 'point', viewValue: 'Point' },
    { value: PointSymbolType.cross, viewValue: 'Cross' },
    { value: PointSymbolType.diamond, viewValue: 'Diamond' },
    { value: PointSymbolType.square, viewValue: 'Square' },
    { value: PointSymbolType.star, viewValue: 'Star' },
    { value: PointSymbolType.triangle, viewValue: 'Triangle' },
    { value: PointSymbolType.wye, viewValue: 'Wye' }
  ];

  selected: string;

  ngOnInit() {
    if (!this.options.pointSymbol) {
      this.selected = 'point'
    } else {
      this.selected = this.options.pointSymbol.type;
    }
  }

  selectSymbol(value: string) {
    if (value === 'point') {
      this.selectedSymbol.emit()
    } else {
      this.selectedSymbol.emit({
        type: PointSymbolType[value],
        size: 123
      })
    }
  }

}
