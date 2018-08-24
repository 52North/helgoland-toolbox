import { Injectable } from '@angular/core';
import { BasicAuthService } from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';
import { BasicAuthInformer } from '@helgoland/auth';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {

  constructor(
    private basicAuthSrvc: BasicAuthService
  ) { }

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const username = prompt('Basic Auth username for ' + url);
      const password = prompt('Basic Auth password for ' + url);
      this.basicAuthSrvc.auth(username, password, url).subscribe(
        token => {
          observer.next(true);
          observer.complete();
        },
        error => {
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

}
