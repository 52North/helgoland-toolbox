import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { BasicAuthInterceptorService } from './basic-auth-interceptor.service';
import { BasicAuthServiceMaintainer } from './basic-auth-service-maintainer.service';
import { BasicAuthService } from './basic-auth.service';

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
