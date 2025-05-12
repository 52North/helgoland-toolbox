import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'helgoland-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  standalone: true,
})
export class NotificationComponent {
  messages: string[] = [];

  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {
    this.messages = this.data.messages;
  }

  removeMessage(message: string) {
    this.messages.splice(this.messages.indexOf(message), 1);
    if (this.messages.length === 0) {
      this.snackBarRef.dismiss();
    }
  }
}
