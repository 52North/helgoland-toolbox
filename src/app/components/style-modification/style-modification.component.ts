import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatasetOptions } from '@helgoland/core';

@Component({
    templateUrl: './style-modification.component.html',
    styleUrls: ['./style-modification.component.scss']
})
export class StyleModificationComponent {

    public color: string;
    public generalize: boolean;
    public zeroBasedXAxe: boolean;
    public pointRadius: number;
    public lineWidth: number;

    public colorList: string[];

    constructor(
        public dialogRef: MatDialogRef<StyleModificationComponent>,
        @Inject(MAT_DIALOG_DATA)
        public option: DatasetOptions
    ) {
        this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
        this.generalize = option.generalize;
        this.zeroBasedXAxe = option.zeroBasedYAxe;
        this.pointRadius = option.pointRadius;
        this.lineWidth = option.lineWidth;
    }

    public onOk() {
        if (this.color) { this.option.color = this.color; }
        this.option.generalize = this.generalize;
        this.option.zeroBasedYAxe = this.zeroBasedXAxe;
        this.option.lineWidth = this.lineWidth;
        this.option.pointRadius = this.pointRadius;
        this.dialogRef.close(this.option);
    }
}
