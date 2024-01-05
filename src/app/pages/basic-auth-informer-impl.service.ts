import { Injectable } from '@angular/core';
import {
  BasicAuthInformer,
  BasicAuthService,
  BasicAuthServiceMaintainer,
} from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {
  constructor(
    private basicAuthSrvc: BasicAuthService,
    private basicAuthServices: BasicAuthServiceMaintainer,
  ) {
    const providerUrl = '';
    this.basicAuthServices.registerService(providerUrl);
  }

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const username = prompt('Basic Auth username for ' + url);
      const password = prompt('Basic Auth password for ' + url);
      this.basicAuthSrvc.auth(username, password, url).subscribe(
        (token) => {
          observer.next(true);
          observer.complete();
        },
        (error) => {
          observer.next(false);
          observer.complete();
        },
      );
    });
  }
}
