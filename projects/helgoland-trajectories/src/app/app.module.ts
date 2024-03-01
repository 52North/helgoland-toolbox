import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  HelgolandCoreModule,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ClearStorageButtonComponent,
  DarkModeButtonComponent,
  LanguageSelectorComponent,
  LoadingOverlayProgressBarComponent,
  LoadingOverlaySpinnerComponent,
  ParameterListSelectorComponent,
  ServiceListSelectorComponent,
  ShareButtonComponent,
  VersionInfoComponent,
} from 'helgoland-common';
import { ColorPickerModule } from 'ngx-color-picker';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { LegendEntryComponent } from './components/legend-entry/legend-entry.component';
import { ModalMainConfigComponent } from './components/modal-main-config/modal-main-config.component';
import {
  ModalTrajectorySelectionComponent,
} from './components/modal-trajectory-selection/modal-trajectory-selection.component';
import {
  ParameterTypeLabelComponent,
} from './components/modal-trajectory-selection/parameter-type-label/parameter-type-label.component';
import { TrajectoryLabelComponent } from './components/trajectory-label/trajectory-label.component';
import { TrajectoryViewComponent } from './components/trajectory-view/trajectory-view.component';
import { AppConfig, ConfigurationService } from './services/configuration.service';

export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return forkJoin([
      from(import(`../assets/i18n/${lang}.json`)),
      from(import(`../../../helgoland-common/src/i18n/${lang}.json`))
    ]).pipe(map(res => Object.assign(res[0].default, res[1].default)))
  }
}

export function initApplication(configService: ConfigurationService, translate: TranslateService): () => Promise<void> {
  return () => configService.loadConfiguration().then((config: AppConfig) => {
    registerLocaleData(localeDe);
    let lang = translate.getBrowserLang() || 'en';
    const url = window.location.href;
    const name = 'locale';
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (results && results[2]) {
      const match = config.languages.find(e => e.code === results[2]);
      if (match) { lang = match.code; }
    }
    translate.setDefaultLang(lang);
    return translate.use(lang).toPromise();
  });
}

@NgModule({
  declarations: [
    AppComponent,
    TrajectoryLabelComponent,
    TrajectoryViewComponent,
    ModalMainConfigComponent,
    ModalTrajectorySelectionComponent,
    ParameterTypeLabelComponent,
    LegendEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([{
      path: '**',
      pathMatch: 'full',
      component: TrajectoryViewComponent
    }], {}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader
      }
    }),
    BrowserAnimationsModule,
    HelgolandCachingModule.forRoot({
      cachingDurationInMilliseconds: 300000,
      getDataCacheActive: false
    }),
    ColorPickerModule,
    HelgolandCoreModule,
    HelgolandD3Module,
    HelgolandDatasetlistModule,
    HelgolandMapViewModule,
    HelgolandSelectorModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    ClearStorageButtonComponent,
    DarkModeButtonComponent,
    LanguageSelectorComponent,
    LoadingOverlayProgressBarComponent,
    LoadingOverlaySpinnerComponent,
    ParameterListSelectorComponent,
    ServiceListSelectorComponent,
    ShareButtonComponent,
    VersionInfoComponent,
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: SettingsService,
      useExisting: ConfigurationService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [ConfigurationService, TranslateService],
      multi: true
    },
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    // DatasetStaConnectorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
