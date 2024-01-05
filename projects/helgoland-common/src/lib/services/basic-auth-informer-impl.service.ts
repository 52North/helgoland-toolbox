import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasicAuthInformer, BasicAuthService } from '@helgoland/auth';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';

import { BasicAuthLoginComponent } from '../components/basic-auth-login/basic-auth-login.component';

@Injectable({
  providedIn: 'root',
})
export class BasicAuthInformerImplService implements BasicAuthInformer {
  constructor(
    private basicAuthSrvc: BasicAuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const dialogRef = this.dialog.open(BasicAuthLoginComponent, {
        width: '400px',
        data: url,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res && res.username && res.password) {
          this.basicAuthSrvc.auth(res.username, res.password, url).subscribe(
            (token) => {
              observer.next(true);
              observer.complete();
            },
            (error) => {
              if (error instanceof HttpErrorResponse && error.status === 401) {
                this.snackbar.open(
                  this.translate.instant('authentication.failed'),
                  undefined,
                  { duration: 3000 },
                );
              }
              observer.next(false);
              observer.complete();
            },
          );
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
