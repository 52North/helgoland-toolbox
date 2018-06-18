import { Component } from '@angular/core';
import { selector } from 'rxjs/operator/publish';

@Component({
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent {

  public permalinkUrl = 'test-url';

}
