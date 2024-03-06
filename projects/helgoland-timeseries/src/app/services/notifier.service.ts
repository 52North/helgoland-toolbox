import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(
    protected snackBar: MatSnackBar
  ) { }

  notify(message: string, duration: number = 2000) {
    this.snackBar.open(message, undefined, { duration })
  }

}
