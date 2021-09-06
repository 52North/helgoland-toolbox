import { Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
    selector: 'n52-string-toggler',
    templateUrl: './string-toggler.component.html'
})
export class StringTogglerComponent implements OnChanges {

    @Input()
    public value: string;

    @Input()
    public option: string;

    @Input()
    public icon: string;

    @Input()
    public tooltip: string;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onToggled: EventEmitter<string> = new EventEmitter();

    public isToggled: boolean;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.isToggled = this.option === this.value;
        }
    }

    public toggle() {
        this.onToggled.emit(this.option);
    }
}
