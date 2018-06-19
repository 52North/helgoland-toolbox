import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BasicAuthService } from '@helgoland/auth';

@Component({
  templateUrl: './eventing.component.html',
  styleUrls: ['./eventing.component.css']
})
export class EventingComponent {

  private readonly username = '';
  private readonly password = '';
  private readonly url = '';

  public tokenOrError: string;

  constructor(
    private basicAuthSrvc: BasicAuthService
  ) {
    this.basicAuthSrvc.auth(this.username, this.password, this.url)
      .subscribe(
        (res) => this.tokenOrError = res,
        (error: HttpErrorResponse) => this.tokenOrError = error.message
      );
  }

}
