import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { D3GeneralDataset } from '@helgoland/d3';

@Component({
    templateUrl: './d3-general-popup.component.html',
    styleUrls: ['./d3-general-popup.component.scss']
})
export class D3GeneralPopupComponent {

    @Input()
    public generalDataset: D3GeneralDataset;

    constructor(
        public dialogRef: MatDialogRef<D3GeneralPopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public dataset: D3GeneralDataset
    ) {
        this.generalDataset = dataset;
    }

    public onClose() {
        this.dialogRef.close('closes');
    }

}
