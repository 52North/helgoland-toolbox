import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatListModule, MatRadioModule, MatSidenavModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
    Config,
    HelgolandFlotGraphModule,
    HelgolandMapSelectorModule,
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
import { ProviderSelectorComponent } from './pages/provider-selector/provider-selector.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';

const appRoutes: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent }
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
    HelgolandMapSelectorModule
  ],
  declarations: [
    AppComponent,
    LocalSelectorImplComponent,
    ProviderSelectorComponent,
    MapSelectorComponent,
    PlotlyGraphComponent,
    FlotGraphComponent,
    ServiceFilterSelectorDemoPageComponent
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
