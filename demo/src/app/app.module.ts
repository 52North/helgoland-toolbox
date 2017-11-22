import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
    Config,
    HelgolandDatasetlistModule,
    HelgolandFlotGraphModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandPlotlyGraphModule,
    HelgolandSelectorModule,
    HelgolandServicesModule,
    HelgolandTimeModule,
    HttpCache,
    LocalOngoingHttpCache,
    OnGoingHttpCache,
    Settings,
} from '../../../src';
import { HelgolandD3GraphModule } from '../../../src/components/graph/d3/d3.module';
import { HelgolandPermalinkModule } from '../../../src/components/permalink/permalink.module';
import { ApiInterface } from '../../../src/services/api-interface/api-interface';
import { LocalHttpCache } from '../../../src/services/api-interface/caching/local-http-cache';
import { GetDataApiInterface } from '../../../src/services/api-interface/getData-api-interface.service';
import { CachingInterceptor } from './../../../src/services/api-interface/caching/caching-interceptor';
import { AppComponent } from './app.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { StyleModificationComponent } from './components/style-modification/style-modification.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { ProviderSelectorComponent } from './pages/provider-selector/provider-selector.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { TimeComponent } from './pages/time/time.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';

const appRoutes: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'profile-entry', component: ProfileEntryComponent },
  { path: 'graph-legend', component: GraphLegendComponent },
  { path: 'time', component: TimeComponent },
  { path: 'trajectory', component: TrajectoryComponent },
  { path: 'permalink', component: PermalinkComponent },
  { path: 'favorite', component: FavoriteComponent },
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
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    HelgolandServicesModule,
    HelgolandSelectorModule,
    HelgolandFlotGraphModule,
    HelgolandPlotlyGraphModule,
    HelgolandMapSelectorModule,
    HelgolandMapViewModule,
    HelgolandDatasetlistModule,
    HelgolandModificationModule,
    HelgolandTimeModule,
    HelgolandD3GraphModule,
    HelgolandPermalinkModule
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
    TimeComponent,
    TrajectoryComponent,
    PermalinkComponent,
    FavoriteComponent
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
      provide: OnGoingHttpCache,
      useClass: LocalOngoingHttpCache
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    {
      provide: ApiInterface,
      useClass: GetDataApiInterface
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
