import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'helgoland-basic-auth-login',
  templateUrl: './basic-auth-login.component.html',
  styleUrls: ['./basic-auth-login.component.scss'],
  imports: [
    MatFormFieldModule,
    FormsModule
  ],
  standalone: true
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
