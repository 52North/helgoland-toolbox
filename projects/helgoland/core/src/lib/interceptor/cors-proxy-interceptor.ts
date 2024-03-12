import { HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HTTP_SERVICE_INTERCEPTORS, HttpServiceHandler, HttpServiceInterceptor } from "../dataset-api/http.service";
import { HttpRequestOptions } from "../model/internal/http-requests";
import { Settings } from "../model/settings/settings";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class CorsProxyInterceptor implements HttpServiceInterceptor {

  constructor(
        private settingsSrvc: SettingsService<Settings>
  ) { }

  public intercept(
    req: HttpRequest<any>, metadata: HttpRequestOptions, next: HttpServiceHandler
  ): Observable<HttpEvent<any>> {
    const settings = this.settingsSrvc.getSettings();
    if (settings && settings.proxyUrl && settings.proxyUrlsStartWith) {
      const startWith = settings.proxyUrlsStartWith.find(e => req.url.startsWith(e));
      if (startWith) {
        const clone = req.clone({ url: settings.proxyUrl + req.url });
        return next.handle(clone, metadata);
      }
    }
    return next.handle(req, metadata);
  }
}

export const CorsProxyInterceptorProvider = {
  provide: HTTP_SERVICE_INTERCEPTORS,
  useClass: CorsProxyInterceptor,
  multi: true
};
