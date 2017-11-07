import { TimedDatasetOptions } from '../../../../../lib';
import { Component, ViewChild, TemplateRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
        @Inject(MAT_DIALOG_DATA) public option: TimedDatasetOptions
    ) {
        this.colorList = ['#FF0000', '#00FF00', '#0000FF'];
    }

    public onOk() {
        this.option.color = this.tempColor;
        this.dialogRef.close(this.option);
    }
}
