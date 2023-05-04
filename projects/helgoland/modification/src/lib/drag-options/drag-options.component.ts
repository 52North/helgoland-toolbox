import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'n52-drag-options',
    templateUrl: './drag-options.component.html',
    standalone: true
})
export class DragOptionsComponent {

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onTogglePanZoom: EventEmitter<void> = new EventEmitter();

    public togglePanZoom() {
        this.onTogglePanZoom.emit();
    }
}
