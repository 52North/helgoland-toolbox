import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {
    HelgolandFlotGraphModule,
    HelgolandMapSelectorModule,
    HelgolandPlotlyGraphModule,
    HelgolandSelectorModule,
    HelgolandServicesModule,
} from '../../lib';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    HelgolandServicesModule,
    HelgolandSelectorModule,
    HelgolandFlotGraphModule,
    HelgolandPlotlyGraphModule,
    HelgolandMapSelectorModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
