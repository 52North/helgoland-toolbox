import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { FilterLabelComponent } from './components/multi-parameter-selection/filter-label/filter-label.component';
import { ParameterListSelectorComponent } from './components/parameter-list-selector/parameter-list-selector.component';
import { ServiceListSelectorComponent } from './components/service-list-selector/service-list-selector.component';
import { VersionInfoComponent } from './components/version-info/version-info.component';

const COMPONENTS = [
  FilterLabelComponent,
  LanguageSelectorComponent,
  ParameterListSelectorComponent,
  ServiceListSelectorComponent,
  VersionInfoComponent,
];

@NgModule({
  imports: [
    CommonModule,
    HelgolandCoreModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    TranslateModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: []
})
export class HelgolandCommonModule { }
