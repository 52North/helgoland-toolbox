import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HelgolandCoreModule,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { D3TimeseriesGraphErrorHandler, HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule, HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HelgolandCommonModule } from 'helgoland-common';
import { ColorPickerModule } from 'ngx-color-picker';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { EditLabelComponent } from './components/edit-label/edit-label.component';
import {
  FavoriteToggleButtonComponent,
} from './components/favorites/favorite-toggle-button/favorite-toggle-button.component';
import {
  ModalFavoriteListButtonComponent,
} from './components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import { ModalFavoriteListComponent } from './components/favorites/modal-favorite-list/modal-favorite-list.component';
import { LegendEntryComponent } from './components/legend-entry/legend-entry.component';
import {
  ModalMainConfigButtonComponent,
} from './components/main-config/modal-main-config-button/modal-main-config-button.component';
import { ModalMainConfigComponent } from './components/main-config/modal-main-config/modal-main-config.component';
import {
  ModalDatasetByStationSelectorComponent,
} from './components/modal-dataset-by-station-selector/modal-dataset-by-station-selector.component';
import { ModalDiagramSettingsComponent } from './components/modal-diagram-settings/modal-diagram-settings.component';
import {
  ModalEditTimeseriesOptionsComponent,
} from './components/modal-edit-timeseries-options/modal-edit-timeseries-options.component';
import {
  TimeseriesSymbolSelectComponent,
} from './components/modal-edit-timeseries-options/timeseries-symbol-select/timeseries-symbol-select.component';
import { ModalMapSettingsComponent } from './components/modal-map-settings/modal-map-settings.component';
import { GeneralTimeSelectionComponent } from './components/time/general-time-selection/general-time-selection.component';
import { TimeseriesListSelectorComponent } from './components/timeseries-list-selector/timeseries-list-selector.component';
import { LIST_SELECTION_ROUTE, MAP_SELECTION_ROUTE } from './services/app-router.service';
import { AppConfig, ConfigurationService } from './services/configuration.service';
import { CustomD3TimeseriesGraphErrorHandler } from './services/timeseries-graph-error-handler';
import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';
import { ListSelectionViewComponent } from './views/list-selection-view/list-selection-view.component';
import { ModalListSettingsComponent } from './views/list-selection-view/modal-list-settings/modal-list-settings.component';
import { MapSelectionViewComponent } from './views/map-selection-view/map-selection-view.component';

export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return forkJoin([
      from(import(`../assets/i18n/${lang}.json`)),
      from(import(`../../../helgoland-common/src/i18n/${lang}.json`))
    ]).pipe(map(res => Object.assign(res[0].default, res[1].default)))
  }
}

export const ROUTES = [
  {
    path: MAP_SELECTION_ROUTE,
    component: MapSelectionViewComponent
  },
  {
    path: LIST_SELECTION_ROUTE,
    component: ListSelectionViewComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: DiagramViewComponent
  }
];

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
    DiagramViewComponent,
    EditLabelComponent,
    FavoriteToggleButtonComponent,
    GeneralTimeSelectionComponent,
    LegendEntryComponent,
    ListSelectionViewComponent,
    MapSelectionViewComponent,
    ModalDatasetByStationSelectorComponent,
    ModalDiagramSettingsComponent,
    ModalEditTimeseriesOptionsComponent,
    TimeseriesSymbolSelectComponent,
    ModalFavoriteListButtonComponent,
    ModalFavoriteListComponent,
    ModalMainConfigButtonComponent,
    ModalMainConfigComponent,
    ModalMapSettingsComponent,
    ModalListSettingsComponent,
    TimeseriesListSelectorComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { initialNavigation: 'enabled', relativeLinkResolution: 'legacy' }),
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
    ClipboardModule,
    ColorPickerModule,
    HelgolandCommonModule,
    HelgolandCoreModule,
    HelgolandD3Module,
    HelgolandDatasetlistModule,
    HelgolandFavoriteModule,
    HelgolandLabelMapperModule,
    HelgolandMapSelectorModule,
    HelgolandSelectorModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    {
      provide: D3TimeseriesGraphErrorHandler,
      useClass: CustomD3TimeseriesGraphErrorHandler
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [ConfigurationService, TranslateService],
      multi: true
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetStaConnectorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
