import { CommonModule } from "@angular/common";
import { AfterContentInit, Component, EventEmitter, Inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { AxisSettings, DatasetStyle, LineStyle, SeriesGraphDataset } from "@helgoland/d3";
import { TranslateModule } from "@ngx-translate/core";
import { ColorPickerModule } from "ngx-color-picker";

import { ConfigurationService } from "./../../services/configuration.service";
import { TimeseriesSymbolSelectComponent } from "./timeseries-symbol-select/timeseries-symbol-select.component";

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
  standalone: true
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
