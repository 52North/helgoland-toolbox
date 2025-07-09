import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DatasetOptions, MinMaxRange } from '@helgoland/core';
import { HelgolandModificationModule } from '@helgoland/modification';

@Component({
  templateUrl: './style-modification.component.html',
  styleUrls: ['./style-modification.component.scss'],
  imports: [
    HelgolandModificationModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
  ],
})
export class StyleModificationComponent {
  dialogRef = inject<MatDialogRef<StyleModificationComponent>>(MatDialogRef);
  option = inject<DatasetOptions>(MAT_DIALOG_DATA);

  public color: string | undefined;
  public generalize: boolean | undefined;
  public zeroBasedYAxis: boolean | undefined;
  public autoRangeSelection: boolean | undefined;
  public separateYAxis: boolean | undefined;
  public pointRadius: number;
  public lineWidth: number;
  public range: MinMaxRange | undefined;

  public colorList: string[];

  constructor() {
    this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
    this.generalize = this.option.generalize;
    this.zeroBasedYAxis = this.option.zeroBasedYAxis;
    this.autoRangeSelection = this.option.autoRangeSelection;
    this.pointRadius = this.option.pointRadius;
    this.lineWidth = this.option.lineWidth;
    this.range = this.option.yAxisRange;
    this.separateYAxis = this.option.separateYAxis;
  }

  public updateRange(range: MinMaxRange | void) {
    if (range) {
      this.range = range;
    }
  }

  public onOk() {
    if (this.color) {
      this.option.color = this.color;
    }
    this.option.generalize = this.generalize;
    this.option.zeroBasedYAxis = this.zeroBasedYAxis;
    this.option.autoRangeSelection = this.autoRangeSelection;
    this.option.lineWidth = this.lineWidth;
    this.option.pointRadius = this.pointRadius;
    this.option.yAxisRange = this.range;
    this.option.separateYAxis = this.separateYAxis;
    this.dialogRef.close(this.option);
  }

  public setColor(color: string) {
    this.color = color;
  }
}
