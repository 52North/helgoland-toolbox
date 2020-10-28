import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalMainConfigComponent } from '../modal-main-config/modal-main-config.component';

@Component({
  selector: 'helgoland-modal-main-config-button',
  templateUrl: './modal-main-config-button.component.html',
  styleUrls: ['./modal-main-config-button.component.scss']
})
export class ModalMainConfigButtonComponent {

  constructor(
    private dialog: MatDialog
  ) { }

  public openMainConfig() {
    this.dialog.open(ModalMainConfigComponent);
  }

}
