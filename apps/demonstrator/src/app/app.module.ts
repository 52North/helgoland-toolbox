import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BasicAuthInformer, BasicAuthService, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import { HelgolandControlModule } from '@helgoland/control';
import {
  ApiV3InterfaceService,
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HELGOLAND_SERVICE_CONNECTOR_HANDLER,
  HelgolandCoreModule,
  SettingsService,
  SplittedDataDatasetApiInterface,
  StatusCheckService,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import {
  HelgolandDatasetDownloadModule,
  HelgolandDatasetlistModule,
  HelgolandDatasetTableModule,
} from '@helgoland/depiction';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { FacetSearchConfig, HelgolandFacetSearchModule } from '@helgoland/facet-search';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import {
  GeoSearch,
  HelgolandLayerControlModule,
  HelgolandMapControlModule,
  HelgolandMapSelectorModule,
  HelgolandMapViewModule,
  NominatimGeoSearchService,
} from '@helgoland/map';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandOpenLayersModule } from '@helgoland/open-layers';
import { HelgolandPermalinkModule } from '@helgoland/permalink';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { SensorMLXmlService, XmlService } from '@helgoland/sensorml';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandTimeRangeSliderModule } from '@helgoland/time-range-slider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { D3GeneralPopupComponent } from './components/d3-general-popup/d3-general-popup.component';
import { ExportPopupComponent } from './components/export-popup/export-popup.component';
import { GeometryViewComponent } from './components/geometry-view/geometry-view.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { StyleModificationComponent } from './components/style-modification/style-modification.component';
import { TimezoneSelectorComponent } from './components/timezone-selector/timezone-selector.component';
import { MockedApiV3InterfaceService, MockedDatasetApiV3Connector } from './mocked/mocked';
import { AdditionalDataGraphComponent } from './pages/additional-data-graph/additional-data-graph.component';
import { BasicAuthInformerImplService } from './pages/basic-auth-informer-impl.service';
import { DiagramExportComponent } from './pages/diagram-export/diagram-export.component';
import { NoDataEntryComponent } from './pages/diagram-export/no-data-entry/no-data-entry.component';
import { EventingComponent } from './pages/eventing/eventing.component';
import { FacetSearchComponent } from './pages/facet-search/facet-search.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { ListSelectionComponent } from './pages/list-selection/list-selection.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { OlComponent } from './pages/ol/ol.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';
import { SensormlComponent } from './pages/sensorml/sensorml.component';
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
  },
  MatDatepickerModule,
  SensorMLXmlService,
  XmlService
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
    OlComponent,
    PermalinkComponent,
    PlotlyGraphComponent,
    ProfileEntryComponent,
    ServiceFilterSelectorDemoPageComponent,
    ServiceSelectorComponent,
    StyleModificationComponent,
    TableComponent,
    TimeComponent,
    TimeseriesGraphComponent,
    TrajectoryComponent,
    ExportPopupComponent,
    DiagramExportComponent,
    NoDataEntryComponent,
    FacetSearchComponent,
    SandboxComponent,
    SensormlComponent,
    TimezoneSelectorComponent,
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
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    BrowserAnimationsModule,
    HelgolandSelectorModule,
    HelgolandCachingModule.forRoot({
      cachingDurationInMilliseconds: 300000,
      getDataCacheActive: false
    }),
    HelgolandCoreModule,
    HelgolandTimeModule,
    HelgolandFavoriteModule,
    HelgolandPermalinkModule,
    HelgolandControlModule,
    HelgolandMapSelectorModule,
    HelgolandFacetSearchModule,
    HelgolandMapControlModule,
    HelgolandLayerControlModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandDatasetlistModule,
    HelgolandTimeRangeSliderModule,
    HelgolandD3Module,
    HelgolandDatasetTableModule,
    HelgolandPlotlyModule,
    HelgolandBasicAuthModule,
    HelgolandDatasetDownloadModule,
    HelgolandOpenLayersModule
  ],
  entryComponents: [
    StyleModificationComponent,
    GeometryViewComponent,
    D3GeneralPopupComponent,
    ExportPopupComponent
  ],
  providers: [
    APP_PROVIDERS,
    {
      provide: BasicAuthInformer,
      useClass: BasicAuthInformerImplService
    },
    {
      provide: HELGOLAND_SERVICE_CONNECTOR_HANDLER,
      useClass: MockedDatasetApiV3Connector,
      multi: true
    },
    DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    DatasetApiV3ConnectorProvider,
    DatasetStaConnectorProvider,
    {
      provide: FacetSearchConfig,
      useValue: {
        showZeroValues: true
      } as FacetSearchConfig
    }
  ]
})
export class AppModule { }
