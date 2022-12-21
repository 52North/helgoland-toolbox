import { Injectable } from '@angular/core';
import { BasicAuthInformer, BasicAuthService, BasicAuthServiceMaintainer } from '@helgoland/auth';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {

    constructor(
        private basicAuthSrvc: BasicAuthService
    ) { }

    public doBasicAuth(url: string): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const username = prompt('Basic Auth username for ' + url);
            const password = prompt('Basic Auth password for ' + url);
            if (username && password) {
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
            } else {
                observer.error('no valid credentials');
                observer.complete();
            }
        });
    }

}

export const BasicAuthTestingProviders = [
    BasicAuthService,
    BasicAuthServiceMaintainer,
    {
        provide: BasicAuthInformer,
        useClass: BasicAuthInformerImplService
    }
];
