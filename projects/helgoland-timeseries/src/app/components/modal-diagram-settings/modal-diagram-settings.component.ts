import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HoveringStyle } from '@helgoland/d3';
import { TranslateModule } from '@ngx-translate/core';

export interface DiagramConfig {
  yaxisVisible: boolean;
  overviewVisible: boolean;
  yaxisModifier: boolean;
  hoverstyle: HoveringStyle;
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
    MatDialogModule,
  ],
})
export class ModalDiagramSettingsComponent {
  protected dialogRef =
    inject<MatDialogRef<ModalDiagramSettingsComponent>>(MatDialogRef);
  protected diagramConfig = inject<DiagramConfig>(MAT_DIALOG_DATA);
}
