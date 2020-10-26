import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
} from '@angular-material-components/color-picker';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
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
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule, HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandMapSelectorModule } from '@helgoland/map';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { ClearStorageComponent } from './components/main-config/clear-storage/clear-storage.component';
import { LanguageSelectorComponent } from './components/main-config/language-selector/language-selector.component';
import {
  ModalMainConfigButtonComponent,
} from './components/main-config/modal-main-config-button/modal-main-config-button.component';
import { ModalMainConfigComponent } from './components/main-config/modal-main-config/modal-main-config.component';
import { VersionInfoComponent } from './components/main-config/version-info/version-info.component';
import {
  ModalDatasetByStationSelectorComponent,
} from './components/modal-dataset-by-station-selector/modal-dataset-by-station-selector.component';
import { ModalDiagramSettingsComponent } from './components/modal-diagram-settings/modal-diagram-settings.component';
import {
  ModalEditTimeseriesOptionsComponent,
} from './components/modal-edit-timeseries-options/modal-edit-timeseries-options.component';
import { ModalMapSettingsComponent } from './components/modal-map-settings/modal-map-settings.component';
import { PhenomenonListSelectorComponent } from './components/phenomenon-list-selector/phenomenon-list-selector.component';
import { ServiceListSelectorComponent } from './components/service-list-selector/service-list-selector.component';
import { MAP_SELECTION_ROUTE } from './services/app-router.service';
import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';
import { MapSelectionViewComponent } from './views/map-selection-view/map-selection-view.component';

export function HttpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const ROUTES = [
  {
    path: MAP_SELECTION_ROUTE,
    component: MapSelectionViewComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    component: DiagramViewComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ClearStorageComponent,
    DiagramViewComponent,
    FavoriteToggleButtonComponent,
    LanguageSelectorComponent,
    LegendEntryComponent,
    LoadingOverlayComponent,
    MapSelectionViewComponent,
    ModalDatasetByStationSelectorComponent,
    ModalDiagramSettingsComponent,
    ModalFavoriteListButtonComponent,
    ModalFavoriteListComponent,
    ModalMainConfigButtonComponent,
    ModalMainConfigComponent,
    ModalMapSettingsComponent,
    PhenomenonListSelectorComponent,
    ServiceListSelectorComponent,
    VersionInfoComponent,
    EditLabelComponent,
    ModalEditTimeseriesOptionsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { initialNavigation: 'enabled' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    HelgolandCachingModule.forRoot({
      cachingDurationInMilliseconds: 300000,
      getDataCacheActive: false
    }),
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
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatToolbarModule,
    NgxMatColorPickerModule
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetStaConnectorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
