import { Component, input, output } from '@angular/core';

@Component({
  selector: 'n52-permalink-new-window',
  templateUrl: './permalink-new-window.component.html',
  standalone: true,
})
export class PermalinkNewWindowComponent {
  readonly url = input.required<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTriggered = output<void>();

  openInNewWindow() {
    window.open(this.url(), '_blank');
    this.onTriggered.emit();
  }
}
