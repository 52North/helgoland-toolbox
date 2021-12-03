import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { AxisSettings, SeriesGraphDataset, DatasetStyle, LineStyle } from '@helgoland/d3';

import { ConfigurationService } from './../../services/configuration.service';

@Component({
  selector: 'helgoland-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss']
})
export class ModalEditTimeseriesOptionsComponent {

  public adjustedColor: string;

  private style: DatasetStyle;
  private yaxis: AxisSettings;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dataset: SeriesGraphDataset,
      handler: EventEmitter<void>
    },
    public config: ConfigurationService
  ) {
    this.style = this.data.dataset.style;
    this.yaxis = this.data.dataset.yAxis;
  }

  isLineStyle() {
    return this.style instanceof LineStyle;
  }

  asLineStyle(): LineStyle {
    return this.style as LineStyle;
  }

  confirmColor(color: string) {
    this.style.baseColor = color;
    this.data.dataset.setStyle(this.style);
  }

  setZeroBased(change: MatSlideToggleChange) {
    this.yaxis.zeroBased = change.checked;
    this.data.dataset.setYAxis(this.yaxis);
  }

  setLineStyle(style: DatasetStyle) {
    this.data.dataset.setStyle(style);
  }

  setPointRadius(sliderChange: MatSliderChange) {
    this.asLineStyle().pointRadius = sliderChange.value;
    this.data.dataset.setStyle(this.style);
  }

  setLineWidth(sliderChange: MatSliderChange) {
    this.style.lineWidth = sliderChange.value;
    this.data.dataset.setStyle(this.style);
  }

}
