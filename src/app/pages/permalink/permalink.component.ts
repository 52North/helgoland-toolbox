import { Component } from '@angular/core';
import { HelgolandPermalinkModule } from '@helgoland/permalink';

@Component({
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss'],
  imports: [
    HelgolandPermalinkModule
  ],
  standalone: true
})
export class PermalinkComponent {

  public permalinkUrl = 'test-url';

}
