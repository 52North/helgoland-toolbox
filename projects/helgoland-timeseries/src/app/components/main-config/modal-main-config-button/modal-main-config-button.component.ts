import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { ModalMainConfigComponent } from '../modal-main-config/modal-main-config.component';

@Component({
  selector: 'helgoland-modal-main-config-button',
  templateUrl: './modal-main-config-button.component.html',
  styleUrls: ['./modal-main-config-button.component.scss'],
  imports: [
    MatTooltipModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
],
  standalone: true
})
export class ModalMainConfigButtonComponent {

  constructor(
    private dialog: MatDialog
  ) { }

  public openMainConfig() {
    this.dialog.open(ModalMainConfigComponent);
  }

}
