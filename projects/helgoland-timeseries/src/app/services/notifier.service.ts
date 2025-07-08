import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  protected snackBar = inject(MatSnackBar);

  private messages: string[] = [];
  private snackBarRef!: MatSnackBarRef<NotificationComponent>;
  private snackBarIsDisplayed: boolean = false;

  public notify(message: string, duration: number = 2000): void {
    this.messages.push(message);
    if (!this.snackBarIsDisplayed) {
      this.snackBarRef = this.snackBar.openFromComponent(
        NotificationComponent,
        {
          data: {
            messages: this.messages,
            duration: duration,
          },
        },
      );
      this.snackBarIsDisplayed = true;
    }
    setTimeout(
      () => this.snackBarRef.instance.removeMessage(message),
      duration,
    );

    this.snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarIsDisplayed = false;
    });
  }
}
