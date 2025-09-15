import { Component, input, output } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

@Component({
  selector: 'n52-permalink-to-clipboard',
  templateUrl: './permalink-to-clipboard.component.html',
  imports: [ClipboardModule],
})
export class PermalinkToClipboardComponent {
  readonly url = input.required<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTriggered = output<void>();
}
