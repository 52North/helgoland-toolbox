import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HelgolandCoreModule,
  LocalStorage,
  PegelonlineApiConnectorProvider,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicAuthInformerImplService } from '../../helgoland-common/src/lib/services/basic-auth-informer-impl.service';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.consts';
import { AppConfig, ConfigurationService } from './app/services/configuration.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return forkJoin([
      from(import(`./assets/i18n/${lang}.json`)),
      from(import(`../../helgoland-common/src/i18n/${lang}.json`))
    ]).pipe(map(res => Object.assign(res[0].default, res[1].default)))
  }
}

export function initApplication(configService: ConfigurationService, translate: TranslateService, localStorage: LocalStorage): () => Promise<void> {
  return () => configService.loadConfiguration().then((config: AppConfig) => {
    const localStorageLanguageKey = 'client-language';
    registerLocaleData(localeDe);
    let lang = translate.getBrowserLang() || 'en';
    const storedLang = localStorage.load(localStorageLanguageKey) as string;
    if (storedLang) { lang = storedLang }
    const url = window.location.href;
    const name = 'locale';
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (results && results[2]) {
      const match = config.languages?.find(e => e.code === results[2]);
      if (match) { lang = match.code; }
    }
    translate.setDefaultLang(lang);
    translate.onLangChange.subscribe(lce => {
      localStorage.save(localStorageLanguageKey, lce.lang);
    });
    return translate.use(lang).toPromise();
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: AppTranslateLoader
        }
      }),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [ConfigurationService, TranslateService, LocalStorage],
      multi: true
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: SettingsService,
      useExisting: ConfigurationService
    },
    importProvidersFrom(HelgolandCoreModule),
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(HelgolandBasicAuthModule),
    {
      provide: BasicAuthInformer,
      useClass: BasicAuthInformerImplService
    },
    importProvidersFrom(
      HelgolandCachingModule.forRoot({
        cachingDurationInMilliseconds: 300000,
        getDataCacheActive: false,
        logging: false
      })
    ),
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetStaConnectorProvider,
    PegelonlineApiConnectorProvider
  ]
})