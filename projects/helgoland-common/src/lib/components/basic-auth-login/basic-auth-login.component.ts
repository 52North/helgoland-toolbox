import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'helgoland-basic-auth-login',
  templateUrl: './basic-auth-login.component.html',
  styleUrls: ['./basic-auth-login.component.scss']
})
export class BasicAuthLoginComponent {

  username: string;
  password: string;

  constructor(
    public dialogRef: MatDialogRef<BasicAuthLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public url: string,
  ) { }

  confirm() {
    this.dialogRef.close({
      username: this.username,
      password: this.password
    })
  }

  cancel() {
    this.dialogRef.close();
  }

}
