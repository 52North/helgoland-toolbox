import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Required } from '@helgoland/core';

@Component({
  selector: 'n52-permalink-new-window',
  templateUrl: './permalink-new-window.component.html'
})
export class PermalinkNewWindowComponent {

  @Input() @Required
  public url!: string;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInNewWindow() {
    window.open(this.url, '_blank');
    this.onTriggered.emit();
  }

}
