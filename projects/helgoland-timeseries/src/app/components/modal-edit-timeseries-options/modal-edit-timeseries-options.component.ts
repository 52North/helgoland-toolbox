import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DatasetOptions, PointSymbol } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';

import { ConfigurationService } from './../../services/configuration.service';
import { TimeseriesSymbolSelectComponent } from './timeseries-symbol-select/timeseries-symbol-select.component';

@Component({
  selector: 'helgoland-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss'],
  imports: [
    CommonModule,
    ColorPickerModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSliderModule,
    TimeseriesSymbolSelectComponent,
    TranslateModule,
  ],
  providers: [ColorPickerService],
  standalone: true,
})
export class ModalEditTimeseriesOptionsComponent implements AfterContentInit {
  loaded = false;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DatasetOptions,
    public config: ConfigurationService,
  ) {}

  ngAfterContentInit(): void {
    setTimeout(() => (this.loaded = true), 100);
  }

  confirmColor(color: string) {
    this.options.color = color;
  }

  changeSymbol(symbol: PointSymbol) {
    this.options.pointSymbol = symbol;
  }
}
