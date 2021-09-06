import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatasetOptions, PointSymbol } from '@helgoland/core';

import { ConfigurationService } from './../../services/configuration.service';

@Component({
  selector: 'helgoland-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss']
})
export class ModalEditTimeseriesOptionsComponent {

  public adjustedColor: string;

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DatasetOptions,
    public config: ConfigurationService
  ) { }

  confirmColor(color: string) {
    this.options.color = color;
  }

  changeSymbol(symbol: PointSymbol) {
    this.options.pointSymbol = symbol;
  }

}
