import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  error(message: any, userDismiss = false, options: MatSnackBarConfig = {}) {
    let errorMessage = '';
    if (typeof message === 'string') {
      errorMessage = message;
    }
    const dismiss = userDismiss ? 'Dismiss' : undefined;
    if (!dismiss) {
      options.duration = 3000;
    }
    this.snackBar.open(errorMessage, dismiss, options);
  }

}
