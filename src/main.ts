import { HttpClient, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { BasicAuthInformer, BasicAuthService, BasicAuthServiceMaintainer } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HttpService,
  InternalIdHandler,
  LocalStorage,
  SettingsService,
  SplittedDataDatasetApiInterface,
  StatusCheckService,
} from '@helgoland/core';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { FavoriteService, JsonFavoriteExporterService } from '@helgoland/favorite';
import { GeoSearch, NominatimGeoSearchService } from '@helgoland/map';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { BasicAuthInformerImplService } from '../projects/testing/basic-auth.testing';
import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.routes';
import { ExtendedSettingsService } from './app/settings/settings.service';
import { environment, settingsPromise } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

Promise.all([settingsPromise]).then((config: any) => {
  bootstrapApplication(AppComponent, {
    providers: [
      {
        provide: SettingsService,
        useClass: ExtendedSettingsService
      },
      provideRouter(ROUTES),
      importProvidersFrom(
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ),
      importProvidersFrom(
        HelgolandCachingModule.forRoot({
          cachingDurationInMilliseconds: 300000,
          getDataCacheActive: false,
          logging: false
        })
      ),
      importProvidersFrom(MatMomentDateModule),
      provideHttpClient(),
      provideAnimations(),

      StatusCheckService,
      HttpService,
      InternalIdHandler,

      FavoriteService,
      JsonFavoriteExporterService,
      LocalStorage,

      {
        provide: DatasetApiInterface,
        useClass: SplittedDataDatasetApiInterface
      },
      // createEnvironmentInjector([
      //   { provide: PhotosService, useClass: CustomPhotosService },
      //   // {
      //   //   provide: ENVIRONMENT_INITIALIZER, useValue: () => {
      //   //     console.log("This function runs when this EnvironmentInjector gets created");
      //   //   }
      //   // }
      // ]),

      {
        provide: GeoSearch,
        useClass: NominatimGeoSearchService
      },
      BasicAuthService,
      BasicAuthServiceMaintainer,
      {
        provide: EventingApiService,
        useClass: EventingImplApiInterface
      },
      // SensorMLXmlService,
      // // XmlService,
      {
        provide: BasicAuthInformer,
        useClass: BasicAuthInformerImplService
      },
      // {
      //   provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
      //   useClass: MockedDatasetApiV3Connector,
      //   multi: true
      // },
      DatasetApiV1ConnectorProvider,
      DatasetApiV2ConnectorProvider,
      DatasetApiV3ConnectorProvider,
      DatasetStaConnectorProvider,
      // {
      //   provide: FacetSearchConfig,
      //   useValue: {
      //     showZeroValues: true
      //   } as FacetSearchConfig
      // }
    ]
  });
});

