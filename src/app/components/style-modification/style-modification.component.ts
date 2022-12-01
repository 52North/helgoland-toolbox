import { Component, Inject } from '@angular/core';
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
        FormsModule
    ],
    standalone: true
})
export class StyleModificationComponent {

    public color: string;
    public generalize: boolean;
    public zeroBasedYAxis: boolean;
    public autoRangeSelection: boolean;
    public separateYAxis: boolean;
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
        this.autoRangeSelection = option.autoRangeSelection;
        this.pointRadius = option.pointRadius;
        this.lineWidth = option.lineWidth;
        this.range = option.yAxisRange;
        this.separateYAxis = option.separateYAxis;
    }

    public updateRange(range: MinMaxRange) {
        this.range = range;
    }

    public onOk() {
        if (this.color) { this.option.color = this.color; }
        this.option.generalize = this.generalize;
        this.option.zeroBasedYAxis = this.zeroBasedYAxis;
        this.option.autoRangeSelection = this.autoRangeSelection;
        this.option.lineWidth = this.lineWidth;
        this.option.pointRadius = this.pointRadius;
        this.option.yAxisRange = this.range;
        this.option.separateYAxis = this.separateYAxis;
        this.dialogRef.close(this.option);
    }

    public setColor(temp) {
        this.color = temp;
    }
}
