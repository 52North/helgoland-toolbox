import { StyleModificationComponent } from './pages/profile-entry/style-modification/style-modification.component';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatDialogModule, MatListModule, MatRadioModule, MatSidenavModule, MatButtonModule } from '@angular/material';
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
    Settings,
} from '../../lib';
import { AppComponent } from './app.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { ProviderSelectorComponent } from './pages/provider-selector/provider-selector.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';

const appRoutes: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'profile-entry', component: ProfileEntryComponent }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable()
export class SettingsService extends Settings {

  public config: Config;

  constructor() {
    super();
    this.config = new Config();
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
    HelgolandModificationModule
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
    StyleModificationComponent
  ],
  providers: [
    {
      provide: Settings,
      useClass: SettingsService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
