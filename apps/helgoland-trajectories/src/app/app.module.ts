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
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelgolandCommonModule } from './../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { AppComponent } from './app.component';
import { ModalMainConfigComponent } from './components/modal-main-config/modal-main-config.component';
import { TrajectoryLabelComponent } from './components/trajectory-label/trajectory-label.component';
import { TrajectoryViewComponent } from './components/trajectory-view/trajectory-view.component';

export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return forkJoin([
      from(import(`../assets/i18n/${lang}.json`)),
      from(import(`../../../../libs/helgoland-common/src/i18n/${lang}.json`))
    ]).pipe(map(res => Object.assign(res[0].default, res[1].default)))
  }
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
        useClass: AppTranslateLoader
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
    HelgolandCommonModule,
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
