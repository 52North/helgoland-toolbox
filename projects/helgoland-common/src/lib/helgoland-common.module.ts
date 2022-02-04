import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { BasicAuthLoginComponent } from './components/basic-auth-login/basic-auth-login.component';
import { ClearStorageButtonComponent } from './components/clear-storage-button/clear-storage-button.component';
import { DarkModeButtonComponent } from './components/dark-mode-button/dark-mode-button.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import {
  LoadingOverlayProgressBarComponent,
} from './components/loading-overlay-progress-bar/loading-overlay-progress-bar.component';
import { LoadingOverlaySpinnerComponent } from './components/loading-overlay-spinner/loading-overlay-spinner.component';
import { FilterLabelComponent } from './components/multi-parameter-selection/filter-label/filter-label.component';
import { ParameterListSelectorComponent } from './components/parameter-list-selector/parameter-list-selector.component';
import { ServiceListSelectorComponent } from './components/service-list-selector/service-list-selector.component';
import { ShareButtonComponent } from './components/share-button/share-button.component';
import { VersionInfoComponent } from './components/version-info/version-info.component';
import { BasicAuthInformerImplService } from './services/basic-auth-informer-impl.service';

const COMPONENTS = [
  ClearStorageButtonComponent,
  DarkModeButtonComponent,
  FilterLabelComponent,
  LanguageSelectorComponent,
  LoadingOverlayProgressBarComponent,
  LoadingOverlaySpinnerComponent,
  ParameterListSelectorComponent,
  ServiceListSelectorComponent,
  ShareButtonComponent,
  VersionInfoComponent,
  BasicAuthLoginComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HelgolandBasicAuthModule,
    HelgolandCoreModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTooltipModule,
    TranslateModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    {
      provide: BasicAuthInformer,
      useClass: BasicAuthInformerImplService
    }
  ]
})
export class HelgolandCommonModule { }
