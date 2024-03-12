import { registerLocaleData } from "@angular/common";
import localeDe from "@angular/common/locales/de";
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import {
  DatasetApiInterface,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  HelgolandCoreModule,
  LocalStorage,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from "@helgoland/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { firstValueFrom, forkJoin, from, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AppComponent } from "./app/app.component";
import { TrajectoryViewComponent } from "./app/components/trajectory-view/trajectory-view.component";
import { AppConfig, ConfigurationService } from "./app/services/configuration.service";
import { environment } from "./environments/environment";

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
    const localStorageLanguageKey = "client-language";
    registerLocaleData(localeDe);
    let lang = translate.getBrowserLang() || "en";
    const storedLang = localStorage.load(localStorageLanguageKey) as string;
    if (storedLang) { lang = storedLang }
    const url = window.location.href;
    const name = "locale";
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (results && results[2]) {
      const match = config.languages?.find(e => e.code === results[2]);
      if (match) { lang = match.code; }
    }
    translate.setDefaultLang(lang);
    translate.onLangChange.subscribe(lce => {
      localStorage.save(localStorageLanguageKey, lce.lang);
    });
    return firstValueFrom(translate.use(lang));
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([{
      path: "**",
      pathMatch: "full",
      component: TrajectoryViewComponent
    }]),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: AppTranslateLoader
        }
      })
    ),
    importProvidersFrom(HelgolandCoreModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [ConfigurationService, TranslateService, LocalStorage],
      multi: true
    },
    {
      provide: SettingsService,
      useExisting: ConfigurationService
    },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
  ]
})