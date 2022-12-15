import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { DatasetOptions, PointSymbolType } from '@helgoland/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Symbol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'helgoland-timeseries-symbol-select',
  templateUrl: './timeseries-symbol-select.component.html',
  styleUrls: ['./timeseries-symbol-select.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    TranslateModule,
  ],
  standalone: true
})
export class TimeseriesSymbolSelectComponent implements OnInit {

  @Input() options: DatasetOptions;

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

  selectedSymbol: PointSymbolType | 'point';

  symbolSize: number;

  ngOnInit() {
    if (this.options) {
      if (this.options.pointSymbol) {
        this.selectedSymbol = this.options.pointSymbol.type;
        this.symbolSize = this.options.pointSymbol.size;
      } else {
        this.selectedSymbol = 'point';
        this.symbolSize = this.options.pointRadius;
      }
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
