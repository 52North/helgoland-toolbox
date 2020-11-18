import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DatasetApiInterface,
  DatasetApiV2ConnectorProvider,
  HelgolandCoreModule,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { ModalMainConfigComponent } from './components/modal-main-config/modal-main-config.component';
import { TrajectoryLabelComponent } from './components/trajectory-label/trajectory-label.component';
import { TrajectoryViewComponent } from './components/trajectory-view/trajectory-view.component';

export function HttpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    TrajectoryLabelComponent,
    TrajectoryViewComponent,
    ModalMainConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpTranslateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatToolbarModule,
    HelgolandCoreModule,
    HelgolandD3Module,
    HelgolandMapViewModule,
    HelgolandDatasetlistModule
  ],
  providers: [
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    },
    // DatasetApiV1ConnectorProvider,
    DatasetApiV2ConnectorProvider,
    // DatasetApiV3ConnectorProvider,
    // DatasetStaConnectorProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
