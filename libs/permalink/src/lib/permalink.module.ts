import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

import { PermalinkInMailComponent } from './permalink-in-mail/permalink-in-mail.component';
import { PermalinkNewWindowComponent } from './permalink-new-window/permalink-new-window.component';
import { PermalinkToClipboardComponent } from './permalink-to-clipboard/permalink-to-clipboard.component';

const COMPONENTS = [
  PermalinkInMailComponent,
  PermalinkNewWindowComponent,
  PermalinkToClipboardComponent
];

/**
 * The permalink module includes the following functionality:
 * - permalink handling to parse and create permalinks
 */
@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    ClipboardModule
  ],
  exports: [
    COMPONENTS
  ],
  providers: [
  ]
})
export class HelgolandPermalinkModule { }
