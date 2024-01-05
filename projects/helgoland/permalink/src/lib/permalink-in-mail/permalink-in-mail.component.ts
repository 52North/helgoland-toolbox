import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Required } from '@helgoland/core';

@Component({
  selector: 'n52-permalink-in-mail',
  templateUrl: './permalink-in-mail.component.html',
  standalone: true,
})
export class PermalinkInMailComponent {
  @Input()
  @Required
  public url!: string;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInMail() {
    window.location.href = 'mailto:?body=' + encodeURIComponent(this.url);
    this.onTriggered.emit();
  }
}
