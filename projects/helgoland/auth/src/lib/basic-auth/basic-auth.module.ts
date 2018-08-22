import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { BasicAuthServiceMaintainer } from './basic-auth-service-maintainer.service';
import { BasicAuthService } from './basic-auth.service';
import { BasicAuthInterceptorService } from './basic-auth-interceptor.service';

@NgModule({
  providers: [
    BasicAuthService,
    BasicAuthServiceMaintainer,
    {
      provide: HTTP_SERVICE_INTERCEPTORS,
      useClass: BasicAuthInterceptorService,
      multi: true
    }
  ]
})
export class HelgolandBasicAuthModule { }
