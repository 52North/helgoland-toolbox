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

@NgModule({
  imports: [
    ClipboardModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandPermalinkModule { }
