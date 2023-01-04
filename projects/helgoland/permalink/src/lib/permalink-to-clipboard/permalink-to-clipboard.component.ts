import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Required } from '@helgoland/core';

@Component({
  selector: 'n52-permalink-to-clipboard',
  templateUrl: './permalink-to-clipboard.component.html'
})
export class PermalinkToClipboardComponent {

  @Input() @Required
  public url!: string;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

}
