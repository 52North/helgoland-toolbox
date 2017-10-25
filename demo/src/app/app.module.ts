import { NgModule } from '@angular/core';
import { MatButtonModule, MatExpansionModule, MatIconModule, MatListModule, MatSidenavModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import {
    HelgolandFlotGraphModule,
    HelgolandMapSelectorModule,
    HelgolandPlotlyGraphModule,
    HelgolandSelectorModule,
    HelgolandServicesModule,
} from '../../lib';
import { AppComponent } from './app.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProviderSelectorComponent } from './pages/provider-selector/provider-selector.component';

const appRoutes: Routes = [
  { path: 'provider-selector', component: ProviderSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    HelgolandServicesModule,
    HelgolandSelectorModule,
    HelgolandFlotGraphModule,
    HelgolandPlotlyGraphModule,
    HelgolandMapSelectorModule
  ],
  declarations: [
    AppComponent,
    ProviderSelectorComponent,
    MapSelectorComponent,
    PlotlyGraphComponent,
    FlotGraphComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
