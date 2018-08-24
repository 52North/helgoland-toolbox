import { NgModule } from '@angular/core';
import { HTTP_SERVICE_INTERCEPTORS } from '@helgoland/core';

import { BasicAuthServicesKeeper } from './basic-auth-services-keeper.service';
import { BasicAuthService } from './basic-auth.service';
import { BasicAuthInterceptorService } from './basic-auth-interceptor.service';

@NgModule({
  providers: [
    BasicAuthService,
    BasicAuthServicesKeeper,
    {
      provide: HTTP_SERVICE_INTERCEPTORS,
      useClass: BasicAuthInterceptorService,
      multi: true
    }
  ]
})
export class HelgolandBasicAuthModule { }
