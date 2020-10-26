import { Color, stringInputToObject } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatasetOptions } from '@helgoland/core';

@Component({
  selector: 'helgoland-toolbox-modal-edit-timeseries-options',
  templateUrl: './modal-edit-timeseries-options.component.html',
  styleUrls: ['./modal-edit-timeseries-options.component.scss']
})
export class ModalEditTimeseriesOptionsComponent implements OnInit {

  colorCtr: AbstractControl = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<ModalEditTimeseriesOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DatasetOptions
  ) { }

  ngOnInit(): void {
    this.initColor();
  }

  private initColor() {
    const col = stringInputToObject(this.options.color);
    this.colorCtr.setValue(new Color(col.r, col.g, col.b, col.a));
  }

  confirmColor() {
    this.options.color = (this.colorCtr.value as Color).toHexString();
  }

}
