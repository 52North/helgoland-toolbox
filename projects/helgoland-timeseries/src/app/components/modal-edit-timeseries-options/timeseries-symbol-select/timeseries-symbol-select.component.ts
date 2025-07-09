import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { PointSymbolType } from '@helgoland/core';
import { LineStyle } from '@helgoland/d3';
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
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    TranslateModule,
  ],
})
export class TimeseriesSymbolSelectComponent implements OnInit {
  private translate = inject(TranslateService);

  readonly lineStyle = input.required<LineStyle | undefined>();

  readonly styleChanged = output<LineStyle>();

  symbols: Symbol[] = [
    {
      value: 'point',
      viewValue: this.translate.instant('timeseries-symbol-select.type.point'),
    },
    {
      value: PointSymbolType.cross,
      viewValue: this.translate.instant('timeseries-symbol-select.type.cross'),
    },
    {
      value: PointSymbolType.diamond,
      viewValue: this.translate.instant(
        'timeseries-symbol-select.type.diamond',
      ),
    },
    {
      value: PointSymbolType.square,
      viewValue: this.translate.instant('timeseries-symbol-select.type.square'),
    },
    {
      value: PointSymbolType.star,
      viewValue: this.translate.instant('timeseries-symbol-select.type.star'),
    },
    {
      value: PointSymbolType.triangle,
      viewValue: this.translate.instant(
        'timeseries-symbol-select.type.triangle',
      ),
    },
    {
      value: PointSymbolType.wye,
      viewValue: this.translate.instant('timeseries-symbol-select.type.wye'),
    },
  ];

  selectedSymbol: PointSymbolType | 'point' = 'point';
  symbolSize = 1;

  ngOnInit() {
    const lineStyle = this.lineStyle();
    if (lineStyle) {
      if (lineStyle.pointSymbol) {
        this.selectedSymbol = lineStyle.pointSymbol.type;
        this.symbolSize = lineStyle.pointSymbol.size;
      } else {
        this.selectedSymbol = 'point';
        this.symbolSize = lineStyle.pointRadius;
      }
    }
  }

  adjustSymbol() {
    const lineStyle = this.lineStyle();
    if (lineStyle) {
      if (this.selectedSymbol === 'point') {
        lineStyle.pointSymbol = undefined;
        lineStyle.pointRadius = this.symbolSize;
      } else {
        lineStyle.pointSymbol = {
          type: PointSymbolType[this.selectedSymbol],
          size: this.symbolSize,
        };
      }
      this.styleChanged.emit(lineStyle);
    }
  }
}
