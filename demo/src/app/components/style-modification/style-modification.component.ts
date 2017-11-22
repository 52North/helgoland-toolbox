import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DatasetOptions } from '../../../../../src/model/internal/options';

@Component({
    selector: 'my-app',
    templateUrl: './style-modification.component.html',
    styleUrls: ['./style-modification.component.scss']
})
export class StyleModificationComponent {

    public color: string;
    public generalize: boolean;
    public zeroBasedXAxe: boolean;

    public colorList: string[];

    constructor(
        public dialogRef: MatDialogRef<StyleModificationComponent>,
        @Inject(MAT_DIALOG_DATA)
        public option: DatasetOptions
    ) {
        this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
        this.generalize = option.generalize;
        this.zeroBasedXAxe = option.zeroBasedYAxe;
    }

    public onOk() {
        if (this.color) { this.option.color = this.color; }
        this.option.generalize = this.generalize;
        this.option.zeroBasedYAxe = this.zeroBasedXAxe;
        this.dialogRef.close(this.option);
    }
}
