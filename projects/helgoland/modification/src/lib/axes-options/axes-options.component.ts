import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'n52-axes-options',
    templateUrl: './axes-options.component.html'
})
export class AxesOptionsComponent {

    @Output()
    public onChangeYAxesVisibility: EventEmitter<void> = new EventEmitter();

    public changeYAxesVisibility() {
        this.onChangeYAxesVisibility.emit();
    }
}
