import '../styles/headings.css';
import '../styles/styles.scss';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule, MatSidenavModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import {
  CachingInterceptor,
  HttpCache,
  LocalHttpCache,
  LocalOngoingHttpCache,
  OnGoingHttpCache,
} from '@helgoland/caching/src/caching';
import { CoreModule, Settings, SettingsService } from '@helgoland/core';
import { ApiInterface } from '@helgoland/core/src/api-interface/api-interface';
import { GetDataApiInterface } from '@helgoland/core/src/api-interface/getData-api-interface.service';
import { SelectorModule } from '@helgoland/selector/src/selector';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ListSelectionComponent } from 'demo/app/pages/list-selection/list-selection.component';
import { ProviderSelectorComponent } from 'demo/app/pages/provider-selector/provider-selector.component';
import { settingsPromise } from 'demo/main.browser';
import { environment } from 'environments/environment';

import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { AppState } from './app.service';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {

  constructor() {
    super();
    settingsPromise.then((result) => {
      this.setSettings(result);
    });
  }

}

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  {
    provide: HttpCache,
    useClass: LocalHttpCache
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CachingInterceptor,
    multi: true
  },
  {
    provide: OnGoingHttpCache,
    useClass: LocalOngoingHttpCache
  },
  {
    provide: ApiInterface,
    useClass: GetDataApiInterface
  },
  {
    provide: SettingsService,
    useClass: ExtendedSettingsService
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    ProviderSelectorComponent,
    ListSelectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    SelectorModule,
    CoreModule
  ],
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule { }
