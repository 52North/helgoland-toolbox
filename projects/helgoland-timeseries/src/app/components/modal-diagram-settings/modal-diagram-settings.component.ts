import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';

export interface DiagramConfig {
  yaxisVisible: boolean;
  overviewVisible: boolean;
  yaxisModifier: boolean;
  hoverstyle: string;
}

@Component({
  selector: 'helgoland-modal-diagram-settings',
  templateUrl: './modal-diagram-settings.component.html',
  styleUrls: ['./modal-diagram-settings.component.scss'],
  imports: [
    MatButtonModule,
    TranslateModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDialogModule
  ],
  standalone: true
})
export class ModalDiagramSettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalDiagramSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public diagramConfig: DiagramConfig
  ) { }

}
