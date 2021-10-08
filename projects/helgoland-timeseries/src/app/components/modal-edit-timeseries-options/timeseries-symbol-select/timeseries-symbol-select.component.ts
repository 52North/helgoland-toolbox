import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointSymbolType } from '@helgoland/core';
import { LineStyle } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

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

  @Input() lineStyle: LineStyle;

  @Output() styleChanged: EventEmitter<LineStyle> = new EventEmitter();

  symbols: Symbol[] = [
    { value: 'point', viewValue: this.translate.instant('timeseries-symbol-select.type.point') },
    { value: PointSymbolType.cross, viewValue: this.translate.instant('timeseries-symbol-select.type.cross') },
    { value: PointSymbolType.diamond, viewValue: this.translate.instant('timeseries-symbol-select.type.diamond') },
    { value: PointSymbolType.square, viewValue: this.translate.instant('timeseries-symbol-select.type.square') },
    { value: PointSymbolType.star, viewValue: this.translate.instant('timeseries-symbol-select.type.star') },
    { value: PointSymbolType.triangle, viewValue: this.translate.instant('timeseries-symbol-select.type.triangle') },
    { value: PointSymbolType.wye, viewValue: this.translate.instant('timeseries-symbol-select.type.wye') }
  ];

  constructor(private translate: TranslateService) { }

  selectedSymbol: string;

  symbolSize: number;

  ngOnInit() {
    if (this.lineStyle) {
      if (this.lineStyle.pointSymbol) {
        this.selectedSymbol = this.lineStyle.pointSymbol.type;
        this.symbolSize = this.lineStyle.pointSymbol.size;
      } else {
        this.selectedSymbol = 'point';
        this.symbolSize = this.lineStyle.pointRadius;
      }
    }
  }

  adjustSymbol() {
    if (this.selectedSymbol === 'point') {
      this.lineStyle.pointSymbol = null;
      this.lineStyle.pointRadius = this.symbolSize;
    } else {
      this.lineStyle.pointSymbol = {
        type: PointSymbolType[this.selectedSymbol],
        size: this.symbolSize
      }
    }
    this.styleChanged.emit(this.lineStyle);
  }

}
