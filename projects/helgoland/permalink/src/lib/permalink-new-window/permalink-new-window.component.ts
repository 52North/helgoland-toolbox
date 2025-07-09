import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'n52-permalink-new-window',
  templateUrl: './permalink-new-window.component.html',
  standalone: true,
})
export class PermalinkNewWindowComponent {
  @Input({ required: true })
  public url!: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTriggered = output<void>();

  public openInNewWindow() {
    window.open(this.url, '_blank');
    this.onTriggered.emit();
  }
}
