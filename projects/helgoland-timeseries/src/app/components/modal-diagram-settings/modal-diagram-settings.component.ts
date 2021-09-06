import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DiagramConfig {
  yaxisVisible: boolean;
  overviewVisible: boolean;
  yaxisModifier: boolean;
  hoverstyle: string;
}

@Component({
  selector: 'helgoland-modal-diagram-settings',
  templateUrl: './modal-diagram-settings.component.html',
  styleUrls: ['./modal-diagram-settings.component.scss']
})
export class ModalDiagramSettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalDiagramSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public diagramConfig: DiagramConfig
  ) { }

}
