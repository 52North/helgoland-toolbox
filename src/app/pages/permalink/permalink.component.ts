import { Component } from '@angular/core';
import {
  PermalinkInMailComponent,
  PermalinkNewWindowComponent,
  PermalinkToClipboardComponent,
} from '@helgoland/permalink';

@Component({
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss'],
  imports: [
    PermalinkInMailComponent,
    PermalinkToClipboardComponent,
    PermalinkNewWindowComponent,
  ],
})
export class PermalinkComponent {
  public permalinkUrl = 'test-url';
}
