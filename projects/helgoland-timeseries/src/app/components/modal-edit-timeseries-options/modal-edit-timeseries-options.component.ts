import { AfterContentInit, Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AxisSettings, SeriesGraphDataset, DatasetStyle, LineStyle } from '@helgoland/d3';

import { ConfigurationService } from './../../services/configuration.service';

@Component({
  selector: 'helgoland-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss']
})
export class ModalEditTimeseriesOptionsComponent implements AfterContentInit {

  public adjustedColor: string;

  private style: DatasetStyle;
  private yaxis: AxisSettings;
  protected loaded = false;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dataset: SeriesGraphDataset,
      handler: EventEmitter<void>
    },
    public config: ConfigurationService
  ) {
    this.style = this.data.dataset?.style;
    this.yaxis = this.data.dataset?.yAxis;
  }

  isLineStyle() {
    return this.style instanceof LineStyle;
  }

  asLineStyle(): LineStyle {
    return this.style as LineStyle;
  }

  ngAfterContentInit(): void {
    setTimeout(() => this.loaded = true, 100);
  }

  confirmColor(color: string) {
    this.style.baseColor = color;
    if (this.style instanceof LineStyle) {
      this.style.pointBorderColor = color;
    }
    this.data.dataset.setStyle(this.style);
  }

  setZeroBased(change: MatSlideToggleChange) {
    this.yaxis.zeroBased = change.checked;
    this.data.dataset.setYAxis(this.yaxis);
  }

  setLineStyle(style: DatasetStyle) {
    this.data.dataset.setStyle(style);
  }

  setPointRadius(val: number) {
    this.asLineStyle().pointRadius = val;
    this.data.dataset.setStyle(this.style);
  }

  setLineWidth(val: number) {
    this.style.lineWidth = val;
    this.data.dataset.setStyle(this.style);
  }

}
