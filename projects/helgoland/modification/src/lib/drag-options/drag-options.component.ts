import { Component, output } from '@angular/core';

@Component({
  selector: 'n52-drag-options',
  templateUrl: './drag-options.component.html',
  standalone: true,
})
export class DragOptionsComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTogglePanZoom = output<void>();

  public togglePanZoom() {
    this.onTogglePanZoom.emit();
  }
}
