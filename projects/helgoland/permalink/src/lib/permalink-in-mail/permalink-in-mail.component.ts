import { Component, input, output } from '@angular/core';

@Component({
  selector: 'n52-permalink-in-mail',
  templateUrl: './permalink-in-mail.component.html',
  standalone: true,
})
export class PermalinkInMailComponent {
  readonly url = input.required<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTriggered = output<void>();

  openInMail() {
    window.location.href = 'mailto:?body=' + encodeURIComponent(this.url());
    this.onTriggered.emit();
  }
}
