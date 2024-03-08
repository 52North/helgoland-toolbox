import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'helgoland-basic-auth-login',
  templateUrl: './basic-auth-login.component.html',
  styleUrls: ['./basic-auth-login.component.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  standalone: true
})
export class BasicAuthLoginComponent {

  username: string | undefined;
  password: string | undefined;

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
