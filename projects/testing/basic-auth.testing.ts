import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {
    BasicAuthInformer,
    BasicAuthInterceptorService,
} from '../helgoland/auth/src/lib/basic-auth/basic-auth-interceptor.service';
import { BasicAuthServiceMaintainer } from '../helgoland/auth/src/lib/basic-auth/basic-auth-service-maintainer.service';
import { BasicAuthService } from '../helgoland/auth/src/lib/basic-auth/basic-auth.service';
import { HTTP_SERVICE_INTERCEPTORS } from '../helgoland/core/src/lib/dataset-api/http.service';

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

export const BasicAuthTestingProviders = [
    BasicAuthService,
    BasicAuthServiceMaintainer,
    {
        provide: HTTP_SERVICE_INTERCEPTORS,
        useClass: BasicAuthInterceptorService,
        multi: true
    },
    {
        provide: BasicAuthInformer,
        useClass: BasicAuthInformerImplService
    }
];
