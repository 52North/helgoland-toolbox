import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { D3GeneralDatasetInput } from '@helgoland/d3';

@Component({
    templateUrl: './d3-general-popup.component.html',
    styleUrls: ['./d3-general-popup.component.scss']
})
export class D3GeneralPopupComponent {

    @Input()
    public generalDatasetInput: D3GeneralDatasetInput[];

    constructor(
        public dialogRef: MatDialogRef<D3GeneralPopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public dataset: D3GeneralDatasetInput[]
    ) {
        this.generalDatasetInput = dataset;
        console.log(this.generalDatasetInput);
    }

    public onClose() {
        this.dialogRef.close('closes');
    }

}
