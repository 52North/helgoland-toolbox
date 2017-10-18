import { NgModule } from '@angular/core';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PermalinkButtonComponent } from './permalink-button/permalink-button.component';
import { PermalinkInMailComponent } from './permalink-in-mail/permalink-in-mail.component';
import { PermalinkNewWindowComponent } from './permalink-new-window/permalink-new-window.component';
import { PermalinkToClipboardComponent } from './permalink-to-clipboard/permalink-to-clipboard.component';

const COMPONENTS = [
  PermalinkButtonComponent,
  PermalinkInMailComponent,
  PermalinkNewWindowComponent,
  PermalinkToClipboardComponent
];

@NgModule({
  imports: [
    NgbModalModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class HelgolandPermalinkModule {
}
