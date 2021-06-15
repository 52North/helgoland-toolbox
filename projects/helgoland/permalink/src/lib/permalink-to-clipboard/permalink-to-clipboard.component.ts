import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-to-clipboard',
  templateUrl: './permalink-to-clipboard.component.html'
})
export class PermalinkToClipboardComponent {

  @Input()
  public url: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

}
