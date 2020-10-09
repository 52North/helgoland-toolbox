import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DiagramConfig {
  yaxisVisible: boolean;
  overviewVisible: boolean;
}

@Component({
  selector: 'helgoland-toolbox-modal-diagram-settings',
  templateUrl: './modal-diagram-settings.component.html',
  styleUrls: ['./modal-diagram-settings.component.scss']
})
export class ModalDiagramSettingsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDiagramSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public diagramConfig: DiagramConfig
  ) { }

  ngOnInit(): void {
    console.log(this.diagramConfig);
  }

}
