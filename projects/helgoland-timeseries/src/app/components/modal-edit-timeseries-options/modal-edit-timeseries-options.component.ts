import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AxisSettings, BarStyle, DatasetStyle, LineStyle } from '@helgoland/d3';

import { ConfigurationService } from './../../services/configuration.service';

export interface DatasetConfig {
  style: DatasetStyle;
  yaxis: AxisSettings;
}

@Component({
  selector: 'helgoland-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss']
})
export class ModalEditTimeseriesOptionsComponent {

  public adjustedColor: string;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      config: DatasetConfig,
      handler: EventEmitter<void>
    },
    public config: ConfigurationService
  ) {
  }

  isLineStyle() {
    return this.data.config.style instanceof LineStyle;
  }

  asLineStyle(): LineStyle {
    return this.data.config.style as LineStyle;
  }

  asBarStyle(): BarStyle {
    return this.data.config.style as BarStyle;
  }

  confirmColor(color: string) {
    this.data.config.style.baseColor = color;
    this.update();
  }

  update() {
    this.data.handler.emit();
  }

}
