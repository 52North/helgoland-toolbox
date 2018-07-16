import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatasetOptions, MinMaxRange } from '@helgoland/core';

@Component({
    templateUrl: './style-modification.component.html',
    styleUrls: ['./style-modification.component.scss']
})
export class StyleModificationComponent {

    public color: string;
    public generalize: boolean;
    public zeroBasedYAxis: boolean;
    public pointRadius: number;
    public lineWidth: number;
    public range: MinMaxRange;

    public colorList: string[];

    constructor(
        public dialogRef: MatDialogRef<StyleModificationComponent>,
        @Inject(MAT_DIALOG_DATA)
        public option: DatasetOptions
    ) {
        this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
        this.generalize = option.generalize;
        this.zeroBasedYAxis = option.zeroBasedYAxis;
        this.pointRadius = option.pointRadius;
        this.lineWidth = option.lineWidth;
        this.range = option.yAxisRange;
    }

    public updateRange(range: MinMaxRange) {
        this.range = range;
    }

    public onOk() {
        if (this.color) { this.option.color = this.color; }
        this.option.generalize = this.generalize;
        this.option.zeroBasedYAxis = this.zeroBasedYAxis;
        this.option.lineWidth = this.lineWidth;
        this.option.pointRadius = this.pointRadius;
        this.option.yAxisRange = this.range;
        this.dialogRef.close(this.option);
    }

    public setColor(temp) {
        this.color = temp;
    }
}
