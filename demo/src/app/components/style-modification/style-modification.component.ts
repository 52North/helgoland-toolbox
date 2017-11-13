import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TimedDatasetOptions } from '../../../../../src/model/internal/options';

@Component({
    selector: 'my-app',
    templateUrl: './style-modification.component.html',
    styleUrls: ['./style-modification.component.scss']
})
export class StyleModificationComponent {

    public tempColor: string;

    public colorList: string[];

    constructor(
        public dialogRef: MatDialogRef<StyleModificationComponent>,
        @Inject(MAT_DIALOG_DATA)
        public option: TimedDatasetOptions
    ) {
        this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
    }

    public onOk() {
        this.option.color = this.tempColor;
        this.dialogRef.close(this.option);
    }
}
