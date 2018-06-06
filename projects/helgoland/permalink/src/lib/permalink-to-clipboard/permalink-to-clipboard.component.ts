import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-to-clipboard',
  templateUrl: './permalink-to-clipboard.component.html'
})
export class PermalinkToClipboardComponent {

  @Input()
  public url: string;

  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

}
