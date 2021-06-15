import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-in-mail',
  templateUrl: './permalink-in-mail.component.html'
})
export class PermalinkInMailComponent {

  @Input()
  public url: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInMail() {
    window.location.href = 'mailto:?body=' + encodeURIComponent(this.url);
    this.onTriggered.emit();
  }

}
