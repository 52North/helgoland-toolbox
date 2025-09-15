import { Injectable, inject } from '@angular/core';
import {
  BasicAuthInformer,
  BasicAuthService,
  BasicAuthServiceMaintainer,
} from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {
  private basicAuthSrvc = inject(BasicAuthService);
  private basicAuthServices = inject(BasicAuthServiceMaintainer);

  constructor() {
    const providerUrl = '';
    this.basicAuthServices.registerService(providerUrl);
  }

  doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const username = prompt('Basic Auth username for ' + url);
      const password = prompt('Basic Auth password for ' + url);
      if (username && password) {
        this.basicAuthSrvc.auth(username, password, url).subscribe({
          next: () => {
            observer.next(true);
            observer.complete();
          },
          error: () => {
            observer.next(false);
            observer.complete();
          },
        });
      }
    });
  }
}
