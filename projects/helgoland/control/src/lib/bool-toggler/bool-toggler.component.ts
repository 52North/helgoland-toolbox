import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'n52-bool-toggler',
    templateUrl: './bool-toggler.component.html',
    standalone: true,
    imports: [NgClass]
})
export class BoolTogglerComponent {

    @Input()
    public value: boolean | undefined;

    @Input()
    public icon: string | undefined;

    @Input()
    public tooltip: string | undefined;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    public onToggled: EventEmitter<boolean> = new EventEmitter();

    public toggle() {
        this.onToggled.emit(!this.value);
    }
}
