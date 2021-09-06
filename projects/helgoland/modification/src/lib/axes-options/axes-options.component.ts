import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'n52-axes-options',
    templateUrl: './axes-options.component.html'
})
export class AxesOptionsComponent {

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onChangeYAxesVisibility: EventEmitter<void> = new EventEmitter();

    public changeYAxesVisibility() {
        this.onChangeYAxesVisibility.emit();
    }
}
