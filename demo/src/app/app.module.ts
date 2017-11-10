import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatListModule, MatRadioModule, MatSidenavModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
    Config,
    HelgolandDatasetlistModule,
    HelgolandFlotGraphModule,
    HelgolandMapSelectorModule,
    HelgolandModificationModule,
    HelgolandPlotlyGraphModule,
    HelgolandSelectorModule,
    HelgolandServicesModule,
    HttpCache,
    HelgolandTimeModule,
    Settings,
} from '../../../src';
import { CachingInterceptor } from './../../../src/services/api-interface/caching/caching-interceptor';
import { LocalHttpCache } from './../../../src/services/api-interface/caching/local-cache';
import { AppComponent } from './app.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { StyleModificationComponent } from './pages/profile-entry/style-modification/style-modification.component';
import { ProviderSelectorComponent } from './pages/provider-selector/provider-selector.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { TimeComponent } from './pages/time/time.component';

const appRoutes: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'profile-entry', component: ProfileEntryComponent },
  { path: 'graph-legend', component: GraphLegendComponent },
  { path: 'time', component: TimeComponent },
  { path: '**', redirectTo: '/map-selector', pathMatch: 'full' }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable()
export class SettingsService extends Settings {

  public config: Config;

  constructor() {
    super();
    this.config = {
      solveLabels: true,
      proxyUrl: 'https://cors-anywhere.herokuapp.com/'
    };
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HelgolandServicesModule,
    HelgolandSelectorModule,
    HelgolandFlotGraphModule,
    HelgolandPlotlyGraphModule,
    HelgolandMapSelectorModule,
    HelgolandDatasetlistModule,
    HelgolandModificationModule,
    HelgolandTimeModule
  ],
  entryComponents: [
    StyleModificationComponent
  ],
  declarations: [
    AppComponent,
    LocalSelectorImplComponent,
    ProviderSelectorComponent,
    MapSelectorComponent,
    PlotlyGraphComponent,
    FlotGraphComponent,
    ServiceFilterSelectorDemoPageComponent,
    ProfileEntryComponent,
    StyleModificationComponent,
    GraphLegendComponent,
    TimeComponent
  ],
  providers: [
    {
      provide: Settings,
      useClass: SettingsService
    }, {
      provide: HttpCache,
      useClass: LocalHttpCache
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
