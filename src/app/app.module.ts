import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BasicAuthInformer, BasicAuthService, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import { HelgolandControlModule } from '@helgoland/control';
import {
  DatasetApiInterface,
  HelgolandCoreModule,
  SettingsService,
  SplittedDataDatasetApiInterface,
  StatusCheckService,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule, HelgolandDatasetTableModule, HelgolandDatasetDownloadModule } from '@helgoland/depiction';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import {
  GeoSearch,
  HelgolandMapControlModule,
  HelgolandMapSelectorModule,
  HelgolandMapViewModule,
  NominatimGeoSearchService,
} from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandPermalinkModule } from '@helgoland/permalink';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandTimeRangeSliderModule } from '@helgoland/time-range-slider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { D3GeneralPopupComponent } from './components/d3-general-popup/d3-general-popup.component';
import { GeometryViewComponent } from './components/geometry-view/geometry-view.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { StyleModificationComponent } from './components/style-modification/style-modification.component';
import { AdditionalDataGraphComponent } from './pages/additional-data-graph/additional-data-graph.component';
import { BasicAuthInformerImplService } from './pages/basic-auth-informer-impl.service';
import { EventingComponent } from './pages/eventing/eventing.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { ListSelectionComponent } from './pages/list-selection/list-selection.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { ServiceSelectorComponent } from './pages/service-selector/service-selector.component';
import { TableComponent } from './pages/table/table.component';
import { TimeComponent } from './pages/time/time.component';
import { TimeseriesGraphComponent } from './pages/timeseries-graph/timeseries-graph.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';
import { ExtendedSettingsService } from './settings/settings.service';

const APP_PROVIDERS = [
  StatusCheckService,
  {
    provide: DatasetApiInterface,
    useClass: SplittedDataDatasetApiInterface
  },
  {
    provide: SettingsService,
    useClass: ExtendedSettingsService
  },
  {
    provide: GeoSearch,
    useClass: NominatimGeoSearchService
  },
  BasicAuthService,
  {
    provide: EventingApiService,
    useClass: EventingImplApiInterface
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
    AdditionalDataGraphComponent,
    AppComponent,
    D3GeneralPopupComponent,
    EventingComponent,
    FavoriteComponent,
    GeometryViewComponent,
    GraphLegendComponent,
    ListSelectionComponent,
    LocalSelectorImplComponent,
    MapSelectorComponent,
    MapViewComponent,
    PermalinkComponent,
    PlotlyGraphComponent,
    ProfileEntryComponent,
    ServiceFilterSelectorDemoPageComponent,
    ServiceSelectorComponent,
    StyleModificationComponent,
    TableComponent,
    TimeComponent,
    TimeseriesGraphComponent,
    TrajectoryComponent
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
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HelgolandSelectorModule,
    HelgolandCachingModule,
    HelgolandCoreModule,
    HelgolandTimeModule,
    HelgolandFavoriteModule,
    HelgolandPermalinkModule,
    HelgolandControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandDatasetlistModule,
    HelgolandTimeRangeSliderModule,
    HelgolandD3Module,
    HelgolandDatasetTableModule,
    HelgolandPlotlyModule,
    HelgolandBasicAuthModule,
    HelgolandDatasetDownloadModule
  ],
  entryComponents: [
    StyleModificationComponent,
    GeometryViewComponent,
    D3GeneralPopupComponent
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: BasicAuthInformer,
      useClass: BasicAuthInformerImplService
    }
  ]
})
export class AppModule { }
