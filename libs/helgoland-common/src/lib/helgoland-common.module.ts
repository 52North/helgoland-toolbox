import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { VersionInfoComponent } from './components/version-info/version-info.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    HelgolandCoreModule,
    TranslateModule
  ],
  declarations: [
    LanguageSelectorComponent,
    VersionInfoComponent
  ],
  exports: [
    LanguageSelectorComponent,
    VersionInfoComponent
  ],
  providers: []
})
export class HelgolandCommonModule { }
