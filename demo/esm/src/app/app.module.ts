import { HelgolandServicesModule, HelgolandSelectorModule, HelgolandFlotGraphModule } from '../../lib';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, HelgolandServicesModule, HelgolandSelectorModule, HelgolandFlotGraphModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
