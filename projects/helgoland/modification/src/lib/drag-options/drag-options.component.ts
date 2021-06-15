import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'n52-drag-options',
    templateUrl: './drag-options.component.html'
})
export class DragOptionsComponent {

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onTogglePanZoom: EventEmitter<void> = new EventEmitter();

    public togglePanZoom() {
        this.onTogglePanZoom.emit();
    }
}
