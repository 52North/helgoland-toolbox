import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'n52-drag-options',
    templateUrl: './drag-options.component.html'
})
export class DragOptionsComponent {

    @Output()
    public onTogglePanZoom: EventEmitter<void> = new EventEmitter();

    public togglePanZoom() {
        this.onTogglePanZoom.emit();
    }
}
