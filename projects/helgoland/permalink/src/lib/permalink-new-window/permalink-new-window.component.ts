import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-new-window',
  templateUrl: './permalink-new-window.component.html'
})
export class PermalinkNewWindowComponent {

  @Input()
  public url: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInNewWindow() {
    window.open(this.url, '_blank');
    this.onTriggered.emit();
  }

}
